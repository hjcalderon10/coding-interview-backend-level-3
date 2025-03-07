import Hapi, { ResponseToolkit, Request, Lifecycle } from '@hapi/hapi'
import { registerItemRoutes } from '@/domains/item/controllers/item.routes'
import { ItemController } from '@/domains/item/controllers/item.controller'
import { Database } from '@/repositories/storage/db.interface'
import { ValidationError } from '@/errors/validation.error'

describe('Item Routes', () => {
  let server: Hapi.Server
  let mockDb: Database
  let mockController: jest.Mocked<ItemController>

  beforeEach(() => {
    server = Hapi.server()
    mockDb = {} as Database
    mockController = {
      createItemHandler: jest.fn(),
      getAllItemsHandler: jest.fn(),
      getItemByIdHandler: jest.fn(),
      updateItemHandler: jest.fn(),
      deleteItemHandler: jest.fn(),
    } as unknown as jest.Mocked<ItemController>

    ItemController.prototype.constructor = jest.fn().mockReturnValue(mockController)
    registerItemRoutes(server, mockDb)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should register POST /items route', async () => {
    const routes = server.table()
    const postRoute = routes.find((route) => route.method === 'post' && route.path === '/items')
    expect(postRoute).toBeDefined()
  })

  it('should register GET /items route', async () => {
    const routes = server.table()
    const getRoute = routes.find((route) => route.method === 'get' && route.path === '/items')
    expect(getRoute).toBeDefined()
  })

  it('should register GET /items/{id} route', async () => {
    const routes = server.table()
    const getByIdRoute = routes.find(
      (route) => route.method === 'get' && route.path === '/items/{id}',
    )
    expect(getByIdRoute).toBeDefined()
  })

  it('should register PUT /items/{id} route', async () => {
    const routes = server.table()
    const putRoute = routes.find((route) => route.method === 'put' && route.path === '/items/{id}')
    expect(putRoute).toBeDefined()
  })

  it('should register DELETE /items/{id} route', async () => {
    const routes = server.table()
    const deleteRoute = routes.find(
      (route) => route.method === 'delete' && route.path === '/items/{id}',
    )
    expect(deleteRoute).toBeDefined()
  })
})

describe('Item Routes - Validation', () => {
  let server: Hapi.Server
  let mockDb: Database
  let mockController: jest.Mocked<ItemController>

  beforeEach(() => {
    server = Hapi.server()
    mockDb = {} as Database
    mockController = {
      createItemHandler: jest.fn(),
      getAllItemsHandler: jest.fn(),
      getItemByIdHandler: jest.fn(),
      updateItemHandler: jest.fn(),
      deleteItemHandler: jest.fn(),
    } as unknown as jest.Mocked<ItemController>

    ItemController.prototype.constructor = jest.fn().mockReturnValue(mockController)
    registerItemRoutes(server, mockDb)

    server.ext({
      type: 'onPreResponse' as const,
      method: (request: Hapi.Request, h: ResponseToolkit): Hapi.Lifecycle.ReturnValue => {
        const response = request.response
        if (response instanceof ValidationError) {
          return h.response({ errors: response.errors }).code(400)
        }
        return h.continue
      },
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should throw custom validation error for invalid POST /items payload', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/items',
      payload: { name: 'asd' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.payload).toBe(
      '{"errors":[{"field":"price","message":"Field \\"price\\" is required"}]}',
    )
  })

  it('should throw custom validation error for invalid PUT /items/{id} payload', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/items/1',
      payload: { invalid: 'data' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.payload).toBe(
      '{"errors":[{"field":"invalid","message":"\\"invalid\\" is not allowed"}]}',
    )
  })
})
