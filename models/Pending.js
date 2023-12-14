const mongoose = require('mongoose');

const PendingSchema = new mongoose.Schema({
    name: String,
    class: String,
    departDate: Date,
    departTime: String,
    issuer: String,
    reason: String,
    stream: String
})
PendingSchema.statics.query = async function(){
    const pending = await this.find() 
    console.log(pending);
   return pending;
  
}

const PendingModel = mongoose.model('pendings',PendingSchema)
module.exports = PendingModel