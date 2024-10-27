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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.get_verify_code = get_verify_code;
exports.check_verify_code = check_verify_code;
exports.changeInfoAfterSignup = changeInfoAfterSignup;
exports.auth = auth;
const Account_1 = require("../database/models/Account");
// import { ROLE, STATE } from "../database/enum/enum";
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const validator_1 = __importDefault(require("validator"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Teacher_1 = require("../database/models/Teacher");
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, role } = req.body;
            if (!email || !password || !role) {
                res.status(400).json({ message: "All fields are required." });
            }
            if (!validator_1.default.isEmail(email)) {
                res.status(400).json({ message: "Invalid email format." });
            }
            const existingUser = yield Account_1.Account.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ message: "User already exists." });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newAccount = yield Account_1.Account.create({
                email,
                password: hashedPassword,
                role,
                state: Account_1.STATE.LOCKED,
                id: (0, uuid_1.v4)(),
            });
            console.log(role === Account_1.ROLE.TEACHER);
            // Check if the role is Teacher, then create a corresponding Teacher record
            if (role === Account_1.ROLE.TEACHER) {
                console.log("first");
                Teacher_1.Teacher.create({
                    accountId: newAccount.id,
                    classList: [], // Initial empty array
                    assignmentsCreated: [], // Initial empty array
                });
            }
            res.status(201).json({
                message: "User registered successfully!",
                user: newAccount,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email, password are required." });
            }
            if (!validator_1.default.isEmail(email)) {
                res.status(400).json({ message: "Invalid email format." });
            }
            const account = yield Account_1.Account.findOne({ where: { email } });
            if (!account) {
                res.status(401).json({ message: "Invalid email or password." });
                throw new Error("Error");
            }
            const isMatch = yield bcryptjs_1.default.compare(password, account.password);
            if (!isMatch) {
                res.status(401).json({ message: "Invalid email or password." });
            }
            const token = jsonwebtoken_1.default.sign({ id: account.id, role: account.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
            let classList = [];
            if (account.role === Account_1.ROLE.STUDENT) {
                classList = yield getStudentClassList(account.id);
            }
            else if (account.role === Account_1.ROLE.TEACHER) {
                classList = yield getLecturerClassList(account.id);
            }
            res.status(200).json({
                message: "Login successful!",
                id: account.id,
                // accountname: account.username,
                token,
                avatar: account.avatar,
                active: account.state === Account_1.STATE.ACTIVE,
                role: account.role,
                class_list: classList,
            });
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
function get_verify_code(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email ||
            !validator_1.default.isEmail(email) ||
            !email.endsWith("@sis.hust.edu.vn")) {
            res.status(400).json({ message: "Invalid email. Must be a HUST email." });
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
function check_verify_code(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, verificationCode } = req.body;
        // Validate the email and verification code
        if (!email || !verificationCode) {
            res
                .status(400)
                .json({ message: "Email and verification code are required." });
        }
        try {
            // Look up the user by email and verify the code
            const user = yield Account_1.Account.findOne({ where: { email, verificationCode } });
            // If user or verification code doesn't match, return an error
            if (!user) {
                res.status(401).json({ message: "Invalid email or verification code." });
                throw new Error("Error");
            }
            // Update user status to active, if applicable, and return user details
            if (user.state === Account_1.STATE.LOCKED) {
                console.log("first");
                yield Account_1.Account.update({ state: Account_1.STATE.ACTIVE }, { where: { email } });
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
        const { token, username, avatar } = req.body;
        try {
            // Validate inputs
            if (!token || !username || !avatar) {
                return res
                    .status(400)
                    .json({ message: "Token, username, and avatar are required." });
            }
            // Verify and decode the token to get the user ID
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const userId = decoded.id;
            // Find the user by ID
            const user = yield Account_1.Account.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            // Update user info
            // user.username = username;
            user.avatar = avatar;
            yield user.save();
            // Respond with the updated user information
            return res.status(200).json({
                message: "Information updated successfully!",
                id: user.id,
                // username: user.username,
                email: user.email,
                // created: user.createdAt,
                avatar: user.avatar,
            });
        }
        catch (error) {
            if (error === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token." });
            }
            console.error("Error updating user information: ", error);
            return res.status(500).json({ message: "Server error." });
        }
    });
}
const getStudentClassList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Replace this with your actual implementation
    return [
        { classId: 1, className: "Math 101" },
        { classId: 2, className: "Science 101" },
    ];
});
const getLecturerClassList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Replace this with your actual implementation
    return [{ classId: 3, className: "Physics 201" }];
});
const sendVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "long.tl446@gmail.com",
            pass: "sdaf gqnf odps aqab",
        },
    });
    const mailOptions = {
        from: "long.tl446@gmail.com",
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
    };
    yield transporter.sendMail(mailOptions);
});
function auth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = res.locals.id;
            const role = res.locals.role;
            if (!id || !role) {
                res.status(401);
                throw new Error("invalid id or role");
            }
            const account = yield Account_1.Account.findOne({
                attributes: { exclude: ["token", "password"] },
                where: { id: id },
            });
            if (!account) {
                res.status(404);
                throw new Error("Id does not exist");
            }
            const _a = account.dataValues, { password } = _a, accountWithoutPassword = __rest(_a, ["password"]);
            res.status(200).send({
                account: accountWithoutPassword,
            });
        }
        catch (err) {
            var statusCode = res.statusCode == 200 ? null : res.statusCode;
            statusCode = statusCode || 404;
            res.status(statusCode).json({
                message: "Authentication failed",
                error: err.message,
            });
        }
    });
}
