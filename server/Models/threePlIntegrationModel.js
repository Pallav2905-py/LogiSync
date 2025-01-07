const mongoose = require('mongoose');
const { Schema } = mongoose;

const threePLIntegrationSchema = new Schema({


GST_NUM :{
  type : String 
},
CIN_NUM : {
  type: String
},

phoneNumer:{
  type: Number,
},

 email : {
    type: String,
  },
  password: {
    type: String,
  },

  address:{
    type: String,
  },

  partnerId: {
    type: String,
    unique: true
  },
  name: { type: String, required: true },
  ownedTrucks: [{
    type: Schema.Types.ObjectId,
    ref: 'Truck'
  }],
  bookedTrucks: [{
    type: Schema.Types.ObjectId,
    ref: 'Truck'
  }],

  
//   availableCapacity: { type: Number, default: 0 }
});

module.exports = mongoose.model('ThreePLIntegration', threePLIntegrationSchema);
