import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "POST") {
    const { code, title, description, price, images, category, quantity, unit} =
      req.body;

    const newProduct = await Product.create({
      code,
      title,
      description,
      price,
      images,
      category,
      quantity,
      unit
    });

    res.json(newProduct);
  }

  if (req.method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }).populate("category"));
    }else if(req.query?.busqueda){
      const products = await Product.find({
        $or: [
            {
            code: {$regex: req.query.busqueda},
            
            
            },
            {
              title: {$regex : req.query.busqueda},
            },
            {
              description: {$regex: req.query.busqueda.toUpperCase()}
            }
        ],
    })   
    res.json(products)   
    }else {
      res.json(await Product.find().populate("category"));
    }
  }


  if (req.method === "PUT") {
    const { code, title, description, price, images, category, quantity, unit, _id } =
      req.body;
    await Product.updateOne(
      { _id },
      { code, title, description, price, images, category, quantity, unit }
    );
    res.json(true);
  }

  if (req.method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
