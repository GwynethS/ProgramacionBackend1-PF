import { ProductModel } from "../models/product.model.js";
export class CartManager {
  constructor(model) {
    this.model = model;
  }

  async findByQuery(query = {}) {
    try {
      const result = await this.model.find(query);

      return result;
    } catch (e) {
      return null;
    }
  }

  async findById(id) {
    try {
      const result = await this.model.findById(id).populate("products.product");

      return result;
    } catch (e) {
      return null;
    }
  }

  async add() {
    try {
      const result = await this.model.create({ products: [] });

      return result;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId);
      const product = await ProductModel.findById(productId);

      if (!cart) throw new Error("Cart not found");

      if (!product) throw new Error("Product not found");

      const existingProduct = cart["products"].find(
        (p) => p["product"].toString() === productId
      );

      if (!existingProduct) {
        const insertProduct = {
          product: productId,
          quantity: 1,
        };

        cart["products"].push(insertProduct);
      } else {
        existingProduct.quantity += 1;
      }

      const cartUpdated = await this.model
        .findByIdAndUpdate(cartId, cart, { new: true })
        .populate("products.product");

      return cartUpdated;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }
}
