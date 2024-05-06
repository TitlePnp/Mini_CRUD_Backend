const request = require('supertest');
const app = require('./app');

describe('Product Management', () => {
    it('should get all products from database and response with array object', async () => {
        const res = await request(app).get('/AllProducts');
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.length).toEqual(7)
    });

    it('should get a product by id from database and response with product_id ', async () => {
        const id = 5;
        const res = await request(app).get(`/GetProduct/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.product_id).toEqual(5);
    });

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
    });

    it('should update a product id and response affectedrows 1', async () => {
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
    });

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

describe('Recommend Product Management', () => {
    it('should get all recommend products from database and response body length 2', async () => {
        const res = await request(app).get('/AllRecProducts');
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.length).toEqual(2);
    });

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

    it('should delete a recommend product from database and response 200 code', async () => {
        const id = 2;
        const res = await request(app).delete(`/DelRecProduct/${id}`);
        expect(res.statusCode).toEqual(200);
    });
});
