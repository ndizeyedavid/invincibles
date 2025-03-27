import Joi from "joi";

const create = Joi.object({
  property_Id: Joi.string().required(),
  user_id: Joi.string().required(),
  booking_id: Joi.string().required(),
  rating: Joi.number().required(),
  comment: Joi.string().optional(),
});

const update = Joi.object({
  review_id: Joi.string().required(),
  rating: Joi.number().required(),
  comment: Joi.string().optional(),
});

export default { create, update };
