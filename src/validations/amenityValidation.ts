import Joi from "joi";

const create = Joi.object({
  property_id: Joi.string().required(),
  amenity_id: Joi.string().required(),
});

const update = Joi.object({
  amenity_id: Joi.string().required(),
});

export default { create, update };
