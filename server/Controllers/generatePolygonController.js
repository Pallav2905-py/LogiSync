const turf = require('@turf/turf');
const Route = require('../Models/routeModel');
const Polygon = require('../Models/polygonModel');

const generatePolygonController = async (req, res) => {
    const { routeId, startLat, startLng, endLat, endLng, checkpoints = [], bufferDistance = 0.05 } = req.body;

    console.log("generate polygon function is called");
    if (!routeId || !startLat || !startLng || !endLat || !endLng) {
        return res.status(400).send({ message: 'Route ID, Start and End Latitude/Longitude are required' });
    }

    try {
        // Fetch the route
        let route = await Route.findOne({ routeId });

        if (!route) {
            return res.status(404).send({ message: 'Route not found' });
        }

        // Generate the route polygon
        const routeCoordinates = [
            [startLng, startLat],
            ...checkpoints.map(point => [point.lng, point.lat]),
            [endLng, endLat]
        ];

        const line = turf.lineString(routeCoordinates);
        const newPolygon = turf.buffer(line, bufferDistance, { units: 'degrees' });

        let polygon = await Polygon.findOne({ route: route._id });

        if (polygon) {
            // Update existing polygon
            polygon.polygonCoordinates = newPolygon.geometry.coordinates;
            polygon.bufferDistance = bufferDistance;
        } else {
            // Create a new polygon
            polygon = new Polygon({
                route: route._id,
                polygonCoordinates: newPolygon.geometry.coordinates,
                bufferDistance
            });
        }

        // Save the polygon
        await polygon.save();

        // Link the updated or new polygon to the route
        route.polygon = polygon._id;
        await route.save();

        res.status(200).send({
            message: 'Route polygon generated and updated successfully.',
            polygonCoordinates: newPolygon.geometry.coordinates
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while generating the polygon', error });
    }
};





// INPUT
// {
//     "routeId": "some_route_id",
//     "currentLocation": {
//         "lat": 19.0760,
//         "lng": 72.8777
//     }
// }

const checkPolygon = async (req, res) => {
    const { routeId, currentLocation } = req.body;

    if (!routeId || !currentLocation || !currentLocation.lat || !currentLocation.lng) {
        return res.status(400).json({ success: false, message: 'Route ID and current location (latitude and longitude) are required.' });
    }

    try {
        // Fetch the route and populate the polygon field
        const route = await Route.findOne({ routeId })
        console.log(route);
        await route.populate('polygon');
        console.log(route);

        if (!route) return res.status(404).json({ success: false, message: 'Route not found.' });

        const polygon = route.polygon;
        if (!polygon || !polygon.polygonCoordinates || polygon.polygonCoordinates.length === 0) {
            return res.status(404).json({ success: false, message: 'Polygon for the route not found.' });
        }

        // Create a point for the current location
        const point = turf.point([currentLocation.lng, currentLocation.lat]);

        // Create a polygon feature from the polygon coordinates
        const polygonFeature = turf.polygon(polygon.polygonCoordinates);

        // Check if the current location is within the polygon
        const isInside = turf.booleanPointInPolygon(point, polygonFeature);

        res.json({
            success: true,
            isInside,
            message: isInside ? 'Current location is inside the polygon.' : 'Current location is outside the polygon.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while checking the polygon.', error });
    }
};

module.exports = { generatePolygonController, checkPolygon }
