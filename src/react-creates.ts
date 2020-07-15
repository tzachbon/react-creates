#!/usr/bin/env node

import { program } from "commander";
import { createComponent } from "./scripts/component";

program
.addCommand(createComponent())
.parse(process.argv);
