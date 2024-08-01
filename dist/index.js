"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const emailController_1 = require("./controllers/emailController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get('/auth/google', emailController_1.googleAuth);
app.get('/auth/google/callback', emailController_1.googleCallback);
app.get('/auth/outlook', emailController_1.outlookAuth);
app.get('/auth/outlook/callback', emailController_1.outlookCallback);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
