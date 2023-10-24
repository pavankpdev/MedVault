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
exports.session = void 0;
const supabase_1 = require("../provider/supabase");
const session = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionToken = req.headers['x-access-token'];
    const refreshToken = req.headers['x-refresh-token'];
    if (!sessionToken) {
        return res.status(401).json({
            error: "No session token provided"
        });
    }
    const { data: session, error: sessionError } = yield supabase_1.supabase.auth.setSession({
        access_token: sessionToken,
        refresh_token: refreshToken,
    });
    if (sessionError) {
        return res.status(401).json({
            error: "Invalid session token"
        });
    }
    // @ts-ignore
    req.user = session === null || session === void 0 ? void 0 : session.user;
    next();
});
exports.session = session;
