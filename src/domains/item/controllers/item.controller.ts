import Hapi from '@hapi/hapi'
import { ItemService } from '@/domains/item/services/item.service'
import { CreateItemDto, UpdateItemDto } from '@/domains/item/dto/item.dto'
import { LoggerService as Logger } from '@/services/logger/logger.service'
import { StatusCodes } from 'http-status-codes'

export class ItemController {
  constructor(private readonly service: ItemService) {}

  public createItemHandler = async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const payload = req.payload as CreateItemDto
    const item = await this.service.create(payload)
    Logger.debug(`Item created: ${JSON.stringify(item)}`)
    return h.response(item).code(StatusCodes.CREATED)
  }

  public getAllItemsHandler = async (_: Hapi.Request, h: Hapi.ResponseToolkit) => {
    return h.response(await this.service.findAll()).code(StatusCodes.OK)
  }

  public getItemByIdHandler = async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const item = await this.service.findById(req.params.id)

    Logger.debug(`Item found: ${JSON.stringify(item)}`)
    return item ? h.response(item) : h.response({ error: 'Not Found' }).code(StatusCodes.NOT_FOUND)
  }

  public updateItemHandler = async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const payload = req.payload as UpdateItemDto
    const updatedItem = await this.service.update(req.params.id, payload)

    Logger.debug(`Item updated: ${JSON.stringify(updatedItem)}`)
    return updatedItem
      ? h.response(updatedItem)
      : h.response({ error: 'Not Found' }).code(StatusCodes.NOT_FOUND)
  }

  public deleteItemHandler = async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const success = await this.service.delete(req.params.id)

    Logger.debug(`Item deleted: ${success} with id: ${req.params.id}`)
    return success
      ? h.response().code(StatusCodes.NO_CONTENT)
      : h.response({ error: 'Not Found' }).code(StatusCodes.NOT_FOUND)
  }
}
