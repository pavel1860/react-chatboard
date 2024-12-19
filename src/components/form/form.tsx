// src/components/DynamicForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ZodSchema, ZodTypeAny, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, SelectItem, Skeleton, Form, Button } from '@nextui-org/react';


type FieldConfig = {
    [key: string]: {
        hidden?: boolean;
        omit?: boolean;
        disabled?: boolean;
        icon?: React.ReactElement;
    }
}

type DynamicFormProps<T extends ZodTypeAny> = {
    schema: T;
    defaultValues?: Partial<z.infer<T>>; // Optional default values
    onSubmit: SubmitHandler<z.infer<T>>;
    loading?: boolean;
    isReadOnly?: boolean;
    // variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | undefined
    variant?: "flat" | "bordered" | "faded" | "underlined"
    controls?: "top" | "bottom"
    iconPlacement?: "left" | "inputStart" | "inputEnd"
    fieldConfig?: FieldConfig,
    radius?: "none" | "sm" | "md" | "lg" | "full" | undefined
    size: "sm" | "md" | "lg"
    classNames?: {
        label?: string,
        input?: string
    }
    labelPlacement?: "inside" | "outside" | "outside-left"
};


// interface EditableFieldProps {
//     fieldName: string
//     fieldType: string
//     label: string
//     register: any
//     errors: any
// }

// export function EditableField<T>({fieldName, register, label}: EditableFieldProps){
//     <div key={fieldName}>
//         <label htmlFor={fieldName}>{label}</label>
//         <input id={fieldName} {...register(fieldName as keyof z.infer<T>)} />
//         {errors[fieldName] && <p style={{ color: 'red' }}>{errors[fieldName]?.message as string}</p>}
//     </div>
// }

const FieldWrapper = ({ children, icon, error }: any) => {

    return (
        <div>
            <div className="flex items-center gap-2">
                {icon}
                {children}
            </div>
            {error && <p style={{ color: 'red' }}>{error?.message as string}</p>}
        </div>
    )
}



const getOmitFields = (schema: any, fieldConfig?: FieldConfig) => {
    const shape = schema.shape;
    let omitFields: any = {}
    if (fieldConfig){        
        for (const fieldName in fieldConfig) {
            if (fieldConfig[fieldName].omit) {
                omitFields[fieldName] = true
            }
        }
        return schema.omit(omitFields)
    } else {
        return schema
    }
}


