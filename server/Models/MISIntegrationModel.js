const mongoose = require('mongoose');
const { Schema } = mongoose;

const threePLIntegrationSchema = new Schema({
  partnerId: {
    type: String,
    required: true,
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
  availableCapacity: { type: Number, default: 0 }
});

module.exports = mongoose.model('ThreePLIntegration', threePLIntegrationSchema);


const misReportingSchema = new Schema({
    reportId: {
      type: String,
      required: true,
      unique: true
    },
    generatedOn: { type: Date, default: Date.now },
    keyMetrics: { type: Schema.Types.Mixed }, // Key performance metrics
    reportType: { type: String }, // e.g., 'Capacity Utilization', 'Delay Analysis'
    dataSources: [{ type: String }], // Sources of data used
    distributionList: [{ type: String }] // Stakeholders receiving the report
  });
  
  module.exports = mongoose.model('MISReporting', misReportingSchema);
  