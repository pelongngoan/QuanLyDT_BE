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
const jwt_1 = require("../utils/jwt");
const Account_1 = require("../database/models/Account");
// import { ROLE } from "../database/enum/enum";
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = req.headers["authorization"];
            const refreshToken = req.cookies["refreshToken"];
            const handleTokens = (token, isRefresh) => __awaiter(this, void 0, void 0, function* () {
                const decode = isRefresh ? (0, jwt_1.decode_refresh)(token) : (0, jwt_1.decode_access)(token);
                if (typeof decode === "string") {
                    throw new Error("Invalid token format");
                }
                const accountSign = {
                    id: decode.id,
                    role: decode.role,
                };
                const account = yield Account_1.Account.findOne({ where: { id: decode.id } });
                if (!account) {
                    throw new Error("Account not found");
                }
                if (isRefresh && account.token !== token) {
                    throw new Error("Invalid refresh token");
                }
                return accountSign;
            });
            if (accessToken) {
                try {
                    const accountSign = yield handleTokens(accessToken, false);
                    // req.user = accountSign; // Attach user info to the request
                    next(); // Call next() to proceed to the next middleware
                }
                catch (err) {
                    if (!refreshToken) {
                        res.status(401).json({ message: "Access denied. No token provided" });
                    }
                    // Handle refresh token logic
                    try {
                        const accountSign = yield handleTokens(refreshToken, true);
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
                        res.status(400).json({
                            message: "Invalid Token",
                            error: err.message,
                        });
                    }
                }
            }
            else {
                if (!refreshToken) {
                    res.status(401).json({ message: "Access denied. No token provided" });
                }
                try {
                    const accountSign = yield handleTokens(refreshToken, true);
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
                    res.status(400).json({
                        message: "Invalid Token",
                        error: err.message,
                    });
                }
            }
        }
        catch (err) {
            res.status(500).json({
                message: "Could not validate token",
                error: err.message,
            });
        }
    });
}
function isTeacher(req, res, next) {
    // const user = req.user;
    // if (!user || user.role !== ROLE.TEACHER) {
    //   res.status(403).json({
    //     message: "Access denied. Only lecturers can perform this action.",
    //   });
    // }
    next(); // Continue to the next middleware or route handler
}
