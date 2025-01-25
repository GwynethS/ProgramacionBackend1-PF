/* import { Router } from "express";
import { cartManager } from "../managers/cart.manager.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    res.status(200).json(await cartManager.getCartById(cid));
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(200).json(await cartManager.createCart());
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    res.status(200).json(await cartManager.addProductToCart(cid, pid));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
 */