"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.getBearerToken = getBearerToken;
exports.getAuthenticatedUserId = getAuthenticatedUserId;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function getBearerToken(headers) {
    if (!headers) {
        return null;
    }
    const headerValue = headers.authorization;
    const authorization = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return null;
    }
    const token = authorization.slice(7).trim();
    return token.length > 0 ? token : null;
}
function getAuthenticatedUserId(headers) {
    const token = getBearerToken(headers);
    if (!token) {
        return null;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded.userId === "number") {
            return decoded.userId;
        }
        if (typeof decoded.sub === "number") {
            return decoded.sub;
        }
        if (typeof decoded.sub === "string") {
            const parsed = Number(decoded.sub);
            return Number.isNaN(parsed) ? null : parsed;
        }
    }
    catch {
        return null;
    }
    return null;
}
