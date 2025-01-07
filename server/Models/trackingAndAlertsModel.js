const trackingAndAlertsSchema = new Schema({
    alertId: {
      type: String,
      required: true,
      unique: true
    },
    truckId: { type: String, required: true },
    alertType: { type: String, required: true }, // e.g., 'Delay', 'Detour'
    timestamp: { type: Date, default: Date.now },
    geofenceData: { type: Schema.Types.Mixed }, // Geofence-related information
    resolved: { type: Boolean, default: false },
    actionTaken: { type: String } // Description of the response
  });
  
  module.exports = mongoose.model('TrackingAndAlerts', trackingAndAlertsSchema);
  