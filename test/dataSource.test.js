let mockIdCounter = 1;
jest.mock('uuid', () => ({ v4: () => 'mock-uuid-' + (mockIdCounter++) }));
const dataSource = require('../services/dataSource');

describe('dataSource in-memory tests', () => {
  beforeAll(async () => {
    await dataSource.init(false); // force in-memory
  });

  test('getAll should return predefined products', async () => {
    const products = await dataSource.getAll();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
  });

  test('getById should return null for non-existent id', async () => {
    const product = await dataSource.getById('non-existent-id');
    expect(product).toBeNull();
  });

  test('create should add a new product', async () => {
    const newProduct = await dataSource.create({ name: 'Test Product', price: 99, color: 'blue' });
    expect(newProduct).toHaveProperty('id');
    expect(newProduct.name).toBe('Test Product');

    const product = await dataSource.getById(newProduct.id);
    expect(product).toEqual(newProduct);
  });
  
  test('remove should delete an existing product', async () => {
    const newProduct = await dataSource.create({ name: 'To be removed', price: 10, color: 'red' });
    const removed = await dataSource.remove(newProduct.id);
    expect(removed).toEqual(newProduct);
    
    const fetched = await dataSource.getById(newProduct.id);
    expect(fetched).toBeNull();
  });
});
