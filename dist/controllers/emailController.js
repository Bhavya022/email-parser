"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outlookCallback = exports.outlookAuth = exports.googleCallback = exports.googleAuth = void 0;
const oauthService_1 = require("../services/oauthService");
const googleAuth = (req, res) => {
    const url = (0, oauthService_1.getGoogleAuthUrl)();
    res.redirect(url);
};
exports.googleAuth = googleAuth;
const googleCallback = async (req, res) => {
    const { code } = req.query;
    const tokens = await (0, oauthService_1.getGoogleToken)(code);
    res.json(tokens);
};
exports.googleCallback = googleCallback;
const outlookAuth = async (req, res) => {
    const url = await (0, oauthService_1.getOutlookAuthUrl)();
    res.redirect(url);
};
exports.outlookAuth = outlookAuth;
const outlookCallback = async (req, res) => {
    const { code } = req.query;
    const token = await (0, oauthService_1.getOutlookToken)(code);
    res.json(token);
};
exports.outlookCallback = outlookCallback;
