import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
 


  //Para crear una nueva categoría
  if (req.method === "POST") {
    const { name, parent, parentName } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parent || undefined,
      parentName
    });
    res.json(categoryDoc);
  }

  //Para recibir todas las categorias existentes
  if (req.method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  //Para modificar una categoria
  if (req.method === "PUT") {
    const { name, parent, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      { name, parent: parent || undefined }
    );
    res.json(categoryDoc);
  }

  //Para borrar una categoria
  if (req.method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
