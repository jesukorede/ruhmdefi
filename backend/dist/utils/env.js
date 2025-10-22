"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
require("dotenv/config");
function getEnv() {
    return {
        PORT: Number(process.env.PORT || 4000),
        DATABASE_URL: process.env.DATABASE_URL || '',
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
        OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || '',
        SOLANA_CLUSTER: process.env.SOLANA_CLUSTER || 'devnet',
        PROGRAM_ID: process.env.PROGRAM_ID || '',
        BACKEND_AUTHORITY_SECRET: process.env.BACKEND_AUTHORITY_SECRET || '',
    };
}
