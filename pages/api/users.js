const { mongooseConnect } = require("@/lib/mongoose");
const { User } = require("@/models/User");

export default async function handler(req,res){
    mongooseConnect();

    if(req.method === "PATCH"){
        const {encryptPass} = req.body;
        
        const updatedUser = await User.updateOne({user: req.query?.user},
            {password: encryptPass})
        
        res.json(updatedUser)
    }
}