export default function setupSocket(io, productManager) {
	io.on("connection", (socket) => {
		console.log("Cliente conectado");

		socket.on("newProduct", async (productData) => {
			try {
				await productManager.addProduct(productData);
				const products = await productManager.getProducts();
				io.emit("updateProducts", products);
			} catch (error) {
				console.error("Error al añadir el producto:", error.message);
			}
		});

		socket.on("deleteProduct", async (id) => {
			try {
				await productManager.deleteProductById(id);
				const products = await productManager.getProducts();
				io.emit("updateProducts", products);
			} catch (error) {
				console.error("Error al eliminar el producto:", error.message);
			}
		});

		socket.on("disconnect", () => {
			console.log("Cliente desconectado");
		});
	});
}
