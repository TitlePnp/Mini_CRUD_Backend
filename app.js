require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

/* Product Management */

app.get('/AllProducts', (req, res) => {
    const sql = `SELECT * FROM products`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
})

app.get('/GetProduct/:id', (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
        return;
    }
    const sql = `SELECT * FROM products WHERE product_id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Product not found');
        } else {
            res.send(result[0]);
        }
    });
});

app.post('/AddProduct', (req, res) => {
    const productDetail = req.body;
    const sql = `INSERT INTO products(product_name, product_image, product_description, product_price, product_quantity, product_status, type_id) VALUES(?,?,?,?,?,?,?)`;
    connection.query(sql, [productDetail.product_name, productDetail.product_image, productDetail.product_description, productDetail.product_price, productDetail.product_quantity, productDetail.product_status, productDetail.type_id], (err, result) => {
        if (err) throw err;
        res.status(201).send(result);
    }
    );
})

app.patch('/UpdateProduct/:id', (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
        return;
    }
    const productDetail = req.body;
    const sql = `UPDATE products SET product_name = ?, product_image = ?, product_description = ?, product_price = ?, product_quantity = ?, product_status = ?, type_id = ? WHERE product_id = ?`;
    connection.query(sql, [productDetail.product_name, productDetail.product_image, productDetail.product_description, productDetail.product_price, productDetail.product_quantity, productDetail.product_status, productDetail.type_id, id], (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
})

app.delete('/DelProduct/:id', (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
        return;
    }
    const sql = `DELETE FROM products WHERE product_id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    }
    );
});

/* Search Product Management */

app.get('/SearchProduct/:name', (req, res) => {
    const name = req.params.name;
    const sql = `SELECT * FROM products WHERE product_name LIKE '%${name}%'`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
})

/* Reccomend Product Management */

app.get('/AllRecProducts', (req, res) => {
    const sql = `SELECT rp.recommend_id, rp.recommendation, rp.product_id, pd.product_name, pd.product_image, pd.product_description, pd.product_price, pd.product_quantity, pd.product_status, pd.type_id
    FROM recommend_product rp JOIN products pd ON rp.product_id = pd.product_id ORDER BY pd.product_id`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
})

app.post('/AddRecProduct', (req, res) => {
    const productDetail = req.body;
    const checkProductOnRec = `SELECT * FROM recommend_product WHERE product_id = ?`;
    connection.query(checkProductOnRec, [productDetail.product_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(409).send('Product already recommended');
        } else {
            const sql = `INSERT INTO recommend_product(product_id, recommendation) VALUES(?, ?)`;
            connection.query(sql, [productDetail.product_id, productDetail.recommendation], (err, result) => {
                if (err) throw err;
                res.status(201).send(result);
            });
        }
    });
});

app.delete('/DelRecProduct/:id', (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
        return;
    }
    const sql = `DELETE FROM recommend_product WHERE product_id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    }
    );
})


module.exports = app;