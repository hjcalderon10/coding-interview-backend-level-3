import { ItemController } from '@/domains/item/controllers/item.controller'
import { ItemService } from '@/domains/item/services/item.service'
import { LoggerService as Logger } from '@/services/logger/logger.service'
import { StatusCodes } from 'http-status-codes'
import Hapi from '@hapi/hapi'
import { IItemRepository } from '@/domains/item/repositories/item.repository.interface'
import { Item } from '@/entities/item.entity'

jest.mock('@/domains/item/services/item.service')
jest.mock('@/services/logger/logger.service')

describe('ItemController', () => {
  let controller: ItemController
  let service: jest.Mocked<ItemService>
  let h: jest.Mocked<Hapi.ResponseToolkit>

  beforeEach(() => {
    service = new ItemService({} as jest.Mocked<IItemRepository>) as jest.Mocked<ItemService>
    controller = new ItemController(service)
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    } as unknown as jest.Mocked<Hapi.ResponseToolkit & { code: jest.Mock }>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createItemHandler', () => {
    it('should create an item and return it with status code 201', async () => {
      const payload = { name: 'Item 1', price: 20 }
      const request = { payload } as Hapi.Request
      const createdItem: Item = { id: '1', ...payload }
      service.create.mockResolvedValue(createdItem)

      const response = await controller.createItemHandler(request, h)

      expect(service.create).toHaveBeenCalledWith(payload)
      expect(Logger.debug).toHaveBeenCalledWith(`Item created: ${JSON.stringify(createdItem)}`)
      expect(h.response).toHaveBeenCalledWith(createdItem)
      expect(h.response().code).toHaveBeenCalledWith(StatusCodes.CREATED)
    })
  })

  describe('getAllItemsHandler', () => {
    it('should return all items with status code 200', async () => {
      const items: Item[] = [{ id: '1', name: 'Item 1', price: 10 }]
      service.findAll.mockResolvedValue(items)

      const response = await controller.getAllItemsHandler({} as Hapi.Request, h)

      expect(service.findAll).toHaveBeenCalled()
      expect(h.response).toHaveBeenCalledWith(items)
      expect(h.response().code).toHaveBeenCalledWith(StatusCodes.OK)
    })
  })

  describe('getItemByIdHandler', () => {
    it('should return the item if found with status code 200', async () => {
      const item: Item = { id: '1', name: 'Item 1', price: 20}
      const request = { params: { id: '1' } } as unknown as Hapi.Request
      service.findById.mockResolvedValue(item)

      const response = await controller.getItemByIdHandler(request, h)

      expect(service.findById).toHaveBeenCalledWith('1')
      expect(Logger.debug).toHaveBeenCalledWith(`Item found: ${JSON.stringify(item)}`)
      expect(h.response).toHaveBeenCalledWith(item)
    })

    it('should return 404 if item not found', async () => {
      const request = { params: { id: '1' } } as unknown as Hapi.Request
      service.findById.mockResolvedValue(null)

      const response = await controller.getItemByIdHandler(request, h)

      expect(service.findById).toHaveBeenCalledWith('1')
      expect(h.response).toHaveBeenCalledWith({ error: 'Not Found' })
      expect(h.response().code).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    })
  })

  describe('updateItemHandler', () => {
    it('should update the item and return it with status code 200', async () => {
      const payload = { name: 'Updated Item', price: 20 }
      const request = { params: { id: '1' }, payload } as unknown as Hapi.Request
      const updatedItem: Item = { id: '1', ...payload }
      service.update.mockResolvedValue(updatedItem)

      const response = await controller.updateItemHandler(request, h)

      expect(service.update).toHaveBeenCalledWith('1', payload)
      expect(Logger.debug).toHaveBeenCalledWith(`Item updated: ${JSON.stringify(updatedItem)}`)
      expect(h.response).toHaveBeenCalledWith(updatedItem)
    })

    it('should return 404 if item not found', async () => {
      const payload = { name: 'Updated Item' }
      const request = { params: { id: '1' }, payload } as unknown as Hapi.Request
      service.update.mockResolvedValue(null)

      const response = await controller.updateItemHandler(request, h)

      expect(service.update).toHaveBeenCalledWith('1', payload)
      expect(h.response).toHaveBeenCalledWith({ error: 'Not Found' })
      expect(h.response().code).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    })
  })

  describe('deleteItemHandler', () => {
    it('should delete the item and return status code 204', async () => {
      const request = { params: { id: '1' } } as unknown as Hapi.Request
      service.delete.mockResolvedValue(true)

      const response = await controller.deleteItemHandler(request, h)

      expect(service.delete).toHaveBeenCalledWith('1')
      expect(Logger.debug).toHaveBeenCalledWith(`Item deleted: true with id: 1`)
      expect(h.response).toHaveBeenCalled()
      expect(h.response().code).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    })

    it('should return 404 if item not found', async () => {
      const request = { params: { id: '1' } } as unknown as Hapi.Request
      service.delete.mockResolvedValue(false)

      const response = await controller.deleteItemHandler(request, h)

      expect(service.delete).toHaveBeenCalledWith('1')
      expect(h.response).toHaveBeenCalledWith({ error: 'Not Found' })
      expect(h.response().code).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    })
  })
})