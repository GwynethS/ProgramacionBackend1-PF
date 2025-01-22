import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";

import { productManager } from "../src/managers/product.manager.js";

const PORT = 8080;
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.set("views", __dirname + "/views");

app.use("/static", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/home", async (req, res) => {
  try{
    const productList = await productManager.getAllProducts();

    res.render('home', {productList});

  }catch(e){
    res.status(500).send('An error occurred while trying to get products:' + e.message);
  }
});

app.get("/realtimeproducts", async (req, res) => {
  res.render('realTimeProducts');
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);


const httpServer = app.listen(PORT, () => {
  console.log("Server on port 8080");
});

export const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("A user connected");

  const productList = await productManager.getAllProducts();

  socket.emit("realTimeProductList", productList);

  socket.on("productCreated", (newProduct) => {
    console.log("Producto creado:", newProduct);
  });

  socket.on("productDeleted", (productId) => {
    console.log("Producto eliminado:", productId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
