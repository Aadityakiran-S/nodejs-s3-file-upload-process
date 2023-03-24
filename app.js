const express = require('express');
const app = express();
const router = require('./routes/router.js');
require('dotenv').config();

//using inbuilt middlewares
app.use(express.json());

//setting up direction to router
app.use('/api/v1/process-file', router);

const port = process.env.PORT || 3000;
const start = (portToListen) => {
    try {
        app.listen(port, () => {
            console.log(`server is listening on port ${portToListen}......`);
        })
    } catch (error) {
        console.log(error);
    }
};

start(port);

module.exports = app;