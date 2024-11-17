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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.isTeacher = isTeacher;
const jwt_1 = require("../utils/jwt"); // Only keep necessary imports
const Account_1 = require("../database/models/Account");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const accessToken = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const refreshToken = req.cookies["refreshToken"];
            console.log("accessToken: " + accessToken);
            console.log("refreshToken: " + refreshToken);
            if (accessToken) {
                try {
                    const decode = (0, jwt_1.decode_access)(accessToken);
                    res.locals.id = decode.id;
                    res.locals.role = decode.role;
                    req.user = { id: decode.id, role: decode.role };
                    next();
                }
                catch (err) {
                    console.error("Error decoding access token: ", err);
                    if (!refreshToken) {
                        res.status(401).json({ message: "Access denied. No token provided" });
                        return;
                    }
                    try {
                        console.log("Attempting to decode refresh token...");
                        const decode = (0, jwt_1.decode_refresh)(refreshToken);
                        console.log(decode);
                        const accountSign = { id: decode.id, role: decode.role };
                        const account = yield Account_1.Account.findOne({
                            where: { id: decode.id },
                        });
                        if (!account) {
                            res.status(401).json({ message: "Invalid refresh token" });
                            return;
                        }
                        if (account.token !== refreshToken) {
                            res.status(401).json({ message: "Invalid refresh token" });
                            return;
                        }
                        const newAccessToken = (0, jwt_1.sign_access)(accountSign);
                        res
                            .cookie("refreshToken", refreshToken, {
                            httpOnly: true,
                            sameSite: "strict",
                        })
                            .header("authorization", newAccessToken)
                            .send({ message: "Refresh token successfully" });
                    }
                    catch (err) {
                        res
                            .status(400)
                            .json({ message: "Invalid Token", error: err.message });
                    }
                }
            }
            else {
                if (!refreshToken) {
                    res.status(401).json({ message: "Access denied. No token provided" });
                    return;
                }
                try {
                    const decode = (0, jwt_1.decode_refresh)(refreshToken);
                    const accountSign = { id: decode.id, role: decode.role };
                    const newAccessToken = (0, jwt_1.sign_access)(accountSign);
                    res
                        .cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                    })
                        .header("authorization", newAccessToken)
                        .send({ message: "Refresh token successfully" });
                }
                catch (err) {
                    res.status(400).json({ message: "Invalid Token", error: err.message });
                }
            }
        }
        catch (err) {
            const statusCode = res.statusCode === 200 ? 404 : res.statusCode;
            res
                .status(statusCode)
                .json({ message: "Could not validate token", error: err.message });
        }
    });
}
function isTeacher(req, res, next) {
    const user = req.user;
    if (!user || user.role !== "TEACHER") {
        res.status(403).json({
            message: "Access denied. Only lecturers can perform this action.",
        });
        return;
    }
    next();
}
