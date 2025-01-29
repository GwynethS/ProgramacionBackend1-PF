import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { type } from "node:os";

const productCollection = "products";

const productSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
    unique: true,
  },
  price: {
    type: Number,
    require: true,
    min: 0,
  },
  stock: {
    type: Number,
    require: true,
    min: 0,
  },
  category: {
    type: String,
    require: true,
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  thumbnails: [String],
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema);
