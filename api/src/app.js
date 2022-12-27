"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = require("mongoose");
const User = require('./models/User');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = (0, express_1.default)();
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoose
                .connect('mongodb://localhost:27017/testProject', { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('connected to MongoDB');
            // .then( () => {
            //   console.log('MongoDb Connected Successfuly');
            // })
            // .catch( (err: Error) => {
            //   console.log(err);
            // })
        }
        catch (error) {
            console.error(error);
        }
    });
}
connect();
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express_1.default.json());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
const PORT = process.env.PORT || 3004;
app.get('/ping', (_req, res) => {
    console.log('pinged!');
    console.log('asd');
    res.send('pong');
});
app.get('/user', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.find();
        res.send(user);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}));
app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password } = req.body;
    try {
        const newUser = yield User({
            name,
            username,
            password
        });
        yield newUser.save();
        res.send('User created successfuly');
    }
    catch (error) {
        res.send({ error });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
