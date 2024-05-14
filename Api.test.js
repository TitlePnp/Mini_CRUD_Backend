const request = require('supertest');
const app = require('./mockDataRoutes_API');

describe('Get All Products', () => {
    it('should get all products from database and response with array object', async () => {
        const res = await request(app).get('/AllProducts');
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.length).toEqual(7)
    });
});

describe('Get Product by ID', () => {
    it('should get a product by id from database and response with product object ', async () => {
        const id = 5;
        const res = await request(app).get(`/GetProduct/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.product_id).toEqual(5);
        expect(res.body.product_name).toEqual('THE MONSTERS FALL IN WILD SERIES-Vinyl Plush Doll Pendant');
        expect(res.body.product_image).toEqual('src/assets/labubu_monster.jpg');
        expect(res.body.product_description).toEqual('LABUBU Monster Shell:40%PVC 30%Cotton 30%Polyester Fiber Size: 8cm*7cm*17cm');
        expect(res.body.product_price).toEqual(850);
        expect(res.body.product_quantity).toEqual(40);
        expect(res.body.product_status).toEqual('Active');
        expect(res.body.type_id).toEqual(1);
    });

    it('should return 404 Not found', async () => {
        const id = "100";
        const res = await request(app).get(`/GetProduct/${id}`);
        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual('Product not found');
    });

    it('should return 400 bad request', async () => {
        const id = "badrequest";
        const res = await request(app).get(`/GetProduct/${id}`);
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual('Invalid parameter');
    });
});

describe('Add Product', () => {
    it('should add a product into database and response 201 code', async () => {
        const product = {
            product_name: 'test',
            product_image: 'test.jpg',
            product_description: 'test',
            product_price: 100,
            product_quantity: 10,
            product_status: "Active",
            type_id: 1,
        };

        const res = await request(app).post('/AddProduct').send(product);
        expect(res.statusCode).toEqual(201);
        expect(res.body.affectedRows).toEqual(1);

        const newProduct = await request(app).get(`/GetProduct/${res.body.insertId}`);
        expect(newProduct.statusCode).toEqual(200);
        expect(newProduct.body).toMatchObject(product);
    });
});

describe('Update Product', () => {
    it('should update a product by id and verify the update', async () => {
        const id = 8;
        const product = {
            product_name: 'product8',
            product_image: 'product8.jpg',
            product_description: 'test update',
            product_price: 100,
            product_quantity: 10,
            product_status: "Inactive",
            type_id: 1,
        };

        const res = await request(app).patch(`/UpdateProduct/${id}`).send(product);
        expect(res.statusCode).toEqual(200);
        expect(res.body.affectedRows).toEqual(1);

        const updatedProduct = await request(app).get(`/GetProduct/${id}`);
        expect(updatedProduct.statusCode).toEqual(200);
        expect(updatedProduct.body).toMatchObject(product);
    });
});

describe('Delete Product', () => {
    it('should delete a product id and response code 200', async () => {
        const id = 8;
        const res = await request(app).delete(`/DelProduct/${id}`);
        expect(res.statusCode).toEqual(200);
        const res2 = await request(app).get(`/GetProduct/${id}`);
        expect(res2.statusCode).toEqual(404);
    });
});

describe('Search Management', () => {
    it('should search a product by name from database and response array', async () => {
        const name = 'Climber';
        const res = await request(app).get(`/SearchProduct/${name}`);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body[0].product_id).toEqual(3);
    });

    it('should search a product by name from database and response 3 object', async () => {
        const name = 'Figurine';
        const res = await request(app).get(`/SearchProduct/${name}`);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.length).toEqual(3);
    });
});

describe('Get All Reccomend Products', () => {
    it('should get all recommend products from database and response with product object', async () => {
        const product1 = {
            recommend_id: 31,
            recommendation: "Must Have!",
            product_id: 4,
            product_name: "LABUBU Boots Figurine",
            product_image: "src/assets/labubu_boots.jpg",
            product_description: "LABUBU Boots Material: PVC/ABS Size: Height about 21cm",
            product_price: 3190,
            product_quantity: 40,
            product_status: "Active",
            type_id: 2
        }
        const product2 = {
            recommend_id: 36,
            recommendation: "Megaa! Labubu",
            product_id: 7,
            product_name: "MEGA LABUBU TEC 1000% All About Us",
            product_image: "src/assets/labubu_mega.jpg",
            product_description: "LABUBU Mega SIZE 793mm MATERIAL PVC Launch Quantity:Limited to 10pcs",
            product_price: 26390,
            product_quantity: 10,
            product_status: "Active",
            type_id: 2
        }

        const res = await request(app).get('/AllRecProducts');
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.length).toEqual(2);
        expect(res.body[0]).toMatchObject(product1);
        expect(res.body[1]).toMatchObject(product2);
    });
});

describe('Add Reccomend Product', () => {
    it('should add a recommend product into database and response code 201', async () => {
        const product = {
            product_id: 2,
            recommendation: 'Highly recommended',
        };

        const res = await request(app).post('/AddRecProduct').send(product);
        expect(res.statusCode).toEqual(201);
        expect(res.body.affectedRows).toEqual(1);
    });

    it('should add duplicate a recommend product into database and response code 409', async () => {
        const product = {
            product_id: 2,
            recommendation: 'Highly recommended',
        };

        const res = await request(app).post('/AddRecProduct').send(product);
        expect(res.statusCode).toEqual(409);
        expect(res.text).toEqual('Product already recommended');
    });
});

describe('Delete Recommend Product ', () => {
    it('should delete a recommend product from database and response 200 code', async () => {
        const id = 2;
        const res = await request(app).delete(`/DelRecProduct/${id}`);
        expect(res.statusCode).toEqual(200);
    });
});
