# Model Service Filtering Capabilities

The model service provides powerful filtering capabilities that align with the backend query system. These filters can be used with the following hooks:

- `useGetModelList<M>(limit, offset, filters)`
- `useGetModel<M>(id, filters)`
- `useLastModel<M>(filters)`

## Basic Usage

All filters are optional parameters that allow you to narrow down your query results.

```typescript
// Simple equality filter
const { data } = useGetModelList<UserModel>(10, 0, { name: 'John' });

// Advanced filter with operations
const { data } = useGetModelList<UserModel>(10, 0, {
  score: { operation: FilterOperation.GREATER_THAN, value: 80 }
});

// Compound filter with logical operations
const { data } = useGetModelList<UserModel>(10, 0, 
  and(
    { isActive: true },
    { role: 'admin' }
  )
);
```

## Filter Types

### 1. Type-Safe Filters (Recommended)

The model service provides type-safe filtering through the `TypedModelFilters<T>` type:

```typescript
import { TypedModelFilters, FilterOperation, RangeFilter } from '../services/model-service';

// Define your model type
type UserModel = {
  name: string;
  age: number;
  isActive: boolean;
  role: string;
  created_at: string;
};

// Create type-safe filters
const filters: TypedModelFilters<UserModel> = {
  // Simple equality filter
  name: 'John',
  
  // Advanced filter with operation
  age: {
    operation: FilterOperation.GREATER_THAN,
    value: 25
  },
  
  // Range filter
  score: {
    operation: FilterOperation.RANGE,
    value: {
      gt: 75,  // greater than
      lt: 100, // less than
      // Can also use ge (greater than or equal) and le (less than or equal)
    } as RangeFilter<number>
  },
  
  // IN filter (multiple values)
  role: {
    operation: FilterOperation.IN,
    value: ['admin', 'manager']
  }
};
```

### 2. Compound Filters

Compound filters allow you to create complex logical conditions using AND and OR operations:

```typescript
import { and, or, CompoundFilter } from '../services/model-service';

// AND filter - all conditions must match
const andFilter = and<UserModel>(
  { isActive: true },
  { role: 'admin' },
  { age: { operation: FilterOperation.GREATER_THAN, value: 30 } }
);

// OR filter - any condition can match
const orFilter = or<UserModel>(
  { role: 'admin' },
  { role: 'manager' }
);

// Nested compound filters
const complexFilter = or<UserModel>(
  { role: 'admin' },
  and<UserModel>(
    { isActive: true },
    { age: { operation: FilterOperation.GREATER_THAN, value: 25 } }
  )
);
```

## Available Filter Operations

The `FilterOperation` enum provides the following operations:

```typescript
enum FilterOperation {
  EQUALS = 'eq',                    // field = value
  NOT_EQUALS = 'ne',                // field != value
  GREATER_THAN = 'gt',              // field > value
  GREATER_THAN_OR_EQUAL = 'ge',     // field >= value
  LESS_THAN = 'lt',                 // field < value
  LESS_THAN_OR_EQUAL = 'le',        // field <= value
  IN = 'in',                        // field IN (value1, value2, ...)
  NOT_IN = 'nin',                   // field NOT IN (value1, value2, ...)
  CONTAINS = 'contains',            // field CONTAINS value (for strings)
  STARTS_WITH = 'startswith',       // field STARTS WITH value (for strings)
  ENDS_WITH = 'endswith',           // field ENDS WITH value (for strings)
  IS_NULL = 'isnull',               // field IS NULL
  RANGE = 'range',                  // field is within a range
}
```

## Logical Operations

The `QueryOperation` enum provides logical operations for compound filters:

```typescript
enum QueryOperation {
  AND = 'and',  // All conditions must match
  OR = 'or'     // Any condition can match
}
```

## Backend Implementation

Filters are passed to the backend API as query parameters. The model service automatically converts the filter objects to the appropriate query parameter format:

### Simple Filters

Simple equality filters are converted to: `field=value`

Example:
```typescript
{ name: 'John' } → ?name=John
```

### Advanced Filters

Advanced filters with operations are converted to: `field_operation=value`

Examples:
```typescript
{ age: { operation: FilterOperation.GREATER_THAN, value: 25 } } → ?age_gt=25
{ score: { operation: FilterOperation.RANGE, value: { gt: 75, lt: 100 } } } → ?score_range={"gt":75,"lt":100}
{ role: { operation: FilterOperation.IN, value: ['admin', 'manager'] } } → ?role_in=admin,manager
```

### Compound Filters

Compound filters are converted to a JSON string in the `filter` query parameter:

```typescript
and({ isActive: true }, { role: 'admin' }) → ?filter={"op":"and","filters":[{"isActive":true},{"role":"admin"}]}
```

## Example Component

See the `FilterExample.tsx` component for a complete example of how to use these filtering capabilities. 