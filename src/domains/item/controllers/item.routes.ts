import Hapi from '@hapi/hapi'
import { ItemController } from './item.controller'
import { itemSchema } from '@/domains/item/dto/item.dto'
import { ItemService } from '@/domains/item/services/item.service'
import { ItemRepository } from '@/domains/item/repositories/item.repository'

export const registerItemRoutes = (server: Hapi.Server) => {
  const repository = new ItemRepository()
    const controller = new ItemController(new ItemService(repository))
    const routePrefix = "/items"

  server.route([
    {
      method: 'POST',
      path: routePrefix,
      handler: controller.createItemHandler,
      options: { validate: { payload: itemSchema } },
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
      options: { validate: { payload: itemSchema } },
    },
    {
      method: 'DELETE',
      path: `${routePrefix}/{id}`,
      handler: controller.deleteItemHandler,
    },
  ])
}
