const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    name: String,
    stream: String,
    departDate: Date,
    departTime: String,
    returningDate: Date,
    returningTime: String,
    reason: String,
    parentsContact: String,
    issuer: String,
})

PermissionSchema.statics.query = async function(name, stream){
    const perm = await this.find({name, stream}) 
    console.log(perm);
   return perm;
  
}

const PermissionModel = mongoose.model('permissions', PermissionSchema);
module.exports = PermissionModel;