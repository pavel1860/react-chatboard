// src/components/DynamicForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller, useFieldArray, Control, UseFormRegister, UseFormHandleSubmit, FieldErrors, Field } from 'react-hook-form';
import { ZodSchema, ZodTypeAny, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, SelectItem, Skeleton, Form, Button } from '@nextui-org/react';


type FieldConfig = {
    [key: string]: {
        hidden?: boolean;
        isTitle?: boolean;
        omit?: boolean;
        disabled?: boolean;
        icon?: React.ReactElement;
    } | FieldConfig;
}


interface FormConfig<T extends ZodTypeAny = ZodTypeAny> {
    register: UseFormRegister<z.TypeOf<T>>
    control: Control<z.TypeOf<T>, any>
    errors: FieldErrors<z.TypeOf<T>>
    handleSubmit: UseFormHandleSubmit<z.TypeOf<T>, undefined>
    isReadOnly?: boolean;
    
    // variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | undefined
    variant?: "flat" | "bordered" | "faded" | "underlined"
    controls?: "top" | "bottom"
    iconPlacement?: "left" | "inputStart" | "inputEnd"
    radius?: "none" | "sm" | "md" | "lg" | "full" | undefined
    size: "sm" | "md" | "lg"
    classNames?: {
        label?: string,
        input?: string
    }
    labelPlacement?: "inside" | "outside" | "outside-left"
}



interface FormConfigProviderProps extends FormConfig {
    isReadOnly: boolean;
    setIsReadOnly: (isReadOnly: boolean) => void;
}


interface DynamicFormProps<T extends ZodTypeAny> extends ZodTypeAny, FormConfig {
    schema: T;
    defaultValues?: Partial<z.infer<T>>; // Optional default values
    onSubmit: SubmitHandler<z.infer<T>>;
    loading?: boolean;

    fieldConfig?: FieldConfig,

};






interface FieldProps<T extends ZodTypeAny> {
    fieldName: string
    fieldPath: string
    field: ZodTypeAny
    control: Control<z.TypeOf<T>, any>
    config: FieldConfig
    // formConfig: FormConfig
}


// type DynamicFormProps<T extends ZodTypeAny> = {
//     schema: T;
//     defaultValues?: Partial<z.infer<T>>; // Optional default values
//     onSubmit: SubmitHandler<z.infer<T>>;
//     loading?: boolean;

//     fieldConfig?: FieldConfig,
//     isReadOnly?: boolean;
//     // variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | undefined
//     variant?: "flat" | "bordered" | "faded" | "underlined"
//     controls?: "top" | "bottom"
//     iconPlacement?: "left" | "inputStart" | "inputEnd"
//     radius?: "none" | "sm" | "md" | "lg" | "full" | undefined
//     size: "sm" | "md" | "lg"
//     classNames?: {
//         label?: string,
//         input?: string
//     }
//     labelPlacement?: "inside" | "outside" | "outside-left"

// };


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
        <div className="">
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
    if (fieldConfig) {
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




const FormContext = React.createContext<FormConfigProviderProps>({} as any)



export function FormConfigProvider<T extends ZodTypeAny>({
    children,
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
}: { children: React.ReactNode } & DynamicFormProps<T>) {

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

    const [isReadOnly, setIsReadOnly] = useState(isReadOnlyProp !== undefined ? isReadOnlyProp : true)

    return <FormContext.Provider value={{
        isReadOnly,
        setIsReadOnly,
        register,
        control,
        handleSubmit,
        errors,
        schema,
        loading,
        onSubmit,
        fieldConfig,
        variant,
        size,
        controls,
        radius,
        defaultValues,
        labelPlacement,
        iconPlacement,
        classNames,
    }}>
        {children}
    </FormContext.Provider>
}


export function useFormConfig() {
    return React.useContext(FormContext)
}



const NestingWrapper = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="ml-6">
            {children}
        </div>
    )
}



