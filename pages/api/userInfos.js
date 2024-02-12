import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handler(req,res){
    await mongooseConnect();

    if(req.method === "GET"){
        if (req.query?.userId) {
            res.json(await User.findOne({ _id: req.query.userId }));
          }else{
            res.json(await User.find())
          }
    }
}