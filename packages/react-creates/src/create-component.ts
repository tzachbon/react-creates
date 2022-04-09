import { nodeFs } from '@file-services/node';
import type { IFileSystem } from '@file-services/types';
import { render } from 'mustache';

const testFileRegex = /^(.*?)\.test\.(.*?)$/;
const styleFileRegex = /^style\.\{\{style\}\}\.template$/;
const defaultTemplateDirectory = nodeFs.join(
  nodeFs.dirname(require.resolve('react-creates/package.json')),
  'templates',
  'component'
);

export interface ComponentOption {
  name: string;
  type: 'function' | 'class';
  language?: 'typescript' | 'javascript';
  propTypes?: boolean;
  skipTest?: boolean;
  style?: 'css' | 'scss' | 'none';
}

export interface CreateComponentOption extends ComponentOption {
  directory: string;
}

export interface CreateComponentMeta {
  resolveProperty?<P extends keyof ComponentOption>(
    key: P
  ): Promise<ComponentOption[P] | undefined> | ComponentOption[P] | undefined;
  fileSystem?: IFileSystem;
  templateDirectory?: string;
  logger?: {
    log: (...messages: any[]) => void;
    error: (...messages: any[]) => void;
  };
}

export async function createComponent(
  options: CreateComponentOption,
  {
    resolveProperty,
    fileSystem = nodeFs,
    templateDirectory = defaultTemplateDirectory,
    logger = console,
  }: CreateComponentMeta = {}
) {
  if (!options.language) {
    options.language = (await resolveProperty?.('language')) || 'typescript';
  }

  if (!options.propTypes) {
    options.propTypes = (await resolveProperty?.('propTypes')) ?? false;
  }

  if (!options.skipTest) {
    options.skipTest = (await resolveProperty?.('skipTest')) ?? false;
  }

  if (!options.style) {
    options.style = (await resolveProperty?.('style')) || 'none';

    if (options.style === 'none') {
      options.style = undefined;
    }
  }

  const { language, type, name, directory: target } = options;

  const resolvedSource = fileSystem.join(templateDirectory, language, type);
  const resolvedTarget = fileSystem.join(target, name);

  await fileSystem.promises.ensureDirectory(resolvedTarget);
  await fileSystem.promises.copyDirectory(resolvedSource, resolvedTarget);

  const files = await fileSystem.promises.readdir(resolvedTarget);

  try {
    for (const oldFileName of files) {
      if (options.skipTest && testFileRegex.test(oldFileName)) {
        /**
         * Delete test file
         */
        await fileSystem.promises.rm(fileSystem.join(resolvedTarget, oldFileName));
        continue;
      }

      if (!options.style && styleFileRegex.test(oldFileName)) {
        /**
         * Delete style file
         */
        await fileSystem.promises.rm(fileSystem.join(resolvedTarget, oldFileName));
        continue;
      }

      /**
       * Resolve file name
       */
      const fileName = render(oldFileName, options).replace(/.template$/, '');
      const filePath = fileSystem.join(resolvedTarget, fileName);
      await fileSystem.promises.rename(fileSystem.join(resolvedTarget, oldFileName), filePath);

      /**
       * Resolve File Content
       */
      const content = await fileSystem.promises.readFile(filePath, 'utf8');
      const resolvedContent = render(content, options);
      await fileSystem.promises.writeFile(filePath, resolvedContent, 'utf8');
    }
    logger.log(`Component "${name}" created.\n\n${resolvedTarget}\n`);
  } catch (error) {
    logger.error(`Failed to create "${name}" component.\n\n${resolvedTarget}\n${error}`);
    logger.log(`Cleaning up...`);

    await fileSystem.promises.rm(resolvedTarget, { recursive: true, force: true });
  }
}
