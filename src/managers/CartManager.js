import fs from "fs";

class CartManager {
	constructor(pathFile) {
		this.pathFile = pathFile; // Ruta del archivo JSON donde se guardan los carritos
	}

	//METODO getCarts para obtener todos los carritos
	getCarts = async () => {
		try {
			const fileData = await fs.promises.readFile(this.pathFile, "utf8");
			return JSON.parse(fileData);
		} catch (error) {
			return []; // Si no hay archivo, devolvemos un array vacío
		}
	};

	// METODO addCart para añadir un nuevo carrito
	addCart = async () => {
		try {
			const carts = await this.getCarts();

			// Generamos un nuevo ID único
			const newId =
				carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) + 1 : 1;

			const newCart = {
				id: newId,
				products: [], // Un carrito nuevo siempre tiene un array vacío de productos
			};

			carts.push(newCart);

			await fs.promises.writeFile(
				this.pathFile,
				JSON.stringify(carts, null, 2)
			);

			return newCart;
		} catch (error) {
			throw new Error(`Error al agregar un carrito: ${error.message}`);
		}
	};

	//METODO getCartById para obtener un carrito por ID
	getCartById = async (cartId) => {
		try {
			const carts = await this.getCarts();
			const cart = carts.find((cart) => cart.id === cartId);

			if (!cart) {
				throw new Error(`Carrito con ID ${cartId} no encontrado.`);
			}

			return cart;
		} catch (error) {
			throw new Error(`Error al obtener el carrito: ${error.message}`);
		}
	};

	// Método para agregar un producto a un carrito específico
	addProductInCartById = async (cartId, productId, quantity = 1) => {
		try {
			const carts = await this.getCarts();
			const cartIndex = carts.findIndex((cart) => cart.id === cartId);

			if (cartIndex === -1) {
				throw new Error(`Carrito con ID ${cartId} no encontrado.`);
			}

			// Verificamos si el producto ya existe en el carrito
			const existingProduct = carts[cartIndex].products.find(
				(p) => p.productId === productId
			);

			if (existingProduct) {
				// Si ya existe, aumentamos la cantidad
				existingProduct.quantity += quantity;
			} else {
				// Si no existe, lo agregamos al array de productos
				carts[cartIndex].products.push({ productId, quantity });
			}

			// Guardamos los cambios en el archivo
			await fs.promises.writeFile(
				this.pathFile,
				JSON.stringify(carts, null, 2)
			);

			return carts[cartIndex];
		} catch (error) {
			throw new Error(`Error al agregar producto al carrito: ${error.message}`);
		}
	};
}

export default CartManager;
