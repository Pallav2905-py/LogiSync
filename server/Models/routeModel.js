const mongoose = require('mongoose');
const { Schema } = mongoose;


// Not defined as Array.
const subRouteSchema = new Schema({
  loadingLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  unloadingLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number,
    required: true
  },  // Distance for this sub-route in kilometers
  estimatedTravelTime: {
    type: Number  // Time in minutes for this sub-route
  },
  description: {
    type: String
  },

  // Optional description of this sub-route

});


const routeSchema = new Schema({
  routeId: {
    type: String,
    required: true,
    unique: true
  },
  startLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  endLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number,
    required: true
  },  // Distance in kilometers
  estimatedTravelTime: {
    type: Number  // Time in minutes
  },

  subRoutes: [subRouteSchema],
  polygon: {
    type: Schema.Types.ObjectId,
    ref: 'Polygon' // Reference to the Polygon model
  }

  //   roadConditions: { 
  //     type: String 
  //   },
  //   tolls: [{ 
  //     type: Number 
  //   }], // Toll fees along the route
  //   landmarks: [{ 
  //     type: String 
  //   }], // Notable landmarks along the route
  //   routeType: { 
  //     type: String, 
  //     enum: ['highway', 'urban', 'rural'] 
  //   }
});

module.exports = mongoose.model('Route', routeSchema);
