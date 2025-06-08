# Form Components Documentation

## Overview
This directory contains form components designed to provide flexible and customizable form layouts. The components support global styling options for gaps, label widths, and input widths, allowing for consistent and adaptable form designs.

## Components

### Form
- **Description**: The main form component that provides context and styling for child components.
- **Props**:
  - `componentGap`: Sets the gap between form components globally.
  - `labelWidth`: Sets a global width for all labels within the form.
  - `inputWidth`: Sets a global width for all input fields.

### InputField
- **Description**: A component for rendering input fields with customizable styles.
- **Props**:
  - `type`: The input type (e.g., "text", "number").
  - `label`: A user-friendly label for the field.
  - `field`: The field name, which can be nested.
  - `inputWidth`: Overrides the global input width for this field.
  - `labelWidth`: Overrides the global label width for this field.

### SelectField
- **Description**: A component for rendering select fields with customizable styles.
- **Props**:
  - `type`: The input type (e.g., "select").
  - `label`: A user-friendly label for the field.
  - `field`: The field name, which can be nested.
  - `inputWidth`: Overrides the global input width for this field.
  - `labelWidth`: Overrides the global label width for this field.

### TextField
- **Description**: A component for rendering text areas with customizable styles.
- **Props**:
  - `type`: The input type (e.g., "textarea").
  - `label`: A user-friendly label for the field.
  - `field`: The field name, which can be nested.
  - `inputWidth`: Overrides the global input width for this field.
  - `labelWidth`: Overrides the global label width for this field.

## Usage Examples

### Basic Form with Global Styling
```jsx
import React from 'react';
import { Form, InputField, SelectField } from './form';

const MyForm = () => {
    return (
        <Form 
            componentGap="1rem" 
            labelWidth="150px" 
            inputWidth="calc(100% - 150px)"
            schema={mySchema}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
        >
            <InputField 
                type="text" 
                label="Name" 
                field="name"
            />
            <SelectField 
                label="Category" 
                field="category"
                options={categoryOptions}
            />
        </Form>
    );
};
```

### Form with Custom Gap and Widths
```jsx
import React from 'react';
import { Form, TextField, ArrayField } from './form';

const CustomForm = () => {
    return (
        <Form 
            componentGap="2rem" 
            labelWidth="200px" 
            inputWidth="calc(100% - 200px)"
            schema={customSchema}
            onSubmit={customSubmit}
            defaultValues={customDefaults}
        >
            <TextField 
                type="text" 
                label="Description" 
                field="description"
            />
            <ArrayField 
                field="items"
                children={(item, index, prefix, remove) => (
                    <TextField 
                        type="text" 
                        label={`Item ${index + 1}`} 
                        field="itemName"
                        prefix={prefix}
                    />
                )}
            />
        </Form>
    );
};
```

## Conclusion
These components provide enhanced styling flexibility and consistency for form components, improving the overall user experience and maintainability of the codebase. 