import { Router } from "express";
import { CartManager } from "../managers/cart.manager.js";
import { CartModel } from "../models/cart.model.js";

const router = Router();
const model = new CartManager(CartModel);

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const result = await model.findById(cid);

  if (!result) {
    return res.status(404).json({ message: "Cart not found" , payload: result});
  }

  res.status(200).json({ payload: result });
});

router.post("/", async (req, res) => {
  const result = await model.add();

  if (result?.error) {
    return res
      .status(400)
      .json({ message: "Can't create cart", error: result.message });
  }

  res.status(200).json({ payload: result });
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await model.addProductToCart(cid, pid);

    if (result?.error) {
      return res
        .status(400)
        .json({ message: "Can't add product to cart", error: result.message });
    }

    res.status(200).json({ payload: result });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
