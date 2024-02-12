const { Schema, model, models, default: mongoose } = require("mongoose");

const BsVarSchema = new Schema({
  bsVariable: {type: Number, required: true}
});

export const BsVar = models?.BsVar || model("BsVar", BsVarSchema);