const DynamicForm = <T extends ZodTypeAny>(
    {
        schema,
        loading,
        onSubmit,
        fieldConfig,
        variant,
        size,
        isReadOnly: isReadOnlyProp,
        controls,
        radius,
        defaultValues = {}, // Default to empty object if not provided
        labelPlacement = "outside-left",
        iconPlacement = "left",
        classNames,
    }: DynamicFormProps<T>) => {


    const [isReadOnly, setIsReadOnly] = useState(isReadOnlyProp !== undefined ? isReadOnlyProp : true)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<z.infer<T>>({
        // resolver: zodResolver(schema.omit({
        //     created_at: true,
        //     updated_at: true,
        //     id: true,
        //     phone_number: true,
        //     manager_phone_number: true,
        // })),
        resolver: zodResolver(getOmitFields(schema, fieldConfig)),
        //@ts-ignore
        defaultValues: defaultValues,
    });


    const onSubmitHandler: SubmitHandler<z.infer<typeof schema>> = (data) => {
        setIsReadOnly(true)
        onSubmit(data)
        // console.log(data)
    }



    if (loading) {
        //@ts-ignore
        const shape = schema.shape;
        return (
            <div className="w-full flex flex-col gap-2 px-4 items-center">
                {Object.keys(shape).map((fieldName) => (
                    <Skeleton className="h-4 m-2 w-2/5 rounded-lg" />
                ))}
            </div>
        )
    }


    // Helper function to render form fields based on schema
    const renderFields = () => {
        //@ts-ignore
        const shape = schema.shape;
        return Object.keys(shape).map((fieldName) => {
            const field = shape[fieldName];
            const fieldType = getFieldType(field);
            const label = toTitleCase(fieldName);

            let inputStartIcon = undefined
            let inputEndIcon = undefined
            let leftIcon = undefined

            const currFieldConfig = fieldConfig?.[fieldName]
            if (currFieldConfig) {
                if (currFieldConfig.hidden || currFieldConfig.omit) return null;
                if (iconPlacement == "left") {
                    leftIcon = currFieldConfig.icon
                } else if (iconPlacement == "inputStart") {
                    inputStartIcon = currFieldConfig.icon
                } else if (iconPlacement == "inputEnd") {
                    inputEndIcon = currFieldConfig.icon
                }
            }

            // Skip hidden fields
            // if (fieldConfig?.[fieldName]?.hidden) return null;


            switch (fieldType) {
                case 'string':
                    return (
                        <FieldWrapper icon={leftIcon} error={errors[fieldName]}>
                            <Controller
                            //@ts-ignore
                                name={fieldName as keyof z.infer<T>}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        isReadOnly={isReadOnly}
                                        id={fieldName}
                                        variant={variant}
                                        radius={radius}
                                        size={size}
                                        startContent={inputStartIcon}
                                        endContent={inputEndIcon}
                                        {...field}
                                        label={label}
                                        placeholder={label}
                                        labelPlacement={labelPlacement}
                                        classNames={{
                                            label: classNames?.label,
                                            mainWrapper: `${classNames?.input}`,
                                            // inputWrapper: `${isReadOnly ? "bg-white" : ""}`
                                        }}
                                    />
                                )}

                            />
                        </FieldWrapper>
                    );
                case 'number':
                    return (
                        <FieldWrapper icon={leftIcon} error={errors[fieldName]}>
                            <Controller
                            //@ts-ignore
                                name={fieldName as keyof z.infer<T>}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id={fieldName}
                                        isReadOnly={isReadOnly}
                                        variant={variant}
                                        startContent={inputStartIcon}
                                        endContent={inputEndIcon}
                                        type="number"
                                        size={size}
                                        radius={radius}
                                        {...field}
                                        label={label}
                                        placeholder={label}
                                        labelPlacement={labelPlacement}
                                        classNames={{
                                            label: classNames?.label,
                                            mainWrapper: `${classNames?.input}`,
                                        }}
                                    />
                                )}
                            />
                        </FieldWrapper>)

                case 'enum':
                    // const enumValues = (field as z.ZodEnum<[string, ...string[]]>).options;
                    const enumValues = (field as z.ZodEnum<[string, ...string[]]>).enum;
                    const selectValues = Object.keys(enumValues).map((option) => ({ label: toTitleCase(option), value: enumValues[option] }));
                    return (
                        <FieldWrapper icon={leftIcon} error={errors[fieldName]}>
                            <Controller
                            //@ts-ignore
                                name={fieldName as keyof z.infer<T>}
                                control={control}
                                render={({ field }) => (
                                    isReadOnly ?
                                        <Input
                                            id={fieldName}
                                            isReadOnly={isReadOnly}
                                            variant={variant}
                                            startContent={inputStartIcon}
                                            endContent={inputEndIcon}
                                            size={size}
                                            radius={radius}
                                            // {...field}
                                            value={field.value}
                                            label={label}
                                            placeholder={label}
                                            labelPlacement={labelPlacement}
                                            classNames={{
                                                label: classNames?.label,
                                                mainWrapper: `${classNames?.input}`,
                                            }}
                                        /> :
                                        <Select
                                            id={fieldName}
                                            disallowEmptySelection
                                            isDisabled={isReadOnly}
                                            variant={variant}
                                            size={size}
                                            radius={radius}
                                            startContent={inputStartIcon}
                                            endContent={inputEndIcon}
                                            selectedKeys={[field.value]}
                                            {...field}
                                            items={selectValues}
                                            label={label}
                                            placeholder={label}
                                            labelPlacement={labelPlacement}
                                            classNames={{
                                                base: "items-center",
                                                mainWrapper: `${classNames?.input}`,
                                                label: `ps-2 pe-2 ${classNames?.label}`,
                                            }}
                                        // items={enumValues.map((option) => ({ label: toTitleCase(option), value: option }))}
                                        >
                                            {
                                                selectValues.map((option) => (<SelectItem key={option.value}>{option.label}</SelectItem>))
                                            }
                                            {/* {Object.keys(enumValues).map((option) => (
                                            <SelectItem key={option}>{enumValues[option]}</SelectItem>
                                        ))} */}
                                        </Select>

                                )}
                            />
                        </FieldWrapper>)
                case 'boolean':
                    return (
                        <div key={fieldName}>
                            <label htmlFor={fieldName}>
                                {/* @ts-ignore */}
                                <input type="checkbox" id={fieldName} {...register(fieldName as keyof z.infer<T>)} />
                                {label}
                            </label>
                            {errors[fieldName] && <p style={{ color: 'red' }}>{errors[fieldName]?.message as string}</p>}
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    return <div>
        {controls && <div className="flex justify-end w-full">
            {
                isReadOnly ? <Button
                    size="sm"
                    variant='light'
                    onPress={() => { setIsReadOnly(false) }}
                >
                    edit
                </Button> : null
                    
            }
        </div>}
        {/* {errors && <div className="text-red-500">{JSON.stringify(errors)}</div>} */}
        <Form
            className="w-full max-w-md py-2 px-4"
            validationBehavior="native"
            onSubmit={handleSubmit(onSubmitHandler)} // Correct usage
        >
            {controls && <div className="flex justify-end w-full">
                {
                    isReadOnly ? null:
                        <>
                            <Button
                                type="submit"
                                size="sm"
                                variant='light'
                            >
                                save
                            </Button>
                            <Button
                                size="sm"
                                variant='light'
                                onPress={() => { setIsReadOnly(true) }}
                            >
                                cancel
                            </Button>
                        </>

                }
            </div>}
            {renderFields()}
        </Form>
    </div>
};

// Utility function to determine field type
const getFieldType = (field: ZodTypeAny): string => {
    if (field instanceof z.ZodString) return 'string';
    if (field instanceof z.ZodNumber) return 'number';
    if (field instanceof z.ZodBoolean) return 'boolean';
    if (field instanceof z.ZodEnum) return 'enum';
    if (field instanceof z.ZodNativeEnum) return 'enum';
    // Add more types as needed
    return 'string';
};

// Utility function to convert field names to Title Case
const toTitleCase = (str: string) => {
    return str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (s) => s.toUpperCase())
        .replace("_", " ") // Capitalize first letter
        .trim();
};

export default DynamicForm;
