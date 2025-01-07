import React, { useState } from 'react';
import axios from 'axios';
import { GoogleMap, Polyline, LoadScript } from '@react-google-maps/api';
import polyline from 'polyline-encoded';

// Google Maps API key
const API_KEY = 'AIzaSyDASaXREIvqyStzP1HMw7TSOEgejoAGcWE';

// Map container style
const containerStyle = {
  width: '100%',
  height: '400px'
};

const MapComponent = ({ polylineData }) => {
  const [decodedPath, setDecodedPath] = useState([]);

  React.useEffect(() => {
    if (polylineData) {
      // Decode the polyline data
      const path = polyline.decode(polylineData);
      setDecodedPath(path.map(([lat, lng]) => ({ lat, lng })));
    }
  }, [polylineData]);

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={decodedPath.length > 0 ? decodedPath[0] : { lat: 0, lng: 0 }}
        zoom={14}
      >
        {decodedPath.length > 0 && (
          <Polyline
            path={decodedPath}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

const AddressForm = () => {
  const [src, setSrc] = useState('');
  const [dest, setDest] = useState('');
  const [route, setRoute] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/api/getRoute', {
        params: {
          src,
          destination: dest
        }
      });
      setRoute(response.data);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Source:
          <input
            type="text"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Destination:
          <input
            type="text"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Get Route</button>
      </form>

      {route && <MapComponent polylineData={route.polyline} />}
    </div>
  );
};

export default AddressForm;
