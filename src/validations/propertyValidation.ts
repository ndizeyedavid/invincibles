import Joi from "joi";
import { join } from "path";

const create = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  pricePerNight: Joi.number().required(),
  location: Joi.string().required(),
  maxGuests: Joi.number().required(),
  bathrooms: Joi.number().required(),
  bedrooms: Joi.number().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});
const update = Joi.object({
  property_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  pricePerNight: Joi.number().required(),
  location: Joi.string().required(),
  maxGuests: Joi.number().required(),
  bathrooms: Joi.number().required(),
  bedrooms: Joi.number().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

export default { create, update };
