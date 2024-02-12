import Layout from "@/components/layout";
import { BsVar } from "@/models/BsVar";
import { Product } from "@/models/Product";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BusquedaPage({products, bsVarArr}){
    const [busqueda, setBusqueda] = useState()
    const [error, setError] = useState(false)
    const [bsVar, setBsVar] = useState(bsVarArr[0]);
    

    async function buscarFuncion(e){
        e.preventDefault();
    
        if(busqueda){
          router.push("/products/busqueda/" + busqueda)
        }else{
          setError(true)
          return
        }
      }
    
      function handleError(){
        setError(!error)
      }

    return (
        <Layout>
          <Link
            href="/products/new"
            className="bg-gray-300 text-blue-900 font-bold rounded-md py-1 px-2"
          >
            Añade un producto
          </Link>
          <form onSubmit={buscarFuncion} className=" pt-2 relative flex w-full max-w-[24rem]">
          <Input type="text" label="Busca productos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pr-20" containerProps={{
            className: "min-w-0"
          }}></Input>
          <Button type="submit" size="sm" color={busqueda ? "gray" : "blue-gray"} disabled={!busqueda} className="!absolute right-1 top-3 rounded">
          Busca
          </Button>
          </form>
    
          <Dialog open={error} handler={handleError}>
            <DialogHeader>Error</DialogHeader>
            <DialogBody>
               No has llenado el campo busqueda
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleError} className="mr-1"><span>Ok</span></Button>
            </DialogFooter>
          </Dialog>
    
          {products.length <= 0 && 'No se han encontrado productos'}
          <table className="basic mt-2">
            <thead>
              <tr>
                <td>Código</td>
                <td>Nombre del producto</td>
                <td>Precio (En USD)</td>
                <td>Precio (En Bs)</td>
                <td>Cantidad</td>
                <td>Categoría</td>
                <td></td>
                
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.code}</td>
                  <td>{product.title.charAt(0).toUpperCase() + product.title.slice(1)}</td>
                  <td>{product.price}$</td>
                  <td>{bsVar && product.price * bsVar.bsVariable} Bs</td>
                  <td>{product.quantity} {product.unit}</td>
                  <td>{product.category.name} ({product.category.parentName})</td>
                  <td>
                    <Link href={"/products/edit/" + product._id}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Editar
                    </Link>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </Layout>
      );
}

export async function getServerSideProps(context){
  const {params} = context;
  const busquedaParam = params.busqueda.toLowerCase()
  const products = await Product.find({
    $or: [
        {
        code: {$regex: busquedaParam},
        
        
        },
        {
          title: {$regex : busquedaParam},
        },
        {
          description: {$regex: busquedaParam.toUpperCase()}
        }
    ],
}).populate('category')   

  const bsVar = await BsVar.find()



  return {props:{
    bsVarArr: JSON.parse(JSON.stringify(bsVar)),
    products: JSON.parse(JSON.stringify(products))
  }}
}