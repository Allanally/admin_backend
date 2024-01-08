const UserModel = require("../models/User");
const FaultModel = require("../models/Fault");
const jwt = require("jsonwebtoken");
const PermissionModel = require("../models/Permission");
const FaultingModel = require("../models/Faulting")

require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const maxAge = 1*24*60*60;
const createToken = (id) => {
  return jwt.sign({id},  jwtSecretKey, {
    expiresIn: maxAge
  })
}
 const handleErrors = (err) => {
    let errors = {email: "", password: ""}
    
    if(err.message === "Incorrect Email") errors.email = "That email is not registered";
    if(err.message === "Incorrect Password") errors.password = "Entered Password is Incorrect";
    if(err.code===11000){
        errors.email = "Email is registered";
        return errors; 
    }
    if(err.message.includes("Users validation failed")){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
 }
module.exports.register = async (req, res, next) => {
    try{
        const { name, email, password, role } = req.body
        console.log(req.body)
       const user = await UserModel.create({name, email, password, role});
       const token = createToken(user._id);
       res.cookie("jwt",token, {
           withCredentials: true,
           httpOnly: false,
           maxAge: maxAge * 1000,
       } );
       res.status(201).json({user: user._id, created: true})
       }catch(err) {
         console.log(err);
         const errors = handleErrors(err);
         res.json({errors,created: false})
       }
};

module.exports.login = async (req, res, next) => {

  try{
    const {  email, password } = req.body
   const user = await UserModel.login( email, password);
   const token = createToken(user._id);
   res.cookie("jwt",token, {
       withCredentials: true,
       httpOnly: false,
       maxAge: maxAge * 1000,
   } );
   res.status(200).json({user: user._id, created: true, message: "Cookie Created"})
   }catch(err) {
     console.log(err);
     const errors = handleErrors(err);
     res.json({errors,created: false})
   }

};



module.exports.view = async (req, res, next) => {
  try {
    const { name, stream, year } = req.body;


    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (stream) {
      query.stream = { $regex: stream, $options: "i" };
    }
    if(year) {
      query.year = { $regex: year, $options: "i" };
    }
    const faults = await FaultModel.find(query);

    console.log("Name:", name, "Stream:", stream);
    
    if (faults.length > 0) {
      res.json(faults);
    } else {
      res.json({ message: "No faults found with the given criteria." });
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching data from MongoDB." });
  }
}

module.exports.faultupdate = async (req, res, next) => {
  try {
    const updatedValues = { $set: req.body }; 

    const result = await FaultingModel.updateOne({}, updatedValues);

    if (result.nModified > 0) {
      res.status(200).json({ message: 'Fault updated successfully' });
      console.log("success")
    } else {
      res.status(404).json({ message: 'Fault not found or no modifications' });
    }
  } catch (error) {
    console.error('Error updating fault:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

