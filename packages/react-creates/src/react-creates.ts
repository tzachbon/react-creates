#!/usr/bin/env node

import { program } from 'commander';
import { createComponent } from './scripts/component';
import { cleanCache } from './scripts/clean-cache/clean-cache';
import { checkForUpdate } from './utils/package-notify';

checkForUpdate();

program.addCommand(createComponent()).addCommand(cleanCache()).parse(process.argv);
