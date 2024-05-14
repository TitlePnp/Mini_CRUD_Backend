require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const productController = require('./controller/product_db');
const searchController = require('./controller/search_db')
const recommendProductController = require('./controller/recommend_product_db')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Product Management */
app.get('/AllProducts', productController.getAllProduct);

app.get('/GetProduct/:id', productController.getProductID);

app.post('/AddProduct', productController.addProduct);

app.patch('/UpdateProduct/:id', productController.updateProduct);

app.delete('/DelProduct/:id', productController.deleteProduct);

/* Search Product Management */
app.get('/SearchProduct/:name', searchController.searchProduct);

/* Reccomend Product Management */

app.get('/AllRecProducts', recommendProductController.getAllRecommendProducts);

app.post('/AddRecProduct', recommendProductController.addRecommendProduct);

app.delete('/DelRecProduct/:id', recommendProductController.deleteRecommendProduct)


module.exports = app;