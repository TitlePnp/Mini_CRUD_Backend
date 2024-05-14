const connection = require('../config/ConnectDB');

exports.getAllProduct = (req, res) => {
    const sql = `SELECT * FROM products`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
};

exports.getProductID = (req, res) => {
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
};

// exports.addProduct = (req, res) => {
//     const productDetail = req.body;
//     const sql = `INSERT INTO products(product_name, product_image, product_description, product_price, product_quantity, product_status, type_id) VALUES(?,?,?,?,?,?,?)`;
//     connection.query(sql, [productDetail.product_name, productDetail.product_image, productDetail.product_description, productDetail.product_price, productDetail.product_quantity, productDetail.product_status, productDetail.type_id], (err, result) => {
//         if (err) throw err;
//         res.status(201).send(result);
//     }
//     );
// };

exports.addProduct = (req, res) => {
    const productDetail = req.body;
    const sql = `INSERT INTO products(product_name, product_image, product_description, product_price, product_quantity, product_status, type_id) VALUES(?,?,?,?,?,?,?)`;
    connection.query(sql, Object.values(productDetail), (err, result) => {
        if (err) throw err;
        res.status(201).send(result);
    }
    );
};

exports.updateProduct = (req, res) => {
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
}

exports.deleteProduct = (req, res) => {
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
}