const mongoose = require('mongoose');
const { Schema } = mongoose;

const dispatchSchema = new Schema({
  dispatchId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  truckId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Truck', 
    required: true 
  },
  routeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Route', 
    required: true 
  },
  dispatchTime: { 
    type: Date, 
    default: Date.now 
  },
  estimatedArrivalTime: { 
    type: Date 
  },
  loadDetails: {
    weight: { 
      type: Number, 
      required: true 
    },
    volume: { 
      type: Number, 
      required: true 
    }
  },
  driverId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Driver' 
  },
  responseRequired: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'in transit', 'delivered', 'cancelled'], 
    default: 'scheduled' 
  },
//   comments: { 
//     type: String 
//   },
  actualArrivalTime: { 
    type: Date 
  }
});

module.exports = mongoose.model('Dispatch', dispatchSchema);
