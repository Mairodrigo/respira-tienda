import express from "express";
import CartManager from "../managers/CartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager ("./src/data/carts.json");

//POST "/api/carts"

//GET "/:cid" id de ese carrito

//POST "/:cid/product/:pid"



// Exporta el router
export default cartsRouter;
