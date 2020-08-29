#!/usr/bin/env node

import { program } from 'commander';
import { createComponent } from './scripts/component';
import { cleanCache } from './scripts/clean-cache';
import { checkForUpdate } from './utils/package-notify';
import { getVersion } from './scripts/version';

checkForUpdate();

program
  .addCommand(createComponent())
  .addCommand(cleanCache())
  .addCommand(getVersion())
  .parse(process.argv);
