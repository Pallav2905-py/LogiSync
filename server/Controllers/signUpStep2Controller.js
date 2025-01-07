const axios = require('axios');

require("dotenv").config();
const RAPID_API_KEY = process.env.RAPID_API_KEY;


const signUpStep2Controller = async (req, res) => {
    const { GST_NUM, CIN_NUM } = req.body;

    console.log(GST_NUM);
    

    // Verifying GST
    const options = {
        method: 'POST',
        url: 'https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate',
        headers: {
          'x-rapidapi-key': '67f433f84dmsh7f82025bf2cc89dp133463jsne9c975960946',
          'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
          group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
          data: {
            gstin: `${GST_NUM}`
          }
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log(response.data);
        res.status(200).json({msg:"Verified"})
      } catch (error) {
          console.error(error);
      }
};

module.exports = signUpStep2Controller;
