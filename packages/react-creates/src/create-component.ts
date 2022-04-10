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

export const createComponentProperties = {
  language: ['typescript', 'javascript'],
  type: ['function', 'class'],
  style: ['css', 'scss', 'none'],
};

export interface ComponentOption {
  name: string;
  type?: 'function' | 'class';
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
  onFinished?: (options: Required<CreateComponentOption>) => Promise<void> | void;
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
    onFinished,
  }: CreateComponentMeta = {}
) {
  const resolvedOptions = await resolveCreateComponentOptions(options, resolveProperty);
  const { language, type, name, directory: target } = resolvedOptions;

  const resolvedSource = fileSystem.join(templateDirectory, language, type);
  const resolvedTarget = fileSystem.join(target, name);

  await fileSystem.promises.ensureDirectory(resolvedTarget);
  await fileSystem.promises.copyDirectory(resolvedSource, resolvedTarget);

  const files = await fileSystem.promises.readdir(resolvedTarget);

  const modifiedOptions = {
    ...resolvedOptions,
    style: resolvedOptions.style === 'none' ? undefined : resolvedOptions.style,
  };

  try {
    for (const oldFileName of files) {
      if (modifiedOptions.skipTest && testFileRegex.test(oldFileName)) {
        /**
         * Delete test file
         */
        await fileSystem.promises.rm(fileSystem.join(resolvedTarget, oldFileName));
        continue;
      }

      if (!modifiedOptions.style && styleFileRegex.test(oldFileName)) {
        /**
         * Delete style file
         */
        await fileSystem.promises.rm(fileSystem.join(resolvedTarget, oldFileName));
        continue;
      }

      /**
       * Resolve file name
       */
      const fileName = render(oldFileName, modifiedOptions).replace(/.template$/, '');
      const filePath = fileSystem.join(resolvedTarget, fileName);
      await fileSystem.promises.rename(fileSystem.join(resolvedTarget, oldFileName), filePath);

      /**
       * Resolve File Content
       */
      const content = await fileSystem.promises.readFile(filePath, 'utf8');
      const resolvedContent = render(content, modifiedOptions);
      await fileSystem.promises.writeFile(filePath, resolvedContent, 'utf8');
    }
    logger.log(`Component "${name}" created.\n\n${resolvedTarget}\n`);

    onFinished?.(resolvedOptions);
  } catch (error) {
    logger.error(`Failed to create "${name}" component.\n\n${resolvedTarget}\n${error}`);
    logger.log(`Cleaning up...`);

    await fileSystem.promises.rm(resolvedTarget, { recursive: true, force: true });
  }
}

export async function resolveCreateComponentOptions(
  options: CreateComponentOption,
  resolveProperty: CreateComponentMeta['resolveProperty'] = () => void 0
): Promise<Required<CreateComponentOption>> {
  return {
    name: options.name,
    directory: options.directory,
    type: options.type ?? ((await resolveProperty?.('type')) || 'function'),
    language: options.language ?? ((await resolveProperty?.('language')) || 'typescript'),
    propTypes: options.propTypes ?? (await resolveProperty?.('propTypes')) ?? false,
    skipTest: options.skipTest ?? (await resolveProperty?.('skipTest')) ?? false,
    style: options.style ?? (await resolveProperty?.('style')) ?? 'none',
  };
}
