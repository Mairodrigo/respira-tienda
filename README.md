# Respira

## E-Commerce **Respira**

##  Descripción
Respira es un proyecto ficticio desarrollado para el curso **Backend I** de [Coderhouse](https://www.coderhouse.com/ar/).

Se trata de una tienda de productos energéticos como sahumerios, velas, fragancias, piedras y cristales. La aplicación proporciona una API RESTful que permite gestionar productos y carritos de compra, permitiendo la creación, actualización, consulta y eliminación de datos.

## Tech Stack
**Lenguaje de Programación:**  
- JavaScript (ES6+)

**Frameworks y Librerías:**  
- [Node.js](https://nodejs.org/) - Entorno de ejecución
- [Express.js](https://expressjs.com/) - Framework para backend

**Bases de Datos:**  
- (Actualmente usa JSON como almacenamiento, futura integración con MongoDB)

**Herramientas y Servicios:**  
- [Postman](https://www.postman.com/) - Para probar la API
- [nodemon](https://www.npmjs.com/package/nodemon) - Recarga automática en desarrollo

##  Instalación
### **Requisitos previos**
- Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior)
- Tener instalado [npm](https://www.npmjs.com/)

### **Pasos para ejecutar el proyecto**
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/respira.git
   cd respira
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor:
   ```bash
   node app.js
   ```
   (O, si estás en desarrollo, usa nodemon para recarga automática)
   ```bash
   npm run dev
   ```

4. Probar en **Postman** o en el navegador:
   - `GET http://localhost:8080/api/products` → Obtener todos los productos
   - `POST http://localhost:8080/api/products` → Agregar un nuevo producto
   - `GET http://localhost:8080/api/carts` → Obtener todos los carritos
   - `POST http://localhost:8080/api/carts` → Crear un nuevo carrito

##  Licencia
Este proyecto es de **código abierto** y se distribuye bajo una licencia completamente **abierta y libre**.
