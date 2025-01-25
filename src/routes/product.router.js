import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { ProductManager } from "../managers/product.manager.js";
import { socketServer } from "../server.js";
import { uploader } from "../utils.js";

const router = Router();
const model = new ProductManager(ProductModel);

router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, ...filters } = req.query;

    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    console.log(filters);

    const sortOptions =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const result = await ProductModel.paginate(
      { ...filters },
      {
        limit,
        page,
        sort: sortOptions,
      }
    );

    if (!result.docs.length) {
      return res.status(404).json({ message: "No products found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const queryParams = new URLSearchParams(req.query);

    queryParams.set("limit", limit);

    const prevQueryParams = new URLSearchParams(queryParams);
    prevQueryParams.set("page", result.prevPage);
    const prevLink = result.hasPrevPage ? `${baseUrl}/?${prevQueryParams.toString()}` : null;

    const nextQueryParams = new URLSearchParams(queryParams);
    nextQueryParams.set("page", result.nextPage);
    const nextLink = result.hasNextPage ? `${baseUrl}/?${nextQueryParams.toString()}` : null;

    res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/filter", async (req, res) => {
  const result = await model.findByQuery(req.query);

  if (!result) {
    return res
      .status(404)
      .json({ message: "Can't get products", payload: result });
  }

  res.status(200).json({ payload: result });
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  const result = await model.findById(pid);

  if (!result) {
    return res
      .status(404)
      .json({ message: "Product not found", payload: result });
  }

  res.status(200).json({ payload: result });
});

router.post("/", uploader.array("thumbnails"), async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const thumbnails = req.files;

  if (!title) {
    return res.status(400).json({ message: "The 'title' field is required." });
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
    return res.status(400).json({ message: "The 'price' field is required." });
  }
  if (!stock) {
    return res.status(400).json({ message: "The 'stock' field is required." });
  }
  if (!category) {
    return res
      .status(400)
      .json({ message: "The 'category' field is required." });
  }

  const newProduct = {
    ...req.body,
    ...(thumbnails && {
      thumbnails: thumbnails.map(
        (file) => `/static/assets/img/products/${file.filename}`
      ),
    }),
  };

  const result = await model.add(newProduct);

  if (result?.error) {
    return res
      .status(400)
      .json({ message: "Can't create product", error: result.message });
  }

  res.status(201).json({ payload: result });

  const updatedProductList = await model.findByQuery();

  if (!updatedProductList) {
    return res
      .status(400)
      .json({ message: "Can't get products", payload: result });
  }

  socketServer.emit("realTimeProductList", updatedProductList);
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  if (req.body.id) {
    return res
      .status(400)
      .json({ message: "The 'id' field cannot be updated." });
  }

  const newProduct = req.body;

  const result = await model.update(newProduct, pid);

  if (result?.error) {
    return res
      .status(400)
      .json({ message: "Can't update product", error: result.message });
  }

  res.status(201).json({ payload: result });

  const updatedProductList = await model.findByQuery();

  if (!updatedProductList) {
    return res
      .status(400)
      .json({ message: "Can't get products", payload: result });
  }

  socketServer.emit("realTimeProductList", updatedProductList);
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  const result = await model.deleteById(pid);

  if (result?.error) {
    return res
      .status(500)
      .json({ message: "Can't delete product", error: result.message });
  }

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "Can't find product with the required ID",
      payload: result,
    });
  }

  res.status(200).json({ payload: result });

  const updatedProductList = await model.findByQuery();

  if (!updatedProductList) {
    return res
      .status(400)
      .json({ message: "Can't get products", payload: result });
  }

  socketServer.emit("realTimeProductList", updatedProductList);
});

export default router;
