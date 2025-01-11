import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getAllProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");

        return JSON.parse(products).filter((p) => p.status);
      } else {
        return [];
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getAllProducts();

      const product = products.find((p) => p.id === id);

      if (!product) throw new Error("Product not found");

      return product;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async isProductCodeExists(code) {
    try {
      const products = await this.getAllProducts();

      const product = products.find((p) => p.code === code);

      if (!product) return false;

      return true;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async createProduct(data) {
    try {
      const product = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        status: data.status ?? true,
        stock: data.stock,
        category: data.category,
        thumbnails: data.thumbnails || [],
      };

      const existsCode = await this.isProductCodeExists(product.code);

      if (existsCode) throw new Error(`The product code already exists`);

      const products = await this.getAllProducts();

      products.push(product);

      await fs.promises.writeFile(this.path, JSON.stringify(products));

      return product;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateProduct(data, id) {
    try {
      const products = await this.getAllProducts();

      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex === -1) throw new Error(`Product not found`);

      if (!products[productIndex].status)
        throw new Error("The product is deleted");

      if (data.code && data.code != products[productIndex].code) {
        const existsCode = await this.isProductCodeExists(data.code);

        if (existsCode) throw new Error(`The product code already exists`);
      }

      products[productIndex] = { ...products[productIndex], ...data };

      await fs.promises.writeFile(this.path, JSON.stringify(products));

      return products[productIndex];
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getAllProducts();

      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex === -1) throw new Error(`Product not found`);

      products[productIndex] = { ...products[productIndex], status: false };

      await fs.promises.writeFile(this.path, JSON.stringify(products));

      return products[productIndex];
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export const productManager = new ProductManager(
  path.join(process.cwd(), "src/data/products.json")
);
