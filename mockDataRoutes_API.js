const express = require('express');
const cors = require('cors');

const productsController = require('./controller/product_mockup')
const searchController = require('./controller/search_mockup')
const reccomendProductsController = require('./controller/recommend_product_mockup')

const app = express();
app.use(cors());
app.use(express.json());

/* Products */
app.get('/AllProducts', productsController.getAllProducts);

app.get('/GetProduct/:id', productsController.getProductId);

app.post('/AddProduct', productsController.addProduct);

app.patch('/UpdateProduct/:id', productsController.updateProduct);

app.delete('/DelProduct/:id', productsController.deleteProduct)

/* Search Products */

app.get('/SearchProduct/:name', searchController.searchProduct)

/* Recommend Products */

app.get('/AllRecProducts', reccomendProductsController.getAllRecProducts);

app.post('/AddRecProduct', reccomendProductsController.addRecProduct);

app.delete('/DelRecProduct/:id', reccomendProductsController.deleteRecProduct);

module.exports = app;