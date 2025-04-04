import React, { useState } from 'react';
import { z } from 'zod';
import createModelService, { FilterOperation, TypedModelFilters, BaseArtifactType } from '../model/services/model-service';

// Define a schema for your model
const ExampleSchema = z.object({
  name: z.string(),
  value: z.number(),
  category: z.string(),
  isActive: z.boolean(),
});

// Define the type for our model
type ExampleModelType = z.infer<typeof ExampleSchema> & BaseArtifactType;

// Create a model service
const exampleService = createModelService('example', ExampleSchema, { isArtifact: true });

const FilterExample: React.FC = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<TypedModelFilters<ExampleModelType>>({});

  // Use the model service with filters
  const { data: examples, error, isLoading } = exampleService.useModelList<ExampleModelType>(limit, offset, filters);

  // Example filter handlers with proper typing
  const applyNameFilter = (name: string) => {
    setFilters(prev => ({
      ...prev,
      name, // Simple equality filter - TypeScript knows this should be a string
    }));
  };

  const applyScoreFilter = (minScore: number) => {
    setFilters(prev => ({
      ...prev,
      score: {
        operation: FilterOperation.GREATER_THAN_OR_EQUAL,
        value: minScore, // TypeScript knows this should be a number
      },
    }));
  };

  const applyValueFilter = (minValue: number) => {
    setFilters(prev => ({
      ...prev,
      value: {
        operation: FilterOperation.GREATER_THAN,
        value: minValue, // TypeScript knows this should be a number
      },
    }));
  };

  const applyDateFilter = (beforeDate: string) => {
    setFilters(prev => ({
      ...prev,
      created_at: {
        operation: FilterOperation.LESS_THAN,
        value: beforeDate, // TypeScript knows this should be a string
      },
    }));
  };

  const applyCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category, // TypeScript knows this should be a string
    }));
  };

  const applyActiveFilter = (isActive: boolean) => {
    setFilters(prev => ({
      ...prev,
      isActive, // TypeScript knows this should be a boolean
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Filter Example with Type Safety</h1>
      
      <div className="filter-controls">
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            onChange={(e) => applyNameFilter(e.target.value)}
            placeholder="Filter by name"
          />
        </div>
        
        <div>
          <label>Min Score:</label>
          <input 
            type="number" 
            onChange={(e) => applyScoreFilter(Number(e.target.value))}
            placeholder="Minimum score"
          />
        </div>
        
        <div>
          <label>Min Value:</label>
          <input 
            type="number" 
            onChange={(e) => applyValueFilter(Number(e.target.value))}
            placeholder="Minimum value"
          />
        </div>
        
        <div>
          <label>Category:</label>
          <select onChange={(e) => applyCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div>
          <label>Active Only:</label>
          <input 
            type="checkbox" 
            onChange={(e) => applyActiveFilter(e.target.checked)}
          />
        </div>
        
        <div>
          <label>Before Date:</label>
          <input 
            type="date" 
            onChange={(e) => applyDateFilter(e.target.value)}
          />
        </div>
        
        <button onClick={clearFilters}>Clear Filters</button>
      </div>
      
      <div className="results">
        <h2>Results ({examples?.length || 0})</h2>
        <ul>
          {examples?.map((example) => (
            <li key={example.id}>
              {/* No need for @ts-ignore with proper typing */}
              {example.name} - Value: {example.value} - Category: {example.category} - 
              Active: {example.isActive ? 'Yes' : 'No'} - 
              Score: {example.score} - Created: {new Date(example.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0}
        >
          Previous
        </button>
        <span>Page {Math.floor(offset / limit) + 1}</span>
        <button 
          onClick={() => setOffset(offset + limit)}
          disabled={!examples || examples.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FilterExample; 