export const ProductMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword' }
        }
      },
      price: { type: 'scaled_float', scaling_factor: 100 },
      createdDate: { type: 'date' },
      ageRating: { type: 'integer' },
      language: { type: 'keyword' },
      discount: { type: 'integer' },
      imageUrl: { type: 'keyword' },
      category: {
        properties: {
          id: { type: 'keyword' },
          name: { type: 'text' }
        }
      }
    }
  }
};
