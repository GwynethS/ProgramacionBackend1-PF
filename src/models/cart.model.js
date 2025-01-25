import mongoose, { model, Schema } from "mongoose";

const cartCollection = "carts";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],
    default: []
  },
});

export const CartModel = model(cartCollection, cartSchema);
