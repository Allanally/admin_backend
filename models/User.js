const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, 'email already used'],
        required: [true, 'Plaese enter Email'],
        lowercase: true
     },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password is too short']
    }, 
    role: {
        type: String,
        required: [true, 'Select Role']
    }
   
})

UserSchema.pre("save", async function(next) {
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password, salt);
next();
})

UserSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email");
}

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel


