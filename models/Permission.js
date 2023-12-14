const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    name: String,
    stream: String,
    departDate: Date,
    departTime: String,
    returningDate: Date,
    returningTime: String,
    reason: String,
})

PermissionSchema.statics.query = async function(){
    const perm = await this.find({}) 
    console.log(perm);
   return perm;
  
}

const PermissionModel = mongoose.model('permissions', PermissionSchema);
module.exports = PermissionModel;