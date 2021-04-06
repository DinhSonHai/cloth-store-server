const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  typeName: { type: String, require: true, trim: true },
});

module.exports = mongoose.Schema('type', TypeSchema);