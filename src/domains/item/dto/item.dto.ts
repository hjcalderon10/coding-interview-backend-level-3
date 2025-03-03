import Joi from 'joi';

export const itemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
});

export interface CreateItemDto {
  name: string;
  price: number;
}