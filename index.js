require('dotenv').config();
// const app = require('./databaseRoutes_API');
const app = require('./mockDataRoutes_API');

var port = process.env.PORT;

app.listen(port, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
});