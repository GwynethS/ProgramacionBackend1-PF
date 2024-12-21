import express from "express";
import path from "path";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";

const PORT = 8080;
const app = express();

app.use("/static", express.static(path.join(process.cwd(), "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => console.log("Server on port 8080"));
