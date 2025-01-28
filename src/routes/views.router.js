import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";
import { CartManager } from "../managers/cart.manager.js";

const router = Router();
const cartModel = new CartManager(CartModel);

router.get("/", async (req, res) => {
  const result = await ProductModel.find().lean();

  if (!result) {
    return res
      .status(404)
      .json({ message: "Can't get products", payload: result });
  }

  res.render("index", { productList: result });
});

router.get("/products", async (req, res) => {
  res.render("products");
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  const result = await ProductModel.findById(pid).lean();

  if (!result) {
    return res.status(404).json({ message: "Can't get product", payload: result });
  }

  res.render("productDetail", { product: result });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  const result = await CartModel.findById(cid)
    .populate("products.product")
    .lean();

  if (!result) {
    return res.status(404).json({ message: "Can't get cart", payload: result });
  }

  res.render("cart", { cart: result });
});

export default router;
