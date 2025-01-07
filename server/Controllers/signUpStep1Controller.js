const threePlIntegrationModel = require("../Models/threePlIntegrationModel");

const signUpStep1Controller = async (req,res)=>{

const {email} = req.body;

try{

    if(await (threePlIntegrationModel.findOne({email}))){

        return res.status(409).json({msg:"Email Already Exists!"})
    }
    return res.status(200).json({msg:"Can Proceed!"})
}catch(e){
    console.log(`error in verifying email controller : ${e}`);
    return  res.status(501).json({msg:"Server Not Responding! Try Again"})
   
}

    


}

module.exports = signUpStep1Controller;
