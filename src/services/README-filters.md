# Model Service Filtering Capabilities

This document explains how to use the filtering capabilities in the model service.

## Basic Usage

All the main hooks in the model service now support filtering:

### useGetModelList

```typescript
const { data, error, isLoading } = modelService.useGetModelList<MyModelType>(
  limit,    // number of items per page
  offset,   // starting position
  filters   // optional filtering criteria
);
```

### useGetModel

```typescript
const { data, error, isLoading } = modelService.useGetModel<MyModelType>(
  id,       // model ID
  filters   // optional filtering criteria
);
```

### useLastModel

```typescript
const { data, error, isLoading } = modelService.useLastModel<MyModelType>(
  partitions, // partitioning criteria
  filters     // optional filtering criteria
);
```

## Filter Types

There are two ways to specify filters:

### 1. Type-Safe Filters (Recommended)

For type safety, use the `TypedModelFilters` type with your model type:

```typescript
import { TypedModelFilters } from '../services/model-service';
import { z } from 'zod';

// Define your model schema
const MySchema = z.object({
  name: z.string(),
  value: z.number(),
  isActive: z.boolean(),
});

// Define your model type
type MyModelType = z.infer<typeof MySchema> & BaseArtifactType;

// Create type-safe filters
const filters: TypedModelFilters<MyModelType> = {
  name: 'example',       // TypeScript knows this should be a string
  value: 42,             // TypeScript knows this should be a number
  isActive: true         // TypeScript knows this should be a boolean
};
```

With this approach, TypeScript will provide type checking for both field names and values:

```typescript
// This will cause a TypeScript error because 'unknown_field' is not in MyModelType
filters.unknown_field = 'value';

// This will cause a TypeScript error because 'name' should be a string
filters.name = 123;
```

### 2. Untyped Filters (Legacy)

For backward compatibility, you can still use the untyped `ModelFilters` type:

```typescript
import { ModelFilters } from '../services/model-service';

const filters: ModelFilters = {
  name: 'example',
  value: 42,
  isActive: true
};
```

## Advanced Filtering with Operations

Both filter types support advanced operations:

```typescript
import { FilterOperation, TypedModelFilters } from '../services/model-service';

const filters: TypedModelFilters<MyModelType> = {
  // Simple equality filter
  name: 'example',
  
  // Advanced filters with operations
  value: {
    operation: FilterOperation.GREATER_THAN,
    value: 50  // TypeScript ensures this is a number
  },
  created_at: {
    operation: FilterOperation.LESS_THAN,
    value: '2023-01-01'
  }
};
```

## Available Filter Operations

The following operations are supported:

- `EQUALS` (eq): Equal to the specified value
- `GREATER_THAN` (gt): Greater than the specified value
- `LESS_THAN` (lt): Less than the specified value
- `GREATER_THAN_OR_EQUAL` (gte): Greater than or equal to the specified value
- `LESS_THAN_OR_EQUAL` (lte): Less than or equal to the specified value

## Example Component

See the `FilterExample.tsx` component for a complete example of how to implement filtering in a React component with type safety.

## Backend Implementation

The filters are passed as query parameters to the backend API. The format is:

- For simple equality: `field=value`
- For operations: `field_operation=value`

For example:
- `name=example`
- `value_gt=50`
- `created_at_lt=2023-01-01`

Make sure your backend API can handle these query parameter formats. 