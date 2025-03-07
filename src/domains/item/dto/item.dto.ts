import Joi from 'joi'

export const ItemCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Field "name" is required',
  }),
  price: Joi.number().positive().required().messages({
    'number.positive': 'Field "price" cannot be negative',
    'any.required': 'Field "price" is required',
  }),
})

export const ItemUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': 'Field "name" must be a string',
  }),
  price: Joi.number().positive().messages({
    'number.positive': 'Field "price" cannot be negative',
  }),
})
  .or('name', 'price')
  .messages({
    'object.missing': 'At least one field ("name" or "price") must be provided',
  })

export interface CreateItemDto {
  name: string
  price: number
}

export interface UpdateItemDto {
  name?: string
  price?: number
}