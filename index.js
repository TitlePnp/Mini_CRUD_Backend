require('dotenv').config();
const app = require('./app');

var port = process.env.PORT;

app.listen(port, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
});