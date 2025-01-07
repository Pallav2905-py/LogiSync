
const mongoose = require('mongoose');
const { Schema } = mongoose;


const schedulingSchema = new Schema({
    scheduleId: {
      type: String,
      required: true,
      unique: true
    },
    truckId: { type: String, required: true },
    routeId: { type: String, required: true },
    plannedStartTime: { type: Date },
    plannedEndTime: { type: Date },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    delays: [{ type: Schema.Types.Mixed }], // Delay information
    adjustments: [{ type: String }] // Automatic adjustments made
  });
  
  module.exports = mongoose.model('Scheduling', schedulingSchema);
  