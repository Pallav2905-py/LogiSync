const mongoose = require('mongoose');
const { Schema } = mongoose;

const truckSchema = new Schema({
  truckId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  model: { 
    type: String, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  },  // Capacity in kilograms or liters
  lastMaintenanceDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'under repair'], 
    default: 'active' 
  },
  registrationNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  owner: { 
    type: String 
  },
  currentLocation: {
    latitude: { 
      type: Number 
    },
    longitude: { 
      type: Number 
    }
  },
  fuelLevel: { 
    type: Number 
  },
  lastServiceDate: { 
    type: Date 
  }
});

module.exports = mongoose.model('Truck', truckSchema);
