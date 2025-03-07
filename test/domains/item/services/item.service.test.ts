import { ItemService } from '@/domains/item/services/item.service';
import { IItemRepository } from '@/domains/item/repositories/item.repository.interface';
import { Item, UpdateItem } from '@/entities/item.entity';

describe('ItemService', () => {
  let itemService: ItemService;
  let itemRepository: jest.Mocked<IItemRepository>;

  beforeEach(() => {
    itemRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    itemService = new ItemService(itemRepository);
  });

  describe('create', () => {
    it('should create an item and remove created_date', async () => {
      const item = { name: 'Test Item', price: 10 };
      const createdItem: Item = { id: '1', name: 'Test Item', price: 10, created_date: new Date() };
      itemRepository.create.mockResolvedValue(createdItem);

      const result = await itemService.create(item);

      expect(result).toEqual({ id: '1', name: 'Test Item', price: 10 });
      expect(itemRepository.create).toHaveBeenCalledWith(item);
    });
  });

  describe('findAll', () => {
    it('should find all items and remove created_date', async () => {
      const items = [
        { id: '1', name: 'Item 1', price: 10, created_date: new Date() },
        { id: '2', name: 'Item 2', price: 12, created_date: new Date() },
      ];
      itemRepository.findAll.mockResolvedValue(items);

      const result = await itemService.findAll();

      expect(result).toEqual([
        { id: '1', name: 'Item 1', price: 10 },
        { id: '2', name: 'Item 2', price: 12 },
      ]);
      expect(itemRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find an item by id and remove created_date', async () => {
      const item = { id: '1', name: 'Test Item', price: 20, created_date: new Date() };
      itemRepository.findById.mockResolvedValue(item);

      const result = await itemService.findById('1');

      expect(result).toEqual({ id: '1', name: 'Test Item', price: 20 });
      expect(itemRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if item not found', async () => {
      itemRepository.findById.mockResolvedValue(null);

      const result = await itemService.findById('1');

      expect(result).toBeNull();
      expect(itemRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an item and remove created_date', async () => {
      const item = { name: 'Updated Item' };
      const updatedItem: Item = { id: '1', name: 'Updated Item', price: 5, created_date: new Date() };
      itemRepository.update.mockResolvedValue(updatedItem);

      const result = await itemService.update('1', item);

      expect(result).toEqual({ id: '1', name: 'Updated Item', price: 5 });
      expect(itemRepository.update).toHaveBeenCalledWith('1', item);
    });

    it('should return null if item not found', async () => {
      itemRepository.update.mockResolvedValue(null);

      const result = await itemService.update('1', { name: 'Updated Item' });

      expect(result).toBeNull();
      expect(itemRepository.update).toHaveBeenCalledWith('1', { name: 'Updated Item' });
    });
  });

  describe('delete', () => {
    it('should delete an item by id', async () => {
      itemRepository.delete.mockResolvedValue(true);

      const result = await itemService.delete('1');

      expect(result).toBe(true);
      expect(itemRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});