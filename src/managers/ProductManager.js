import fs from "fs";

class ProductManager {
	constructor(pathFile) {
		this.pathFile = pathFile; // Ruta del archivo donde se guardan los productos
	}

	//METODO getProducts: traer todos los productos del archivo
	getProducts = async () => {
		try {
			//Leer archivo y guardar contenido
			const fileData = await fs.promises.readFile(this.pathFile, "utf8");
			const data = JSON.parse(fileData);

			return data;
		} catch (error) {
			throw new Error(
				`Error al leer el archivo de productos: ${error.message}`
			);
		}
	};

	// METODO getProductsById: Traer producto especifico por ID
	getProductById = async (id) => {
		try {
			const products = await this.getProducts(); // Obtenemos todos los productos
			const product = products.find((p) => p.id === id); // Buscamos el producto por su ID

			if (!product) {
				throw new Error(`Producto con ID ${id} no encontrado.`);
			}

			return product;
		} catch (error) {
			throw new Error(`Error al obtener el producto: ${error.message}`);
		}
	};

	//METODO addProduct: Añadir nuevo producto
	addProduct = async (newProduct) => {
		try {
			const products = await this.getProducts();

			// Generamos un nuevo ID único
			const newId =
				products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

			// Creamos el nuevo producto con ID único
			const productToAdd = { id: newId, ...newProduct };

			// Agregamos el producto a la lista
			products.push(productToAdd);

			// Guardamos los cambios en el archivo
			await fs.promises.writeFile(
				this.pathFile,
				JSON.stringify(products, null, 2)
			);

			return productToAdd;
		} catch (error) {
			throw new Error(`Error al agregar el producto: ${error.message}`);
		}
	};

	//METODO setProductByID: Modificar un producto
	updateProductById = async (id, updatedFields) => {
		try {
			const products = await this.getProducts();
			const productIndex = products.findIndex((p) => p.id === id);

			if (productIndex === -1) {
				throw new Error(`Producto con ID ${id} no encontrado.`);
			}

			// Mantenemos los datos originales y solo actualizamos los campos enviados
			products[productIndex] = { ...products[productIndex], ...updatedFields };

			// Guardamos los cambios en el archivo
			await fs.promises.writeFile(
				this.pathFile,
				JSON.stringify(products, null, 2)
			);

			return products[productIndex];
		} catch (error) {
			throw new Error(`Error al actualizar el producto: ${error.message}`);
		}
	};
	//deleteProductByID: Eliminar un producto mediante el ID
	deleteProductById = async (id) => {
		try {
			const products = await this.getProducts();
			const filteredProducts = products.filter((p) => p.id !== id);

			if (products.length === filteredProducts.length) {
				throw new Error(`Producto con ID ${id} no encontrado.`);
			}

			// Guardamos los cambios en el archivo sin el producto eliminado
			await fs.promises.writeFile(
				this.pathFile,
				JSON.stringify(filteredProducts, null, 2)
			);

			return { message: `Producto con ID ${id} eliminado.` };
		} catch (error) {
			throw new Error(`Error al eliminar el producto: ${error.message}`);
		}
	};
}

export default ProductManager;
