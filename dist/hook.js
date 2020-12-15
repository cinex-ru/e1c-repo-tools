#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const precommit_hook_1 = require("./precommit-hook");
const console_operations_1 = require("./console-operations");
console_operations_1.setLogUpdateStatus(false);
precommit_hook_1.precommitHook();
