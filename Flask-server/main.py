import heapq
from flask import Flask, request, jsonify
import requests
from math import radians, sin, cos, sqrt, atan2
import polyline
import json

app = Flask(__name__)

# API Keys (replace with your actual keys)
TOMTOM_API_KEY = "6P7tnJxQFKLsnrNemK5fXe1mpecwLEkv"
GOOGLE_MAPS_API_KEY = "AIzaSyDASaXREIvqyStzP1HMw7TSOEgejoAGcWE"
AQICN_API_KEY = "8f8fce3485f8ab85f1bacbbb100d083c7635b8ea"
OSRM_BASE_URL = "http://router.project-osrm.org"


def get_traffic_data(origin, destination):
    """Fetch real-time traffic data from TomTom."""
    url = f"https://api.tomtom.com/routing/1/calculateRoute/{origin}:{destination}/json?key={TOMTOM_API_KEY}&traffic=true"
    response = requests.get(url)
    print("Traffic Data:", json.dumps(response.json(), indent=2))  # Convert dict to string
    return response.json()

def get_weather_data(lat, lon):
    """Fetch meteorological data from AQICN."""
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQICN_API_KEY}"
    response = requests.get(url)
    print("Weather Data:", json.dumps(response.json(), indent=2))  # Convert dict to string
    return response.json()

def get_route_data(origin, destination):
    """Fetch route data from OSRM."""
    url = f"{OSRM_BASE_URL}/route/v1/driving/{origin};{destination}?overview=full&alternatives=true"
    response = requests.get(url)
    route_data = response.json()  # Parse JSON response

    # Debugging: Print the route data
    print("Route Data:", json.dumps(route_data, indent=2))  # Print formatted data for inspection

    return route_data


def calculate_emissions(distance_km, vehicle_type):
    """Calculate emissions based on vehicle type and distance."""
    emissions_factors = {
        "car": 120,  # grams of CO2 per km
        "truck": 200,
        "motorcycle": 90,
    }
    return distance_km * emissions_factors.get(vehicle_type, 120) / 1000  # in kg


# Haversine function for distance calculation
def haversine(coord1, coord2):
    R = 6371  # Earth's radius in kilometers
    lat1, lon1 = radians(coord1[1]), radians(coord1[0])
    lat2, lon2 = radians(coord2[1]), radians(coord2[0])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


# Function to round coordinates for matching with graph nodes
def round_coordinates(coord):
    return (round(coord[0], 5), round(coord[1], 5))  # Round to 5 decimal places


# Function to find the closest node in the graph
def find_closest_node(coords, graph):
    closest_node = None
    min_distance = float("inf")
    for node in graph.edges.keys():
        dist = haversine(coords, node)
        if dist < min_distance:
            min_distance = dist
            closest_node = node
    return closest_node


import heapq

class Graph:
    """Graph structure for A* algorithm."""

    def __init__(self):
        # Initialize the graph's edges as an empty dictionary
        self.edges = {}

    def add_edge(self, from_node, to_node, cost):
        """Adds an edge from 'from_node' to 'to_node' with a specified cost."""
        if from_node not in self.edges:
            self.edges[from_node] = []
        self.edges[from_node].append((to_node, cost))

    def get_neighbors(self, node):
        """Returns the neighbors of the node along with the associated costs."""
        return self.edges.get(node, [])

    def a_star(self, start, goal, heuristic):
        """
        Performs A* search to find the shortest path from 'start' to 'goal'.
        
        :param start: The starting node.
        :param goal: The goal node.
        :param heuristic: The heuristic function used to estimate the cost from a node to the goal.
        :return: A tuple (path, cost) where:
            - path is the list of nodes representing the optimal path from 'start' to 'goal'.
            - cost is the total cost of the path.
        """
        open_set = []  # List of nodes to explore, stored as a priority queue (min-heap)
        heapq.heappush(open_set, (0, start))  # Start with the starting node and a cost of 0
        came_from = {}  # Maps each node to its predecessor in the optimal path
        cost_so_far = {start: 0}  # Maps each node to the total cost to reach it

        while open_set:
            _, current = heapq.heappop(open_set)  # Get the node with the lowest cost (priority)

            if current == goal:
                # Reconstruct the path from 'start' to 'goal'
                path = []
                while current:
                    path.append(current)
                    current = came_from.get(current)
                path.reverse()  # Reverse the path to get it from start to goal
                return path, cost_so_far[goal]

            # Explore each neighbor of the current node
            for neighbor, cost in self.get_neighbors(current):
                new_cost = cost_so_far[current] + cost  # Calculate the new cost to reach the neighbor
                if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                    # If the neighbor has not been visited or we found a cheaper path to it
                    cost_so_far[neighbor] = new_cost
                    priority = new_cost + heuristic(neighbor, goal)  # Total estimated cost (cost + heuristic)
                    heapq.heappush(open_set, (priority, neighbor))  # Add neighbor to open set with priority
                    came_from[neighbor] = current  # Set the current node as the predecessor of the neighbor

        return None, float("inf")  # Return None and infinite cost if no path is found



