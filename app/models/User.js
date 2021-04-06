const mongoose = require('mongoose');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  resetPasswordLink: { type: String, default: '' },
  // role 0 is admin, 1 is user
  role: { type: Number, default: 1 },
});

UserSchema.methods.checkPassWord = async function(password) {
  console.log(password)
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('user', UserSchema);