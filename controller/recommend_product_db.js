const connection = require('../config/ConnectDB');

exports.getAllRecommendProducts = (req, res) => {
    const sql = `SELECT rp.recommend_id, rp.recommendation, rp.product_id, pd.product_name, pd.product_image, pd.product_description, pd.product_price, pd.product_quantity, pd.product_status, pd.type_id
    FROM recommend_product rp JOIN products pd ON rp.product_id = pd.product_id ORDER BY pd.product_id`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
}

exports.addRecommendProduct = (req, res) => {
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
}

exports.deleteRecommendProduct = (req, res) => {
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
}