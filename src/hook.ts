#!/usr/bin/env node

import { precommitHook } from './precommit-hook';
import { switchLogUpdateOff } from './console-operations';

switchLogUpdateOff();
precommitHook();
