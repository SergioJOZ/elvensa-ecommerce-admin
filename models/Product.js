const { Schema, model, models, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
  code: {type: String, required: true},
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { type: mongoose.Types.ObjectId, ref: "Category", required:true },
  quantity: {type: Number, required: true},
  unit: {type: String, required:true}
});

export const Product = models.Product || model("Product", ProductSchema);
