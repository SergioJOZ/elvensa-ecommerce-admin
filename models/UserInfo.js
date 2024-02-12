import mongoose, {model, Schema, models} from "mongoose";

const UserInfoSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "User"},
    userEmail: {type: String},
    name: {type:String},
    address: {type: String},
    CI: {type: Number},
    phone: {type: Number},
});

export const UserInfo = models.UserInfo || model('UserInfo', UserInfoSchema);