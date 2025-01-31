import fs from "fs";

class ProductManager {
	constructor(pathFile) {
		this.pathFile = pathFile;
	}

	//getProducts: traer todos los productos del archivo
	getProducts = async () => {
		try {
			//Leer archivo y guardar contenido
			const fileData = await fs.promises.readFile(this.pathFile, "utf8");
			const data = JSON.parse(fileData);

			return data;
		} catch (error) {
			throw new Error (`Error al leer el archivo de productos: ${error.message}`)
		}
	};

	//getProductsById: Traer producto especifico por ID

	//addProduct: Añadir nuevo producto

	//serProductByID: Modificar un producto

	//deleteProductByID: Eliminar un producto mediante el ID
}

export default ProductManager;
