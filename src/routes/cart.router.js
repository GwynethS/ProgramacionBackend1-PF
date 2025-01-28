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

router.put("/:cid", async (req, res) => {
  try {
      const { cid } = req.params;
      const { products } = req.body;

      if (!Array.isArray(products)) {
          return res.status(400).json({ status: "error", message: "Products must be an array" });
      }

      const result = await model.updateCart(cid, products);

      if (result?.error) {
          return res.status(404).json({ status: "error", message: result.message });
      }

      res.status(200).json({ status: "success", payload: result });
  } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
      const { cid } = req.params;

      const result = await model.deleteCartProducts(cid);

      if (result?.error) {
          return res.status(404).json({ status: "error", message: result.message });
      }

      res.status(200).json({ status: "success", payload: result });
  } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await model.addCartProduct(cid, pid);

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

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const {quantity} = req.body;

    if(quantity < 1) return res.status(400).json({ message: "The 'quantity' must be a positive number." });

    const result = await model.updateCartProduct(cid, pid, quantity);

    if (result?.error) {
      return res
        .status(400)
        .json({ message: "Can't update product from cart", error: result.message });
    }

    res.status(200).json({ payload: result });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await model.deleteCartProduct(cid, pid);

    if (result?.error) {
      return res
        .status(400)
        .json({ message: "Can't delete product from cart", error: result.message });
    }

    res.status(200).json({ payload: result });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});



export default router;
