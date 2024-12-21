import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { productManager } from "./product.manager.js";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getAllCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartProducts = await fs.promises.readFile(this.path, "utf-8");

        return JSON.parse(cartProducts);
      } else {
        return [];
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getAllCarts();

      const cart = carts.find((c) => c.id === id);

      if (!cart) throw new Error("Cart not found");

      return cart;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async createCart() {
    try {
      const cart = {
        id: uuidv4(),
        products: [],
      };

      const carts = await this.getAllCarts();

      carts.push(cart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts));

      return cart;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      const product = await productManager.getProductById(productId);

      const existingProduct = cart["products"].find((p) => p.id === productId);

      if (!existingProduct) {
        const insertProduct = {
          id: productId,
          quantity: 1,
        };

        cart["products"].push(insertProduct);
      } else {
        existingProduct.quantity += 1;
      }

      const carts = await this.getAllCarts();

      const updatedCarts = carts.map((c) => (c.id === cartId ? cart : c));

      await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));

      return cart;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export const cartManager = new CartManager(
  path.join(process.cwd(), "src/data/carts.json")
);
