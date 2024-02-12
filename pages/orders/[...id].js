import Spinner from "@/components/Spinner";
import Layout from "@/components/layout";
import { BsVar } from "@/models/BsVar";
import { Order } from "@/models/Order";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import { PickerOverlay } from "filestack-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function OrderDetailPage({orderArr, bsVarArr}){
    const router = useRouter()
    const orderInfo = orderArr[0]
    const [userInfo, setUserInfo] = useState();
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [userImage, setUserImage] = useState(orderArr.payment || [])
    const [showPicker, setShowPicker] = useState(false)
    const [isUploading, setIsUploading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const [showUserImages, setShowUserImages] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const bsVar = bsVarArr[0]

    

    function getUserData(){
        axios.get("/api/userInfos?userId=" + orderInfo.userId).then(response => {
            setUserInfo(response.data)
        })
    }

    function getProducts(){
        axios.get("/api/categories")
        orderInfo.productsToOrder.forEach(product => {
            axios.get("/api/products?id="+ product.productId).then(response => {
                setProducts([...products, response.data])
            })
        })
    }

    function updateImagesOrder(images) {
        setImages(images);
      }

      function updateUserImagesOrder(userImages) {
        setUserImage(userImages);
      }

    function handleOpen(){
        setOpen(!open)
    }

    function handleOpenError(){
        setOpenError(!openError)
    }

    function handleOpenSuccess(){
        setOpenSuccess(!openSuccess)
    }

    function confirmOrder(){
        if(!images.length){
            handleOpenError()
            return; 
        }

        const status = "Procesada"
        const receipt = images
        console.log(receipt)
        const data = {
            receipt,
            status
        }

        axios.patch("/api/orders?id=" + orderInfo._id, data)

        handleOpen()
        handleOpenSuccess()
    }

    function reloadPage(){
        handleOpenSuccess();
        router.reload();
    }

    function showReceipt(){
        setShowImages(true)
        if(orderInfo.receipt.length > 0){
            setImages(orderInfo.receipt)
        }
    }

    function showUserImagesFunction(){
        setShowUserImages(true)
    }


    function deleteImage(link){
        setImages(prevImages => prevImages.filter((image) => image !== link ))
    }

    return <Layout>
        {showPicker && (<PickerOverlay apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY}
      pickerOptions={{
        accept: ["image/*"],
        maxFiles: 1,
        fromSources: ["local_file_system"],
        onClose:()=> setShowPicker(false),
        onUploadDone: (res) => {
          setImages([res.filesUploaded[0].url, ...images])
        }
      }}
      />)}

      

        <table className="basic mt-2">
            <thead>
                <tr>
                    <td>Fecha del pedido (AÑO/MES/DIA)</td>
                    <td>Forma de entrega</td>
                    <td>Forma de pago</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                    {orderInfo && 
                    <tr >
                        <td>{orderInfo.createdAt.split('T')[0]}</td>
                        <td>{orderInfo.deliveryType} </td>
                        <td>{orderInfo.paymentType}</td>
                        <td>{orderInfo.status}</td>
                    </tr>
                }
            </tbody>
        </table>

        {/*Modal de procesar */}
        <Dialog open={open} handler={handleOpen}>
                <DialogHeader>¿Quieres procesar este pedido?</DialogHeader>
                <DialogBody>
                    Ten en cuenta que debes subir una imagen de recibo y se marcará la orden como completada.
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1"><span>Cancelar</span></Button>
                    
                    <Button variant="gradient" color="green" className="disabled" onClick={() => {
                        confirmOrder()
                    }}><span>Confirmar</span></Button>
                    
                </DialogFooter>
        </Dialog>

        {/*Modal de error */}
        <Dialog open={openError} handler={handleOpenError}>
        <DialogHeader>Error</DialogHeader>
        <DialogBody>
            No has subido un recibo.
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpenError} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>

        {/*Modal de exito al procesar */}
        <Dialog open={openSuccess} handler={handleOpenSuccess}>
        <DialogHeader>Éxito.</DialogHeader>
        <DialogBody>
            Has procesado este pedido.
        </DialogBody>
        <DialogFooter>
            <Button variant="gradient" color="green" onClick={reloadPage} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>

        {/*Botones de opciones */}
        <div className="pt-5">      
            <button onClick={getUserData} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Ver datos del cliente</button>
            <button onClick={getProducts} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Ver productos</button>
            <button onClick={handleOpen} className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Procesar</button>
            <button onClick={showReceipt} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Subir o ver recibo de pago</button>       
            <button onClick={showUserImagesFunction} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Ver recibo de pago subido por el cliente</button>
        
        {/*Imagenes */}
        {showUserImages && 
        <div className="flex flex-row pt-3 pb-20">
            <div className="mb-2 flex flex-wrap gap-1">
            <ReactSortable
           list={userImage}
           className="flex flex-wrap gap-1"
           setList={updateUserImagesOrder}
         >
           {!!userImage?.length &&
             userImage.map((link) => (
               <div key={link} className=" h-24">
                <span className="font-bold">Recibo subido por el cliente:</span>
                 <img src={link} alt="" className="rounded-lg"/>
               </div>
             ))}
         </ReactSortable>
            </div>
            </div>
        }
        {showImages && 
             <div className="flex flex-row pt-3">
             <div className="mb-2 flex flex-wrap gap-1">
                <span className="font-bold">Subir recibo de pago:</span>
         <ReactSortable
           list={images}
           className="flex flex-wrap gap-1"
           setList={updateImagesOrder}
         >
           {!!images?.length &&
             images.map((link) => (
               <div key={link} className=" h-24">
                 <Button color="red" className="fixed" size="sm" onClick={() => deleteImage(link)}>X</Button>
                 <img src={link} alt="" className="rounded-lg"/>
               </div>
             ))}
         </ReactSortable>
         {isUploading && (
           <div className="h-24 p-1 flex items-center rounded-lg">
             <Spinner />
           </div>
         )}
             </div>
             <button onClick={(e)=> {
           e.preventDefault()
           setShowPicker(true)}}
           className="w-24 h-24 cursor-pointer text-center text-gray-600 flex flex-col items-center justify-center text-sm rounded-md bg-gray-200"
           >
             <svg
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             strokeWidth="1.5"
             stroke="currentColor"
             className="w-6 h-6"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
             />
           </svg>
             Subir recibo de pago</button>
         </div> 
    }
    
        </div>

        {/*Tabla de información del cliente */}
        {userInfo && 
        <table className="basic mt-2">
            <thead>
                <tr>
                    <td>Documento de identidad</td>
                    <td>Dirección</td>
                    <td>Nombre</td>
                    <td>Número de contacto</td>
                    <td>Correo electronico</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{userInfo.CI}</td>
                    <td>{userInfo.address}</td>
                    <td>{userInfo.name}</td>
                    <td>{userInfo.phone}</td>
                    <td>{userInfo.email}</td>
                </tr>
            </tbody>
        </table>
        
        }
            
        {/*Tabla de información del producto */}
        {products.length > 0 &&

        <table className="basic mt-2">
        <thead>
            <tr>
                <td></td>
                <td>Nombre del producto</td>
                <td>Descripción</td>
                <td>Cantidad</td>
                <td>Precio p/unidad(en USD)</td>
                <td>Precio p/unidad (en Bs)</td>
                <td>Precio total p/producto (en USD)</td>
                <td>Precio total p/producto (en Bs)</td>
                <td>Monto total de la orden (en USD y Bs)</td>
            </tr>
        </thead>
        <tbody>
                {products.map(product => (
                    <tr key={product._id}>
                        <td><Image src={product.images[0]} height={100} width={100} alt=""/></td>
                        <td>{product.title.charAt(0).toUpperCase() + product.title.slice(1)}</td>
                        <td>{product.description.charAt(0).toUpperCase() + product.description.slice(1)}</td>
                        <td>{orderInfo.productsToOrder.find((p) => p.productId === product._id).quantity}</td>
                        <td>{product.price}$</td>
                        <td>{product.price * bsVar.bsVariable}</td>
                        <td>{orderInfo.productsToOrder.find((p) => p.productId === product._id).quantity * product.price}</td>
                        <td>{(orderInfo.productsToOrder.find((p) => p.productId === product._id).quantity * product.price) * bsVar.bsVariable}</td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{orderInfo.total}$</td>
                </tr>
                <tr>
                <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{orderInfo.total * bsVar.bsVariable}Bs</td>
                </tr>
        </tbody>
    </table>
        }
    

        
    </Layout>
}

export async function getServerSideProps(context){
    const {params} = context

    const bsVar = await BsVar.find();
    const order = await Order.find({_id: params.id[0]})

    

    return {props:{
        orderArr: JSON.parse(JSON.stringify(order)),
        bsVarArr: JSON.parse(JSON.stringify(bsVar))
    }
}
}