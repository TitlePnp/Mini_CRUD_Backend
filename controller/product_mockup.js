const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

exports.getAllProducts = (req, res) => {
    res.status(200).send(products);
}

exports.getProductId = (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
    }
    else {
        const product = products.find((product) => product.product_id === Number(id));
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send('Product not found');
        }
    }
}

exports.addProduct = (req, res) => {
    const productDetail = req.body;
    const maxProductId = products.reduce((maxId, product) => {
        return product.product_id > maxId ? product.product_id : maxId;
    }, 0);

    const newProduct = { product_id: maxProductId + 1, ...productDetail };
    products.push(newProduct);
    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
    res.status(201).send("Product added successfully")
}

exports.updateProduct = (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
    } else {
        const updateProductDetail = req.body;
        const product = products.find((product) => product.product_id === Number(id));
        if (!product) {
            res.status(404).send('Product not found');
        } else {
            const updatedProduct = { ...product, ...updateProductDetail };
            products[products.indexOf(product)] = updatedProduct;
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
            res.status(200).send('Product updated successfully');
        }
    }
}

exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).send('Invalid parameter');
    } else {
        const product = products.find((product) => product.product_id === Number(id));
        if (!product) {
            res.status(404).send('Product not found');
        } else {
            products.splice(products.indexOf(product), 1);
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
            res.status(200).send('Product deleted successfully');
        }
    }
}