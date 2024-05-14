const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

exports.searchProduct = (req, res) => {
    const name = req.params.name;
    const product = products.filter((product) => product.product_name.toLowerCase().includes(name.toLowerCase()));
    if (product.length > 0) {
        res.status(200).send(product);
    } else {
        res.status(404).send('Product not found');
    }
};