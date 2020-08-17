#!/usr/bin/env node

import { program } from "commander";
import { createComponent } from "./scripts/component";
import { checkForMainDependencies } from './utils/error';
import * as componentParser from './scripts/component/parsers'

async function main() {

  await checkForMainDependencies();

  program
    .addCommand(createComponent())
    .parse(process.argv);
}

main()
  .catch(error => {
    throw error
  })



export { componentParser }