var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bloodgroup: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    district: {
      type: String,
      required: true
    },
    area: String
  },
  role: {
    type: Number, //1-admin 2-normal
    default: 2
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiryDate: Date
}, {
  timestamps: true
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;