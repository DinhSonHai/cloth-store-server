const mongoose = require('mongoose');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  avatar: { type: String, default: "https://res.cloudinary.com/sonhai/image/upload/v1618283547/default-avatar_fjlzn4.jpg"},
  resetPasswordLink: { type: String, default: '' },
  // role 0 is admin, 1 is user
  role: { type: Number, default: 0 },
});

AdminSchema.methods.checkPassWord = async function (password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('admin', AdminSchema);