const useFieldConfig = (config: FieldConfig, fieldName: string) => {

    let inputStartIcon = undefined
    let inputEndIcon = undefined
    let leftIcon = undefined

    const label = toTitleCase(fieldName);

    const {
        control,
        errors,
        variant,
        size,
        isReadOnly,
        controls,
        radius,
        labelPlacement,
        iconPlacement,
        classNames,
    } = useFormConfig()

    if (iconPlacement == "left") {
        leftIcon = config.icon
    } else if (iconPlacement == "inputStart") {
        inputStartIcon = config.icon
    } else if (iconPlacement == "inputEnd") {
        inputEndIcon = config.icon
    }


    return {
        inputStartIcon,
        inputEndIcon,
        leftIcon,
        label,
        control,
        error: errors[fieldName],
        variant,
        size,
        isReadOnly,
        controls,
        radius,
        labelPlacement,
        iconPlacement,
        classNames,
    }

}


const FormField = ({ fieldName, fieldPath, field, config }: FieldProps) => {

    // let inputStartIcon = undefined
    // let inputEndIcon = undefined
    // let leftIcon = undefined

    // const label = toTitleCase(fieldName);

    // const {
    //     control,
    //     errors,
    //     variant,
    //     size,
    //     isReadOnly,
    //     controls,
    //     radius,
    //     labelPlacement,
    //     iconPlacement,
    //     classNames,
    // } = useFormConfig()


    // if (iconPlacement == "left") {
    //     leftIcon = config.icon
    // } else if (iconPlacement == "inputStart") {
    //     inputStartIcon = config.icon
    // } else if (iconPlacement == "inputEnd") {
    //     inputEndIcon = config.icon
    // }

    const {
        control,
        leftIcon,
        inputStartIcon,
        inputEndIcon,
        label,
    } = useFieldConfig(config, fieldName)
    
    return (
        <Controller
            //@ts-ignore
            // name={fieldName as keyof z.infer<T>}
            name={fieldPath as keyof z.infer<T>}
            control={control}
            render={({ field }) => (
                <>
                <div className="flex items-center gap-3">
                    {leftIcon}
                    <label
                        className="block z-10 subpixel-antialiased text-small pointer-events-none relative text-foreground will-change-auto origin-top-left rtl:origin-top-right !duration-200 !ease-out transition-[transform,color,left,opacity] motion-reduce:transition-none ps-2 pe-2 w-[150px]"
                    >{label}</label>
                    <span
                        className="relative w-full inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled"
                    >{field.value}</span>
                    {inputEndIcon}
                </div>
                {/* <Input
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
                /> */}
                </>
            )}

        />
    )
}


const StringField = ({ fieldName, fieldPath, field, config }: FieldProps) => {
    // let inputStartIcon = undefined
    // let inputEndIcon = undefined
    // let leftIcon = undefined

    // const {
    //     control,
    //     errors,
    //     variant,
    //     size,
    //     isReadOnly,
    //     controls,
    //     radius,
    //     labelPlacement,
    //     iconPlacement,
    //     classNames,
    // } = useFormConfig()

    // const label = toTitleCase(fieldName);

    // if (iconPlacement == "left") {
    //     leftIcon = config.icon
    // } else if (iconPlacement == "inputStart") {
    //     inputStartIcon = config.icon
    // } else if (iconPlacement == "inputEnd") {
    //     inputEndIcon = config.icon
    // }

    const {
        control,
        leftIcon,
        inputStartIcon,
        inputEndIcon,
        label,
        error,
        variant,
        size,
        isReadOnly,
        radius,
        labelPlacement,
        classNames
    } = useFieldConfig(config, fieldName)


    return <FieldWrapper icon={leftIcon} error={error}>
        <Controller
            //@ts-ignore
            // name={fieldName as keyof z.infer<T>}
            name={fieldPath as keyof z.infer<T>}
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
}



