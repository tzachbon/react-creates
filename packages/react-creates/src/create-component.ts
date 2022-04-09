import { nodeFs } from '@file-services/node';
import type { IFileSystem } from '@file-services/types';
import { render } from 'mustache';

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
  resolveProperty?<P extends keyof ComponentOption>(key: P): Required<ComponentOption[P]>;
  fileSystem?: IFileSystem;
  templateDirectory?: string;
}

export async function createComponent(
  options: CreateComponentOption,
  { resolveProperty, fileSystem = nodeFs, templateDirectory = defaultTemplateDirectory }: CreateComponentMeta = {}
) {
  if (!options.language) {
    options.language = resolveProperty?.('language') || 'typescript';
  }

  if (!options.propTypes) {
    options.propTypes = resolveProperty?.('propTypes') ?? false;
  }

  if (!options.skipTest) {
    options.skipTest = resolveProperty?.('skipTest') ?? false;
  }

  if (!options.style) {
    options.style = resolveProperty?.('style') || 'none';
  }

  const { language, type, name, directory: target } = options;

  const resolvedSource = fileSystem.join(templateDirectory, language, type);
  const resolvedTarget = fileSystem.join(target, name);

  await fileSystem.promises.ensureDirectory(resolvedTarget);
  await fileSystem.promises.copyDirectory(resolvedSource, resolvedTarget);

  for (const oldFileName of await fileSystem.promises.readdir(resolvedTarget)) {
    /**
     * Resolve file name
     */
    const fileName = render(oldFileName, options).replace(/.template$/, '');
    const filePath = fileSystem.join(resolvedTarget, fileName);
    fileSystem.promises.rename(fileSystem.join(resolvedTarget, oldFileName), filePath);

    /**
     * Resolve File Content
     */
    const content = await fileSystem.promises.readFile(filePath, 'utf8');
    const resolvedContent = render(content, options);
    await fileSystem.promises.writeFile(filePath, resolvedContent, 'utf8');
  }
}
