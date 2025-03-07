import { ItemRepository } from "@/domains/item/repositories/item.repository"
import { Database } from "@/repositories/storage/db.interface"

describe('ItemRepository', () => {
  let itemRepository: ItemRepository
  let mockStorage: jest.Mocked<Database>

  beforeEach(() => {
    mockStorage = {
      raw: jest.fn()
    } as unknown as jest.Mocked<Database>
    itemRepository = new ItemRepository(mockStorage)
  })

  describe('create', () => {
    it('should create a new item', async () => {
      const item = { name: 'Test Item', price: 100 }
      const newItem = { id: '1', ...item, created_date: new Date(), deleted_date: null }
      mockStorage.raw.mockResolvedValueOnce([newItem])

      const result = await itemRepository.create(item)

      expect(mockStorage.raw).toHaveBeenCalledWith(
        'INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *',
        [item.name, item.price]
      )
      expect(result).toEqual({ id: '1', ...item, created_date: newItem.created_date })
    })
  })

  describe('findById', () => {
    it('should find an item by id', async () => {
      const item = { id: '1', name: 'Test Item', price: 100, created_date: new Date(), deleted_date: null }
      mockStorage.raw.mockResolvedValueOnce([item])

      const result = await itemRepository.findById('1')

      expect(mockStorage.raw).toHaveBeenCalledWith(
        'SELECT * FROM items WHERE id = $1 AND deleted_date IS NULL',
        ['1']
      )
      expect(result).toEqual({ id: '1', name: 'Test Item', price: 100, created_date: item.created_date })
    })

    it('should return null if item not found', async () => {
      mockStorage.raw.mockResolvedValueOnce([])

      const result = await itemRepository.findById('1')

      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should find all items', async () => {
      const items = [
        { id: '1', name: 'Test Item 1', price: 100, created_date: new Date(), deleted_date: null },
        { id: '2', name: 'Test Item 2', price: 200, created_date: new Date(), deleted_date: null }
      ]
      mockStorage.raw.mockResolvedValueOnce(items)

      const result = await itemRepository.findAll()

      expect(mockStorage.raw).toHaveBeenCalledWith('SELECT * FROM items WHERE deleted_date IS NULL')
      expect(result).toEqual(items.map(({ deleted_date, ...rest }) => rest))
    })
  })

  describe('update', () => {
    it('should update an item', async () => {
      const updates = { name: 'Updated Item', price: 150 }
      const updatedItem = { id: '1', ...updates, created_date: new Date(), deleted_date: null }
      mockStorage.raw.mockResolvedValueOnce([updatedItem])

      const result = await itemRepository.update('1', updates)

      expect(mockStorage.raw).toHaveBeenCalledWith(
        'UPDATE items SET name = $1, price = $2 WHERE id = $3 AND deleted_date IS NULL RETURNING *',
        ['Updated Item', 150, '1']
      )
      expect(result).toEqual({ id: '1', ...updates, created_date: updatedItem.created_date })
    })

    it('should return null if no fields to update', async () => {
      const result = await itemRepository.update('1', {})

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete an item', async () => {
      mockStorage.raw.mockResolvedValueOnce([{ id: 1 }])

      const result = await itemRepository.delete('1')

      expect(mockStorage.raw).toHaveBeenCalledWith(
        'UPDATE items SET deleted_date = NOW() WHERE id = $1 AND deleted_date IS NULL RETURNING id',
        ['1']
      )
      expect(result).toBe(true)
    })

    it('should return false if item not found', async () => {
      mockStorage.raw.mockResolvedValueOnce([])

      const result = await itemRepository.delete('1')

      expect(result).toBe(false)
    })
  })

  describe('deletePermanently', () => {
    it('should permanently delete an item', async () => {
      mockStorage.raw.mockResolvedValueOnce([{ id: 1 }])

      const result = await itemRepository.deletePermanently(1)

      expect(mockStorage.raw).toHaveBeenCalledWith(
        'DELETE FROM items WHERE id = $1 RETURNING id',
        [1]
      )
      expect(result).toBe(true)
    })

    it('should return false if item not found', async () => {
      mockStorage.raw.mockResolvedValueOnce([])

      const result = await itemRepository.deletePermanently(1)

      expect(result).toBe(false)
    })
  })
})