const EnumField = ({ fieldName, fieldPath, field, config }: FieldProps) => {

    // let inputStartIcon = undefined
    // let inputEndIcon = undefined
    // let leftIcon = undefined

    // const {
    //     control,
    //     errors,
    //     variant,
    //     size,
    //     isReadOnly,
    //     controls,
    //     radius,
    //     labelPlacement,
    //     iconPlacement,
    //     classNames,
    // } = useFormConfig()

    // const label = toTitleCase(fieldName);

    // if (iconPlacement == "left") {
    //     leftIcon = config.icon
    // } else if (iconPlacement == "inputStart") {
    //     inputStartIcon = config.icon
    // } else if (iconPlacement == "inputEnd") {
    //     inputEndIcon = config.icon
    // }

    const {
        control,
        leftIcon,
        inputStartIcon,
        inputEndIcon,
        label,
        error,
        variant,
        size,
        isReadOnly,
        radius,
        labelPlacement,
        classNames
    } = useFieldConfig(config, fieldName)

    const enumValues = (field as z.ZodEnum<[string, ...string[]]>).enum;
    const selectValues = Object.keys(enumValues).map((option) => ({ label: toTitleCase(option), value: enumValues[option] }));
    
    return (
        <FieldWrapper icon={leftIcon} error={error}>
            <Controller
                //@ts-ignore
                name={fieldPath as keyof z.infer<T>}
                control={control}
                render={({ field }) => (
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


    
    const { handleSubmit, isReadOnly, setIsReadOnly } = useFormConfig();
    // const {
    //     register,
    //     handleSubmit,
    //     control,
    //     formState: { errors },
    // } = useForm<z.infer<T>>({
    //     // resolver: zodResolver(schema.omit({
    //     //     created_at: true,
    //     //     updated_at: true,
    //     //     id: true,
    //     //     phone_number: true,
    //     //     manager_phone_number: true,
    //     // })),
    //     resolver: zodResolver(getOmitFields(schema, fieldConfig)),
    //     //@ts-ignore
    //     defaultValues: defaultValues,
    // });


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


    const renderFieldType = (fieldName: string, field: ZodTypeAny) => {

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
                    return <StringField
                        fieldName={fieldName}
                        field={field}
                        config={fieldConfig?.[fieldName] || {}}
                    />
                // return (
                //     <FieldWrapper icon={leftIcon} error={errors[fieldName]}>
                //         <Controller
                //             //@ts-ignore
                //             name={fieldName as keyof z.infer<T>}
                //             control={control}
                //             render={({ field }) => (
                //                 <Input
                //                     isReadOnly={isReadOnly}
                //                     id={fieldName}
                //                     variant={variant}
                //                     radius={radius}
                //                     size={size}
                //                     startContent={inputStartIcon}
                //                     endContent={inputEndIcon}
                //                     {...field}
                //                     label={label}
                //                     placeholder={label}
                //                     labelPlacement={labelPlacement}
                //                     classNames={{
                //                         label: classNames?.label,
                //                         mainWrapper: `${classNames?.input}`,
                //                         // inputWrapper: `${isReadOnly ? "bg-white" : ""}`
                //                     }}
                //                 />
                //             )}

                //         />
                //     </FieldWrapper>
                // );
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value == "" ? undefined : Number(value));
                                        }}
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
                case 'array':
                    return renderArrayField(fieldName, field as z.ZodArray<z.ZodTypeAny>);

                default:
                    return null;
            }
        });
    };


    const renderObjectField = (schema: z.AnyZodObject, parentPath?: string, fieldConfig?: FieldConfig) => {
        const shape = schema.shape;
        return Object.keys(shape).map((fieldName) => {
            const field = shape[fieldName];
            const fieldType = getFieldType(field);
            const label = toTitleCase(fieldName);
            const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

            if (fieldConfig && fieldConfig[fieldName]?.hidden) return null;

            if (isReadOnly && fieldType !== 'array' && fieldType !== 'object') {
                return <FormField fieldName={fieldName} fieldPath={fieldPath} field={field} config={fieldConfig?.[fieldName] || {}} />                
            }

            switch (fieldType) {
                case "string":
                    return <StringField
                        fieldName={fieldName}
                        fieldPath={fieldPath}
                        field={field}
                        config={fieldConfig?.[fieldName] || {}}
                    />
                case 'enum':
                    return <EnumField
                        fieldName={fieldName}
                        fieldPath={fieldPath}
                        field={field}
                        config={fieldConfig?.[fieldName] || {}}
                    />
                case 'object':
                    return (
                        <NestingWrapper>
                            <label>{toTitleCase(fieldName)}</label>
                            {renderObjectField(field as z.ZodObject, fieldPath, fieldConfig && fieldConfig[fieldName])}
                        </NestingWrapper>
                    )
                case 'array':
                    return (
                        <NestingWrapper>
                            {renderArrayField(fieldName, field as z.ZodArray<z.ZodTypeAny>, fieldConfig && fieldConfig[fieldName])}
                        </NestingWrapper>
                    )
                default:
                    return null;
            }


        })

    }


    const renderArrayField = (fieldName: string, schema: z.ZodArray<z.ZodTypeAny>, fieldConfig?: FieldConfig) => {
        const itemType = getFieldType(schema.element);
        const { register, control, errors } = useFormConfig();
        const { fields, append, remove } = useFieldArray({
            control,
            name: fieldName as keyof z.infer<T> & string,
        });

        const fieldErrors = errors[fieldName as keyof z.infer<T>];
        const arrayErrors = Array.isArray(fieldErrors)
            ? fieldErrors.map((err) => err?.message as string | undefined)
            : undefined;

        return (
            <div key={fieldName} style={{ marginBottom: '1rem' }}>
                <label>{toTitleCase(fieldName)}</label>
                {fields.map((item, index) => {
                    const fieldPath = `${fieldName}[${index}]` as const;
                    const itemError = arrayErrors ? arrayErrors[index] : undefined;

                    switch (itemType) {
                        // case 'string':
                        //     return (
                        //         <StringField
                        //             fieldName={fieldPath}
                        //             field={schema.element}
                        //             config={fieldConfig?.[fieldName] || {}}
                        //         />
                        //     )
                        // return (
                        //     <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        //         <input
                        //             {...register(`${fieldName}.${index}` as const)}
                        //             defaultValue={item.value} // Make sure to set defaultValue
                        //         />
                        //         <button type="button" onClick={() => remove(index)} style={{ marginLeft: '0.5rem' }}>
                        //             Remove
                        //         </button>
                        //         {itemError && <p style={{ color: 'red', marginLeft: '1rem' }}>{itemError}</p>}
                        //     </div>
                        // );
                        case 'object':
                            // return renderObjectField(schema.element, inputName);
                            return (
                                <NestingWrapper>
                                    {renderObjectField(schema.element, fieldPath, fieldConfig)}
                                </NestingWrapper>
                            )
                        // Add cases for other item types (number, enum, etc.) as needed
                        default:
                            return null;
                    }
                })}
                <button type="button" onClick={() => append('')} style={{ marginTop: '0.5rem' }}>
                    Add {toTitleCase(schema.element._def.typeName)}
                </button>
                {fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors) && (
                    <p style={{ color: 'red' }}>{(fieldErrors as any).message}</p>
                )}
            </div>
        );
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
                    isReadOnly ? null :
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
            {/* {renderFields()} */}
            {renderObjectField(schema, undefined, fieldConfig)}
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
    if (field instanceof z.ZodArray) return 'array';
    if (field instanceof z.ZodObject) return 'object';

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





const DynamicFormWrapper = <T extends ZodTypeAny>(
    { ...props }: DynamicFormProps<T>
) => {
    return (
        <FormConfigProvider {...props}>
            <DynamicForm {...props} />
        </FormConfigProvider>
    )
}





export default DynamicFormWrapper;
