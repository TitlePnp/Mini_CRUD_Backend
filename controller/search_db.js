const connection = require('../config/ConnectDB');

exports.searchProduct = (req, res) => {
    const name = req.params.name;
    const sql = `SELECT * FROM products WHERE product_name LIKE '%${name}%'`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    }
    );
}