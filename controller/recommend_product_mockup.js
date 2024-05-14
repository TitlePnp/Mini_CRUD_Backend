const fs = require('fs');

const reccomendProducts = JSON.parse(fs.readFileSync('./data/recommend_products.json', 'utf-8'));
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

exports.getAllRecProducts = (req, res) => {
    res.status(200).send(reccomendProducts);
}

exports.addRecProduct = (req, res) => {
    const productDetail = req.body;
    const haveProduct = products.find((product) => product.product_id === productDetail.product_id);
    const duplicate = reccomendProducts.find((product) => product.product_id === productDetail.product_id);

    if (haveProduct && !duplicate) {
        const product = products.find((product) => product.product_id === productDetail.product_id);

        const newRecProduct = { ...product, recommend_id: reccomendProducts.length + 1, recommendation: productDetail.recommendation };
        reccomendProducts.push(newRecProduct);
        fs.writeFileSync('./data/recommend_products.json', JSON.stringify(reccomendProducts, null, 2));
        const result = { affectedRows: 1 }
        res.status(201).send(result)
    } else if (!haveProduct) {
        res.status(404).send("Not Found Product")
    } else { 
        res.status(409).send('Product already recommended')
    }
}

exports.deleteRecProduct = (req, res) => {
    const id = req.params.id;
    const product = reccomendProducts.find((product) => product.product_id === Number(id));
    if (!product) {
        res.status(404).send("Product is not in recommend list!")
    } else {
        reccomendProducts.splice(products.indexOf(product), 1);
        fs.writeFileSync('./data/recommend_products.json', JSON.stringify(reccomendProducts, null, 2));
        res.status(200).send("Delete product from recommend list!")
    }
};
