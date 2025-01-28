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

  async findById(cartId) {
    try {
      const result = await this.model
        .findById(cartId)
        .populate("products.product");

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

  async updateCart(cartId, products) {
    try {
      const updatedCart = await this.model
        .findByIdAndUpdate(cartId, { products }, { new: true })
        .populate("products.product");

      if (!updatedCart) {
        throw new Error("Cart not found");
      }

      return updatedCart;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async deleteCartProducts(cartId) {
    try {
      const updatedCart = await this.model
        .findByIdAndUpdate(cartId, { $set: { products: [] } }, { new: true })
        .populate("products.product");

      if (!updatedCart) throw new Error("Cart not found");

      return updatedCart;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async addCartProduct(cartId, productId) {
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

      const updatedCart = await this.model
        .findByIdAndUpdate(cartId, cart, { new: true })
        .populate("products.product");

      return updatedCart;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async updateCartProduct(cartId, productId, quantity) {
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
          quantity,
        };

        cart["products"].push(insertProduct);
      } else {
        existingProduct.quantity = quantity;
      }

      const updatedCart = await this.model
        .findByIdAndUpdate(cartId, cart, { new: true })
        .populate("products.product");

      return updatedCart;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  async deleteCartProduct(cartId, productId) {
    try {
      const updatedCart = await this.model
        .findByIdAndUpdate(
          cartId,
          { $pull: { products: { product: productId } } },
          { new: true }
        )
        .populate("products.product");

      if (!updatedCart) throw new Error("Cart not found");

      return updatedCart;
    } catch (e) {
      return { error: true, message: e.message };
    }
  }
}
