import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { User } from "@/models/User";


export default async function handler(req,res){
    await mongooseConnect();

    if(req.method === "GET"){
        if (req.query?.id) {
            res.json(await Order.findOne({ _id: req.query.id }));
          }
          else if(req.query?.status){
          
             if(req.query.status === 'procesada'){
                res.json(await Order.find({status: 'Procesada'}).populate('userId'))
             }

             if(req.query.status === 'noprocesada'){
              res.json(await Order.find({status: 'No procesada'}).populate('userId'))
             }
          }
          else if(req.query?.user){
            const user = await User.find({$or: [{
              name: {$regex: req.query.user}
            }]})
            
            if(!user){
            res.json(await Order.find({userId: user[0]._id}).populate('userId'))
            }else{
              res.json(await Order.find().populate('userId'))
            }
          }else
          if(req.query?.orderId){
            res.json(await Order.find({orderId: req.query.orderId}).populate('userId'))
          }else{
            res.json(await Order.find().populate('userId'));
          }
    }

    if(req.method === "PATCH"){
      const {receipt, status} = req.body;

      res.json(await Order.findOneAndUpdate({_id: req.query?.id}, {receipt: receipt, status: status}))
    }

}