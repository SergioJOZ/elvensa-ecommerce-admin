const { Schema, model, models, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
  email: {String},
  password: {String}
});

export const User = models.User || model("User", UserSchema);
