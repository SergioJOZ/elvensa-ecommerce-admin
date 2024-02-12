import Layout from "@/components/layout";
import { Order } from "@/models/Order";

import { User } from "@/models/User";
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BusquedaPage({orders}){
    return (<Layout>
        <h1 className="">Resultados de tu busqueda</h1>
        { !orders || orders.length === 0  ? 'No hay resultados para tu busqueda' : <table className="basic mt-2">
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
        </table>}
    </Layout>)
}

export async function getServerSideProps(context){
    const {params} = context

    if(params.busqueda[0] === 'user'){
        const user = await User.find({$or: [{
            name: {$regex: params.busqueda[1]}
          }]})
        

          if(user.length <= 0){
            return {props:
            {
                orders: null
            }}
        }

        const orders = await Order.find({userId: user[0]._id}).populate('userId')

        return {props:
        {
            orders: JSON.parse(JSON.stringify(orders))
        }}
    }

    if(params.busqueda[0] === 'status'){
        if(params.busqueda[1] === 'noprocesada'){
            const orders = await Order.find({status: 'No procesada'}).populate('userId')

            return {props: {
                orders: JSON.parse(JSON.stringify(orders))
            }}
        }

        if(params.busqueda[1] === 'procesada'){
            const orders = await Order.find({status: 'procesada'}).populate('userId')

            return {props: {
                orders: JSON.parse(JSON.stringify(orders))
            }}
        }
    }

    if(params.busqueda[0] === 'id'){
        const orders = await Order.find({orderId: params.busqueda[1]})

        return {props: {
            orders: JSON.parse(JSON.stringify(orders))
        }}
    }
}