"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign_access = sign_access;
exports.sign_refresh = sign_refresh;
exports.decode_access = decode_access;
exports.decode_refresh = decode_refresh;
const jwt = __importStar(require("jsonwebtoken"));
const JWT_SECRET = "e7a67e013369ba17e622af20aa523d116291245e41ce97d798723e8961118778";
const REFRESH_TOKEN_SECRET = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5Nzk0NzYyNSwiaWF0IjoxNjk3OTQ3NjI1fQ.OzyZEOobmBMnjJfXfKmuGapymsz3qeMJh4dZ16Fn654";
const ACCESS_TOKEN_SECRET = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5Nzk0NzYyNSwiaWF0IjoxNjk3OTQ3NjI1fQ.OzyZEOobmBMnjJfXfKmuGapymsz3qeMJh4dZ16Fn654";
const REFRESH_EXPIRE_TIME = "30 days";
const ACCESS_EXPIRE_TIME = "1 days";
function sign_refresh(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_EXPIRE_TIME,
    });
}
function sign_access(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_EXPIRE_TIME,
    });
}
function decode_refresh(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
function decode_access(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}
