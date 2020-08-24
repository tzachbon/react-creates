#!/usr/bin/env node

import { program } from 'commander';
import { createComponent } from './scripts/component';
import { cleanCache } from './scripts/clean-cache/clean-cache';

program.addCommand(createComponent()).addCommand(cleanCache()).parse(process.argv);
