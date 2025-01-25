const axios = require('axios');
const qs = require('qs'); 

const clientId = '9650c86f-446e-4370-bba8-eca66244f306';
const clientSecret = 'xOpgEOnOqC85mk4H3RfWodM2167hQCjB';

const getRoute = async (req, res) => {
    try {
        const { src, destination } = req.body;

        // Get coordinates for source and destination
        const [srcLng, srcLat] = await geoCode(src);
        const [destLng, destLat] = await geoCode(destination);

        // Ensure that both geocodes succeeded
        if (srcLng && srcLat && destLng && destLat) {


          const url  = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${srcLat},${srcLng}&destinations=${destLat},${destLng}&api_key=BKKuelntiF2tj1X8szaYofVsBygwxhBRJlRZFrKb&mode=driving`
          console.log(url);
          
          const {data}  = await axios.get(url);
         
            
            res.status(200).json({
                duration: data.rows[0].elements[0].duration/3600 + " Hours",
                distance: data.rows[0].elements[0].distance/1000 + " Km",
                polyline: data.rows[0].elements[0].polyline,
            });
        } else {
            res.status(400).json({ error: "Could not fetch coordinates for source or destination" });
        }
    } catch (error) {
        console.error('Error in getRoute:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getAccessToken() {
    try {
        const response = await axios.post('https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token', 
            qs.stringify({
                grant_type: 'client_credentials',
                scope: 'openid',
                client_id: clientId,
                client_secret: clientSecret
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
  
        const accessToken = response.data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to obtain access token');
    }
}

async function geoCode(searchText) {
    const accessToken = await getAccessToken();

    if (accessToken) {
        try {
            const { data } = await axios.get('https://api.olamaps.io/places/v1/geocode', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    address: searchText
                }
            });

            if (data.geocodingResults && data.geocodingResults.length > 0) {
                const { lng, lat } = data.geocodingResults[0].geometry.location;
                return [lng, lat];
            } else {
                console.error('No geocoding results found');
                return [];
            }

        } catch (error) {
            console.error('Error fetching geocoding results:', error.response ? error.response.data : error.message);
            return [];
        }
    } else {
        console.error('No access token available');
        return [];
    }
}




module.exports = getRoute;
