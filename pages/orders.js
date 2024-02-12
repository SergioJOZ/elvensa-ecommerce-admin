import Layout from "@/components/layout";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import axios from "axios";

import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

export default function OrdersPage(){
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [busquedaUser, setBusquedaUser] = useState('');
    const [busquedaId, setBusquedaId] = useState('');
    const [busquedaStatus, setBusquedaStatus] = useState('procesada')
    const router = useRouter()
    useEffect(() => {
        axios.get("/api/userInfos").then(response => {
            setUsers(response.data)
        })
        axios.get('/api/orders').then((response) => {
            setOrders(response.data)
        })
    }, [])

    async function buscarUserFuncion(e){
        e.preventDefault();
    
        if(busquedaUser){
          router.push("/orders/busqueda/user/" + busquedaUser)
        }else{
          setError(true)
          return
        }
      }

      async function buscarIdFuncion(e){
        e.preventDefault();
    
        if(busquedaId){
          router.push("/orders/busqueda/id/" + busquedaId)
        }else{
          setError(true)
          return
        }
      }

      async function buscarStatusFuncion(e){
        e.preventDefault();
    
        if(busquedaStatus){
          router.push("/orders/busqueda/status/" + busquedaStatus)
        }else{
          setError(true)
          return
        }
      }

    return <Layout>
        <div className="flex flex-row gap-5">
        <form onSubmit={buscarUserFuncion} className=" pt-2 relative flex w-full max-w-[24rem]">
      <Input type="text" label="Busca pedidos por usuario..." value={busquedaUser} onChange={(e) => setBusquedaUser(e.target.value)} className="pr-20" containerProps={{
        className: "min-w-0"
      }}></Input>
      <Button type="submit" size="sm" color={busquedaUser ? "gray" : "blue-gray"} disabled={!busquedaUser} className="!absolute right-1 top-3 rounded">
      Busca
      </Button>
      </form>

      <form onSubmit={buscarIdFuncion} className=" pt-2 relative flex w-full max-w-[24rem]">
      <Input type="text" label="Busca pedidos por ID..." value={busquedaId} onChange={(e) => setBusquedaId(e.target.value)} className="pr-20" containerProps={{
        className: "min-w-0"
      }}></Input>
      <Button type="submit" size="sm" color={busquedaId ? "gray" : "blue-gray"} disabled={!busquedaId} className="!absolute right-1 top-3 rounded">
      Busca
      </Button>
      </form>

      <form onSubmit={buscarStatusFuncion} className=" pt-2 relative flex w-full max-w-[24rem]">
      <select label="Selecciona el tipo de status" value={busquedaStatus} onChange={(e) => setBusquedaStatus(e.target.value)}>
        <option value="procesada">Procesada</option>
        <option value="noprocesada">No Procesada</option>
      </select>
      <Button type="submit" size="sm" color={busquedaStatus ? "gray" : "blue-gray"}  className="!absolute right-1 top-2 rounded">
      Busca
      </Button>
      </form>

      </div>
        <table className="basic mt-2">
            <thead>
                <tr>
                    <td>Fecha del pedido (AÑO/MES/DIA)</td>
                    <td>ID del pedido</td>
                    <td>Nombre del cliente</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 && orders.map(order => (
                    <tr key={order._id}>
                        <td>{order.createdAt.split('T')[0]}</td>
                        <td>{order.orderId}</td>
                        <td>{order.userId.name}</td>
                        <td>{order.status}</td>
                        <td>
                            <Link className="cursor-pointer" href={`/orders/${order._id}`}>Detalles</Link> 
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Layout>
}