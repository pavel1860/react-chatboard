import React, { use, useEffect } from "react"
import { 
  Button, 
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Input, 
  Textarea, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from "@heroui/react"
import { create } from "domain"
import useDebounce from "./hooks/helperHooks"
import { EditExampleProvider, useEditExample } from "./EditExampleProvider"



export const MetadataFieldCard = ({ field, data, onEdit, depth, path }: { field: any, data: any, onEdit: any,depth: number, path: any[] }) => {

    console.log("##########################")
    console.log(data)

    const {
        getExampleField,
        setExampleField,
    } = useEditExample()


    const [localData, setLocalData] = React.useState(data)

    const [ debaunsedData, setDebaunsedData ] = useDebounce(localData, 1000)

    useEffect(() => {
        if (data !== debaunsedData){
            setExampleField(path.concat([field]), debaunsedData)
        }
    }, [debaunsedData])

    if(typeof data === 'object' ){
        if (Array.isArray(data)) {
            return (
            <>
                <span className="bg-red-200 rounded-sm px-1">{field}</span>
                {data.map((d, i) => 
                    <MetadataField field={i} data={d} onEdit={onEdit} depth={depth + 1} path={path.concat([field])}/>
                )}
            </>
        )} else {
            return (<>
                <span className="bg-red-200 rounded-sm px-1">{field}</span>
                {Object.keys(data).map((k) => 
                    <MetadataField field={k} data={data[k]} onEdit={onEdit} depth={depth + 1} path={path.concat([field])}/>
                )}
            </>
            )
        }

    } else {

        if (typeof data === 'boolean') {
            return (
                <div className="flex">                                    
                    <Input 
                        label={field} 
                        type="checkbox" 
                        checked={data} 
                        onChange={(e)=>{setLocalData(e.target.checked)}} 
                        // onChange={(e)=>{setExampleField(path.concat([field]), e.target.checked)}} 
                    />
                </div>
            )
        }
        if (typeof data === 'number') {
            return (
                <div className="flex">                
                    <Input
                        value={`${data}`}
                        label={field}
                        type="number"
                        onChange={(e)=>{setLocalData(e.target.value)}}
                        // onChange={(e)=>{setExampleField(path.concat([field]), e.target.value)}}
                    />
                </div>
            )
        }

        if (typeof data === 'string') {
          if (data.length > 50) {
            return (
              <Textarea        
                value={localData}
                onChange={(e)=>{setLocalData(e.target.value)}}        
                // value={data}         
                // onChange={(e)=>{setExampleField(path.concat([field]), e.target.value)}}
                variant={"flat"}
                label={field}
                labelPlacement="outside"
                placeholder="Enter your description"
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
              />
          )
          }

        }
        return (
            <div className="flex">                
                {/* <span className={`rounded-sm px-1 text-center`}>{field}</span> */}
                <Input 
                    label={field}  
                    value={data} 
                    // onChange={(e)=>{setLocalData(e.target.value)}} 
                    onChange={(e)=>{setExampleField(path.concat([field]), e.target.value)}} 
                />
            </div>
        )
    }    
}


export const MetadataField = ({ field, data, onEdit, depth, path }: { field: any, data: any, onEdit: any, depth: number, path: any[] }) => {

    if (depth > 3) return null
    console.log("#######", `ml-[${(depth*3 + 10 )}px]`)
    return (
        // <div className={`ml-[${(depth + 30 )}px]`}>
        <div className={`ml-4`}>
            <MetadataFieldCard field={field} data={data} onEdit={()=>{}} depth={depth} path={path} />
        </div>
    )
}





export const NamespaceDropdown = () => {

  const {
    namespaces,
    selectedNamespace,
    setSelectedNamespace
  } = useEditExample()

  return (
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="bordered" 
          >
            {selectedNamespace}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" onAction={(key) => setSelectedNamespace(key as string)}>
          {namespaces && namespaces.map((namespace, i) => (<DropdownItem key={namespace}>{namespace}</DropdownItem>))}          
        </DropdownMenu>
      </Dropdown>
  );
}




export const EditExampleFormModal = ({onClose}: {onClose: any }) => {

  const { 
    example,
    addExample,  
    namespaces,
  } = useEditExample()
  
  if (!example) return null

  return (
    <Modal 
          isOpen={true} 
          placement="center" 
          scrollBehavior="inside"
          onOpenChange={onClose} 
          // size="2xl"
          className="bg-white border-1 max-w-6xl max-h-full z-[1000000000]"
          backdrop="blur"
          
          >
              
          <ModalContent>
              {(onClose) => (
                  <>
                      <ModalHeader className="flex gap-1 align-middle items-center"><h2>Modal Title </h2><NamespaceDropdown/></ModalHeader>
                      
                      <ModalBody>
                          <div className="flex"> 
                              <div className="w-6/12">
                                  <h1 className="bg-green-200 px-2 font-semibold rounded-sm">Input</h1>
                                  {Object.keys(example.input).map((key, i) => (
                                      <MetadataField key={i} field={key} data={example.input[key]} onEdit={()=>{}} path={['input']} depth={0}/>
                                  ))}  
                              </div> 
                              <div className="w-6/12">
                                  <h1 className="bg-red-200 px-2 font-semibold rounded-sm">Output</h1>
                                  {Object.keys(example.output).map((key, i) => (
                                      <MetadataField key={i} field={key} data={example.output[key]} onEdit={()=>{}} path={['output']} depth={0}/>
                                  ))}  
                              </div>  
                          </div>
                      </ModalBody>
                      <ModalFooter>
                          <Button color="danger" variant="light" onPress={()=>{
                              onClose()
                            }}>
                              Close
                          </Button>
                          <Button color="primary" onPress={() => {
                              addExample()
                              onClose()
                            }}>
                              Action
                          </Button>
                      </ModalFooter>
                  </>
              )}
          </ModalContent>
      </Modal>
  )
}


export const EditExampleForm = ({ example, onClose }: { example: any, onClose: any }) => {


    return (        
        <EditExampleProvider example={example}>
            <EditExampleFormModal onClose={onClose}/>
        </EditExampleProvider>


    )







return (
    <Modal
    isOpen={true}
    // size="2xl"
    // onOpenChange={onOpenChange}
    // scrollBehavior={"outside"}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Modal Title
          </ModalHeader>
          <ModalBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam pulvinar risus non risus hendrerit venenatis.
              Pellentesque sit amet hendrerit risus, sed porttitor quam.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam pulvinar risus non risus hendrerit venenatis.
              Pellentesque sit amet hendrerit risus, sed porttitor quam.
            </p>
            {/* <p>
              Magna exercitation reprehenderit magna aute tempor cupidatat
              consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
              incididunt cillum quis. Velit duis sit officia eiusmod Lorem
              aliqua enim laboris do dolor eiusmod. Et mollit incididunt
              nisi consectetur esse laborum eiusmod pariatur proident Lorem
              eiusmod et. Culpa deserunt nostrud ad veniam.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam pulvinar risus non risus hendrerit venenatis.
              Pellentesque sit amet hendrerit risus, sed porttitor quam.
              Magna exercitation reprehenderit magna aute tempor cupidatat
              consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
              incididunt cillum quis. Velit duis sit officia eiusmod Lorem
              aliqua enim laboris do dolor eiusmod. Et mollit incididunt
              nisi consectetur esse laborum eiusmod pariatur proident Lorem
              eiusmod et. Culpa deserunt nostrud ad veniam.
            </p>
            <p>
              Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
              duis sit officia eiusmod Lorem aliqua enim laboris do dolor
              eiusmod. Et mollit incididunt nisi consectetur esse laborum
              eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
              nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nullam pulvinar risus non risus hendrerit
              venenatis. Pellentesque sit amet hendrerit risus, sed
              porttitor quam. Magna exercitation reprehenderit magna aute
              tempor cupidatat consequat elit dolor adipisicing. Mollit
              dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
              officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
              mollit incididunt nisi consectetur esse laborum eiusmod
              pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
              veniam.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam pulvinar risus non risus hendrerit venenatis.
              Pellentesque sit amet hendrerit risus, sed porttitor quam.
            </p>
            <p>
              Magna exercitation reprehenderit magna aute tempor cupidatat
              consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
              incididunt cillum quis. Velit duis sit officia eiusmod Lorem
              aliqua enim laboris do dolor eiusmod. Et mollit incididunt
              nisi consectetur esse laborum eiusmod pariatur proident Lorem
              eiusmod et. Culpa deserunt nostrud ad veniam.
            </p>
            <p>
              Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
              duis sit officia eiusmod Lorem aliqua enim laboris do dolor
              eiusmod. Et mollit incididunt nisi consectetur esse laborum
              eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
              nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nullam pulvinar risus non risus hendrerit
              venenatis. Pellentesque sit amet hendrerit risus, sed
              porttitor quam. Magna exercitation reprehenderit magna aute
              tempor cupidatat consequat elit dolor adipisicing. Mollit
              dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
              officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
              mollit incididunt nisi consectetur esse laborum eiusmod
              pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
              veniam.
            </p> */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose}>
              Action
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
)



}