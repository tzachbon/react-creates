#!/usr/bin/env node

import { program } from "commander";
import { createComponent } from "./scripts/component";
import { checkForMainDependencies } from './utils/error';

checkForMainDependencies();

program
.addCommand(createComponent())
.parse(process.argv);
