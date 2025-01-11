import { Router } from "express";
import { productManager } from "../managers/product.manager.js";

const router = Router();


router.get("/", async (req, res) => {
  try{
    const productList = await productManager.getAllProducts();

    res.render('home', {productList});

  }catch(e){
    res.status(500).send('An error occurred while trying to get products:' + e.message);
  }
});

export default router;
