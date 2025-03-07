import Hapi from '@hapi/hapi'
import { ValidationError } from 'joi'
import { ValidationError as customValidationError } from '@/errors/validation.error'
import { ItemController } from './item.controller'
import { ItemCreateSchema, ItemUpdateSchema } from '@/domains/item/dto/item.dto'
import { ItemService } from '@/domains/item/services/item.service'
import { ItemRepository } from '@/domains/item/repositories/item.repository'
import { Database } from '@/repositories/storage/db.interface'

export const registerItemRoutes = (server: Hapi.Server, db: Database) => {
  const repository = new ItemRepository(db)
  const controller = new ItemController(new ItemService(repository))
  const routePrefix = '/items'

  const failAction = (_request: Hapi.Request, _h: Hapi.ResponseToolkit, err: any) => {
    if (err instanceof ValidationError) {
      const errors = err.details.map((detail) => ({
        field: detail.context?.key || '',
        message: detail.message,
      }))
      throw new customValidationError('Invalid request payload input', errors)
    }
    throw err
  }

  server.route([
    {
      method: 'POST',
      path: routePrefix,
      handler: controller.createItemHandler,
      options: {
        validate: { payload: ItemCreateSchema, failAction },
      },
    },
    {
      method: 'GET',
      path: routePrefix,
      handler: controller.getAllItemsHandler,
    },
    {
      method: 'GET',
      path: `${routePrefix}/{id}`,
      handler: controller.getItemByIdHandler,
    },
    {
      method: 'PUT',
      path: `${routePrefix}/{id}`,
      handler: controller.updateItemHandler,
      options: { validate: { payload: ItemUpdateSchema, failAction } },
    },
    {
      method: 'DELETE',
      path: `${routePrefix}/{id}`,
      handler: controller.deleteItemHandler,
    },
  ])
}
