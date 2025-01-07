
const mongoose = require('mongoose');
const { Schema } = mongoose;


const capacityManagementSchema = new Schema({
    truckId: {
        type: Schema.Types.ObjectId, 
    ref: 'Truck'
    },
    touchPoint: { type: String }, // Location or checkpoint identifier
    currentLoad: {
      weight: { type: Number, required: true },
      volume: { type: Number, required: true }
    },
    capacityUsed: { type: Number, required: true },
    historicalData: [{ type: Schema.Types.Mixed }], // Historical capacity usage data
    predictedCapacity: { type: Number },
    adjustmentActions: [{ type: String }] // Recommended actions for dynamic adjustment
  });
  
  module.exports = mongoose.model('CapacityManagement', capacityManagementSchema);
  