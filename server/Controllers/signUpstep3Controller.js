const threePlIntegrationModel = require("../Models/threePlIntegrationModel");

const signUpstep3Controller= async (req,res)=>{

    // all data:

    const {email,password,address, GST_NUM,CIN_NUM,name,phoneNumer} = req.body;

    try{
        const registerUser = new threePlIntegrationModel({
            email,password,address,GST_NUM,CIN_NUM,name,phoneNumer}

        )

        await registerUser.save();
        return res.status(201).json({msg:"Registration Successfull"})
    }catch(e){
        console.log(`error in step 3 controller : ${e}` );
        return res.status(501).json({msg:"Internal Server Error"})
        
    }


   
}

module.exports = signUpstep3Controller;