let mockIdCounter = 1;
jest.mock('uuid', () => ({ v4: () => 'mock-uuid-' + (mockIdCounter++) }));
const productController = require('../controllers/productController');
const dataSource = require('../services/dataSource');
const os = require('os');

jest.mock('../services/dataSource');

describe('productController tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('list should return items and meta', async () => {
    const mockItems = [{ id: '1', name: 'Item 1' }];
    dataSource.getAll.mockResolvedValue(mockItems);
    // Note: since isMongo is a getter, we might need to mock it differently if it were complex,
    // but standard mocking allows redefining it if it's configurable or we just test what is exported.
    // However, jest.mock replaces properties too.
    Object.defineProperty(dataSource, 'isMongo', { get: () => false, configurable: true });
    
    await productController.list(req, res, next);
    
    expect(dataSource.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: mockItems,
      hostname: os.hostname(),
      source: 'in-memory'
    });
  });

  test('getOne should return an item by id', async () => {
    const mockItem = { id: '1', name: 'Item 1' };
    req.params.id = '1';
    dataSource.getById.mockResolvedValue(mockItem);
    Object.defineProperty(dataSource, 'isMongo', { get: () => false, configurable: true });
    
    await productController.getOne(req, res, next);
    
    expect(dataSource.getById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockItem }));
  });

  test('getOne should return 404 if item not found', async () => {
    req.params.id = '999';
    dataSource.getById.mockResolvedValue(null);
    Object.defineProperty(dataSource, 'isMongo', { get: () => false, configurable: true });
    
    await productController.getOne(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not found' }));
  });
});
