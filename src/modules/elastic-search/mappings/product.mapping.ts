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
      slug: { type: 'text' },
      price: { type: 'scaled_float', scaling_factor: 100 },
      createdDate: { type: 'date' },
      ageRating: { type: 'integer' },
      language: { type: 'keyword' },
      discount: { type: 'integer' },
      image: {
        properties: {
          id: { type: 'keyword' },
          url: { type: 'text' },
          ordering: { type: 'integer' },
          isDefault: { type: 'boolean' },
          status: { type: 'integer' }
        }
      },
      category: {
        properties: {
          id: { type: 'keyword' },
          name: { type: 'text' },
          slug: { type: 'text' },
          status: { type: 'integer' }
        }
      }
    }
  }
};
