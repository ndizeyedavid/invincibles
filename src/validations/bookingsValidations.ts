import Joi from "joi";

const create = Joi.object({
  property_id: Joi.string().required(),
  checkIn: Joi.date().required(),
  checkOut: Joi.date().required(),
  guestCount: Joi.number().required(),
});

const update = Joi.object({
  checkIn: Joi.date().required(),
  checkOut: Joi.date().required(),
  guestCount: Joi.number().required(),
});

const console = Joi.object({
  booking_id: Joi.string().required(),
  cancelReason: Joi.string().required(),
});

export default { create, update, console };
