import Joi from "joi";
const create = Joi.object({
  property_id: Joi.string().required(),
});

export default { create };
