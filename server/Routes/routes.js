const express = require("express");
const dispatchNewTruckController = require("../Controllers/dispatchNewTruckController");
const login3PLController = require("../Controllers/login3PLController");
const signUpstep3Controller = require("../Controllers/signUpstep3Controller");
// const generatePolygonController = require("../Controllers/generatePolygonController.js");
// const checkPolygon = require("../Controllers/generatePolygonController.js");
const { generatePolygonController, checkPolygon } = require('../Controllers/generatePolygonController');
const signUpStep1Controller = require("../Controllers/signUpStep1Controller");
const signUpStep2Controller = require("../Controllers/signUpStep2Controller");
const getRoute = require("../Controllers/dynamicRouting");

const chatMsg = require("../Controllers/chatbotController")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
});





// 3PL login and sign up api:
// step 1
router.post("/api/login3PL", login3PLController)


// sign up apis
// step 1 : verifying email
router.post("/api/step1", signUpStep1Controller)
// step 2 verifying GST num and CIN Number:
router.post("/api/step2", signUpStep2Controller)
// step 3 OTP verification 
router.post("/api/step3", signUpstep3Controller)



// dispatching a new truck

router.post("/api/dispatchNewTruck", dispatchNewTruckController)

router.post("/api/generatePolygon", generatePolygonController)
router.post("/api/checkPolygon", checkPolygon)
router.post("/api/chat", chatMsg)

// optimized route get

router.get("/api/getRoute", getRoute)



module.exports = router;