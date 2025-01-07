const mongoose = require('mongoose');
const { Schema } = mongoose;

const polygonSchema = new Schema({
  route: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  polygonCoordinates: { type: [[[Number]]], required: true },  // Array of arrays to represent coordinates
  bufferDistance: { type: Number, required: true }  // Buffer distance used in polygon generation
});

module.exports = mongoose.model('Polygon', polygonSchema);
