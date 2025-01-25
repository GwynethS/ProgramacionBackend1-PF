import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  description:  {
    type: String,
    require: true
  },
  code: {
    type: String,
    require: true,
    unique: true,
  },
  price:  {
    type: Number,
    require: true,
    min: 0
  },
  stock:  {
    type: Number,
    require: true,
    min: 0
  },
  category:  {
    type: String,
    require: true
  },
  thumbnails: [String],
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema);
