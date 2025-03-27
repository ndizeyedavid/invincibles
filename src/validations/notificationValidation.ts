import Joi from "joi";

const create = Joi.object({
  user_id: Joi.string().required(),
  type: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
});

const update = Joi.object({
  notification_id: Joi.string().required(),
  type: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
});

export default { create, update };
