import Layout from "@/components/layout";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/models/Product";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage({productArr}) {
  const productInfo =productArr[0]
  return (
    <Layout>
      <h1>Editar producto</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}

export async function getServerSideProps(context){
  const {params} = context;
  console.log(params);

  const product = await Product.find({_id: params.id[0]}).populate('category')

  return {props:
    {productArr: JSON.parse(JSON.stringify(product))}
  }
}