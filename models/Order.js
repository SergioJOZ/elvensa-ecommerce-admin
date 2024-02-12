import mongoose, {model, Schema, models} from "mongoose";

const OrderSchema = new Schema({
  productsToOrder: {type: Array, required: true},
  userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
  status: {type: String, default: 'No procesada'},
  deliveryType: {type: String, required: true},
  paymentType: {type: String, required: true},
  receipt: [{type: String}],
  payment: [{type: String}],
  orderId: {type: Number}
}, {
  timestamps: true,
});



export const Order = models.Order || model('Order', OrderSchema);