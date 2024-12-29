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
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.getVerifyCode = getVerifyCode;
exports.checkVerifyCode = checkVerifyCode;
exports.changeInfoAfterSignup = changeInfoAfterSignup;
const Account_1 = require("../database/models/Account");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const validator_1 = __importDefault(require("validator"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jwt_1 = require("../utils/jwt");
const enum_1 = require("../database/enum/enum");
const Teacher_1 = require("../database/models/Teacher");
const Student_1 = require("../database/models/Student");
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            res
                .status(400)
                .json({ message: "Email, password, and role are required." });
            return;
        }
        try {
            if (!validator_1.default.isEmail(email) || !email.endsWith("@sis.hust.edu.vn")) {
                res.status(400).json({ message: "Invalid email. Must be a HUST email." });
                return;
            }
            if (!Object.values(enum_1.ROLE).includes(role)) {
                res.status(400).json({
                    message: `Invalid role. Allowed roles are: ${Object.values(enum_1.ROLE).join(", ")}`,
                });
                return;
            }
            if (password.length < 8) {
                res
                    .status(400)
                    .json({ message: "Password must be at least 8 characters long." });
                return;
            }
            // Check if user already exists
            const existingUser = yield Account_1.Account.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ message: "User with this email already exists." });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newAccount = yield Account_1.Account.create({
                id: (0, uuid_1.v4)(),
                email,
                password: hashedPassword,
                role,
                state: enum_1.STATE.LOCKED,
            });
            if (role === enum_1.ROLE.TEACHER) {
                yield Teacher_1.Teacher.create({
                    id: (0, uuid_1.v4)(),
                    accountId: newAccount.id,
                });
            }
            else if (role === enum_1.ROLE.STUDENT) {
                yield Student_1.Student.create({
                    id: (0, uuid_1.v4)(),
                    accountId: newAccount.id,
                });
            }
            res.status(201).json({
                message: "User registered successfully!",
                user: {
                    id: newAccount.id,
                    email: newAccount.email,
                    role: newAccount.role,
                    state: newAccount.state,
                },
            });
        }
        catch (error) {
            console.error("Error in signup:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email, password are required." });
            return;
        }
        try {
            if (!validator_1.default.isEmail(email)) {
                res.status(400).json({ message: "Invalid email format." });
                return;
            }
            const account = yield Account_1.Account.findOne({ where: { email } });
            if (!account) {
                res.status(401).json({ message: "Invalid email or password." });
                return;
            }
            const isMatch = yield bcryptjs_1.default.compare(password, account.password);
            if (!isMatch) {
                res.status(401).json({ message: "Invalid email or password." });
                return;
            }
            const secretKey = process.env.SECRET_KEY;
            if (!secretKey) {
                console.error("Missing SECRET_KEY in environment");
                res.status(500).json({ message: "Internal server error." });
                return;
            }
            const accountInfo = {
                id: account.id,
                role: account.role,
            };
            const accessToken = (0, jwt_1.sign_access)(accountInfo);
            const refreshToken = (0, jwt_1.sign_refresh)(accountInfo);
            account.set({
                token: refreshToken,
            });
            let classList = [];
            if (account.role === enum_1.ROLE.STUDENT) {
                classList = yield getStudentClassList(account.id);
            }
            else if (account.role === enum_1.ROLE.TEACHER) {
                classList = yield getLecturerClassList(account.id);
            }
            res
                .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
            })
                .header("authorization", accessToken)
                .send({
                message: "Login successfully!",
                account: account,
            });
            // res.status(200).json({
            //   message: "Login successful!",
            //   id: account.id,
            //   avatar: account.avatar,
            //   active: account.state === STATE.ACTIVE,
            //   role: account.role,
            //   class_list: classList,
            // });
        }
        catch (error) {
            console.error("Login error: ", error);
            res.status(500).json({ message: "Server error." });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ message: "Token is required." });
            return;
        }
        try {
            res.status(200).json({ message: "Logout successful!" });
        }
        catch (error) {
            console.error("Logout error: ", error);
            res.status(500).json({ message: "Server error" });
        }
    });
}
function getVerifyCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email ||
            !validator_1.default.isEmail(email) ||
            !email.endsWith("@sis.hust.edu.vn")) {
            res.status(400).json({ message: "Invalid email. Must be a HUST email." });
            return;
        }
        try {
            const verificationCode = crypto_1.default.randomBytes(3).toString("hex");
            yield Account_1.Account.update({ verificationCode }, { where: { email } });
            yield sendVerificationCode(email, verificationCode);
            res.status(200).json({ message: "Verification code sent successfully!" });
        }
        catch (error) {
            console.error("Error generating verification code: ", error);
            res.status(500).json({ message: "Server error." });
        }
    });
}
function checkVerifyCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, verificationCode } = req.body;
        if (!email || !verificationCode) {
            res
                .status(400)
                .json({ message: "Email and verification code are required." });
            return;
        }
        try {
            const user = yield Account_1.Account.findOne({ where: { email, verificationCode } });
            if (!user) {
                res.status(401).json({ message: "Invalid email or verification code." });
                return;
            }
            if (user.state === enum_1.STATE.LOCKED) {
                yield Account_1.Account.update({ state: enum_1.STATE.ACTIVE }, { where: { email } });
            }
            res.status(200).json({
                message: "Verification successful!",
                id: user.id,
            });
        }
        catch (error) {
            console.error("Verification error: ", error);
            res.status(500).json({ message: "Server error." });
        }
    });
}
function changeInfoAfterSignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, firstName, lastName, avatar } = req.body;
        if (!token || !firstName || !lastName || !avatar) {
            res
                .status(400)
                .json({ message: "Token, username, and avatar are required." });
            return;
        }
        try {
            const decoded = (0, jwt_1.decode_refresh)(token);
            const userId = decoded.id;
            const user = yield Account_1.Account.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            user.avatar = avatar;
            user.firstName = firstName;
            user.lastName = lastName;
            user.token = token;
            yield user.save();
            res.status(200).json({
                message: "Information updated successfully!",
                id: user.id,
                email: user.email,
                avatar: user.avatar,
            });
        }
        catch (error) {
            if (error.name === "JsonWebTokenError") {
                res.status(401).json({ message: "Invalid token." });
                return;
            }
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ message: "Token expired." });
                return;
            }
            console.error("Error updating user information: ", error);
            res.status(500).json({ message: "Server error." });
            return;
        }
    });
}
const getStudentClassList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return [
        { classId: 1, className: "Math 101" },
        { classId: 2, className: "Science 101" },
    ];
});
const getLecturerClassList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Replace with actual database call
    return [{ classId: 3, className: "Physics 201" }];
});
const sendVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
    };
    yield transporter.sendMail(mailOptions);
});
