import Joi from "joi";
const Password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

const create = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  avatar: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().regex(Password).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

const update = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgot = Joi.object({
  email: Joi.string().email().required(),
});

const reset = Joi.object({
  password: Joi.string().required(),
});
const changePassword = Joi.object({
  password: Joi.string().required(),
  new_password: Joi.string().regex(Password).required(),
});

export default { create, update, login, changePassword, forgot, reset };
