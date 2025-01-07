const threePlIntegrationModel = require("../Models/threePlIntegrationModel");


const login3PLController = async (req,res)=>{

    // getting data from body!


    console.log(req.body);
    

    const {email,password } = req.body;

    console.log(email,password);

    
    try{
        // finding email and password in the database:
        const user = await threePlIntegrationModel.findOne({email});
        if(!user){
            res.status(401).json({msg:"No 3PL with this email!"})
            return;
        }

        if(user.password!=password){
                res.status(401).json({msg:"Wrong Password"})
                return;
        }

        // user exists and password is correct:

        res.status(200).json({msg:"Login Successfull"});
        


    }
    catch(e){

    }




}
module.exports = login3PLController;