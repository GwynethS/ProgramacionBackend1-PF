import { Router } from "express";
import { productManager } from "../managers/product.manager.js";
import { socketServer } from "../server.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);

    const allProducts = await productManager.getAllProducts();

    const products =
      limit && !isNaN(limit) ? allProducts.slice(0, limit) : allProducts;

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    res.status(200).json(await productManager.getProductById(pid));
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "The 'title' field is required." });
    }
    if (!description) {
      return res
        .status(400)
        .json({ message: "The 'description' field is required." });
    }
    if (!code) {
      return res.status(400).json({ message: "The 'code' field is required." });
    }
    if (!price) {
      return res
        .status(400)
        .json({ message: "The 'price' field is required." });
    }
    if (!stock) {
      return res
        .status(400)
        .json({ message: "The 'stock' field is required." });
    }
    if (!category) {
      return res
        .status(400)
        .json({ message: "The 'category' field is required." });
    }

    const newProduct = await productManager.createProduct(req.body);

    const updatedProductList = await productManager.getAllProducts();
    socketServer.emit("realTimeProductList", updatedProductList);

    res.status(200).json(newProduct);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "The 'id' field cannot be updated." });
    }

    res.status(200).json(await productManager.updateProduct(req.body, pid));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await productManager.deleteProduct(pid)

    const updatedProductList = await productManager.getAllProducts();
    socketServer.emit("realTimeProductList", updatedProductList);

    res.status(200).json(deletedProduct);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
