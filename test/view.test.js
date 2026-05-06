const ejs = require('ejs');
const path = require('path');

describe('View tests', () => {
  test('index.ejs should contain an Add Product button', async () => {
    const viewPath = path.join(__dirname, '../views/index.ejs');
    
    const mockData = {
      products: [
        { id: '1', name: 'Test Product', price: 100, color: 'Red', description: 'Test', imageUrl: '' }
      ],
      hostname: 'localhost',
      source: 'test'
    };

    // Render the EJS file
    const html = await ejs.renderFile(viewPath, mockData);
    
    // Check if the Add Product button exists
    expect(html).toContain('id="btn-add"');
    expect(html).toMatch(/<button[^>]*id="btn-add"[^>]*>/i);
  });
});
