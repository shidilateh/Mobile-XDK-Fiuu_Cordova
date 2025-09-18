#!/usr/bin/env node
const fs = require("fs");
const dotenv = require("dotenv");

// Choose env file (default .env)
const envFile = process.env.ENV_FILE || ".env";
const result = dotenv.config({ path: envFile });

if (result.error) throw result.error;

// Convert to JS for Cordova app
const content = `window.ENV = ${JSON.stringify(result.parsed)};`;
fs.writeFileSync("www/js/env.js", content);

console.log(`[ENV] Injected variables from ${envFile}`);
