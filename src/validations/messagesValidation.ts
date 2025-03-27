import Joi from "joi";

const create = Joi.object({
  conversation_id: Joi.string().required(),
  content: Joi.string().required(),
});

const update = Joi.object({
  message_id: Joi.string().required(),
  content: Joi.string().required(),
});

export default { create, update };