def heuristic(node, goal):
    """Simple heuristic for A* (straight-line distance)."""
    return abs(node[0] - goal[0]) + abs(node[1] - goal[1])
# Updated debug function to accept coordinates and graph as parameters
def debug_coordinates(origin_coords, destination_coords, graph):
    print("Origin Coordinates:", origin_coords)
    print("Destination Coordinates:", destination_coords)
    print("Nodes in the Graph:")
    for node in graph.edges.keys():
        print(node)

@app.route('/optimize_route', methods=['POST'])
def optimize_route():
    # Initialize the graph
    graph = Graph()

    data = request.json
    origin = data.get('origin')  # "longitude,latitude"
    destination = data.get('destination')  # "longitude,latitude"
    vehicle_type = data.get('vehicle_type', 'car')

    # Parse coordinates
    origin_coords = tuple(map(float, origin.split(',')))
    destination_coords = tuple(map(float, destination.split(',')))

    # Debug: Print coordinates and graph nodes
    debug_coordinates(origin_coords, destination_coords, graph)

    # Fetch traffic and route data
    traffic_data = get_traffic_data(origin, destination)
    route_data = get_route_data(origin, destination)

    # Print out route_data for debugging
    print("Route Data:", route_data)

    # Check if 'routes' exist in route_data and is a list
    if 'routes' in route_data and isinstance(route_data['routes'], list):
        for route in route_data['routes']:
            # Check if 'geometry' exists and is a valid field
            if 'geometry' in route:
                geometry = route['geometry']
                if isinstance(geometry, dict) and 'coordinates' in geometry:
                    coordinates = geometry['coordinates']
                    if isinstance(coordinates, list):
                        for i in range(len(coordinates) - 1):
                            from_node = tuple(coordinates[i])
                            to_node = tuple(coordinates[i + 1])
                            distance = route['distance'] / 1000  # Convert to km
                            graph.add_edge(from_node, to_node, distance)
                    else:
                        print("Error: Coordinates are not in the expected format")
                else:
                    print("Error: 'geometry' does not contain coordinates or has an invalid structure")
            else:
                print("Error: 'geometry' field is missing from the route data")
    else:
        print("Error: 'routes' not found or is not in the expected format")

    # Find the closest node to origin and destination
    origin_node = find_closest_node(origin_coords, graph)
    destination_node = find_closest_node(destination_coords, graph)

    if not origin_node or not destination_node:
        return jsonify({"error": "Unable to match coordinates to graph nodes"}), 404

    # Calculate optimal route using A*
    optimal_route, total_distance = graph.a_star(origin_node, destination_node, heuristic)

    # Calculate emissions
    emissions = calculate_emissions(total_distance, vehicle_type)

    return jsonify({
        'optimal_route': optimal_route,
        'total_distance_km': total_distance,
        'emissions_kg': emissions,
        'traffic_data': traffic_data,
    })


@app.route("/weather", methods=["GET"])
def weather():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    weather_data = get_weather_data(lat, lon)
    return jsonify(weather_data)


if __name__ == "__main__":
    app.run(debug=True)
