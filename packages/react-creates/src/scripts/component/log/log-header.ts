import chalk from 'chalk';

export const logHeader = (componentName: string) => {
  console.log(chalk.blueBright.bold`
   _____                 _      _____                _            
  |  __ \\               | |    / ____|              | |           
  | |__) |___  __ _  ___| |_  | |     _ __ ___  __ _| |_ ___  ___ 
  |  _  // _ \\/ _\` |/ __| __| | |    | '__/ _ \\/ _\` | __/ _ \\/ __|
  | | \\ \\  __/ (_| | (__| |_  | |____| | |  __/ (_| | ||  __/\\__ \\
  |_|  \\_\\___|\\__,_|\\___|\\__|  \\_____|_|  \\___|\\__,_|\\__\\___||___/
  
  `);
  console.log(`Creating ${chalk.blueBright`${chalk.bold`Component`}: ${componentName}`} `);
  console.log();
  console.log(`Parsing arguments...`);
  console.log();
};
