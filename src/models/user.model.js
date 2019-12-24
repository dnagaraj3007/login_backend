import config from 'config';
import jwt from 'jsonwebtoken';
import joi from '@hapi/joi';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  'name': {
    'type': String,
    'require': true,
    'minlength': 3,
    'maxlength': 50
  },
  'email': {
    'type': String,
    'required': true,
    'minlength': 5,
    'maxlength': 255,
    'unique': true
  },
  'password': {
    'type': String,
    'required': true,
    'minlength': 3,
    'maxlength': 255
  },
  'isAdmin': Boolean
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    '_id': this._id,
    'email': this.email,
    'isAdmin': this.isAdmin
  }, config.get('myprivatekey'), {'expiresIn': '3 hours'});

  return token;
};

const UserModel = mongoose.model('User', UserSchema);

function validateUser(user) {
  const schema = joi.object({
    'name': joi.string().min(3).max(50).required(),
    'email': joi.string().min(3).max(255).required(),
    'password': joi.string().max(255).required()
  });

  return schema.validate(user);
}

export const User = UserModel;
export const validate = validateUser;

