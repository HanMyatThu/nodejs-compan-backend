const express = require('express');
const app = express();
const cors = require('cors');

const whiteList = [
    'http://localhost:3000',
    'http://localhost:3443',
    'http://localhost:4000',
    'http://localhost:8080'
];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;

    if (whiteList.includes(req.header('Origin'))) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
