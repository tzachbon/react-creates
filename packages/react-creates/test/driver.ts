import { spawnSync } from 'child_process';
import { nodeFs } from '@file-services/node';
import rimrafCb from 'rimraf';
import { promisify } from 'util';

const {
  join,
  dirname,
  symlinkSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  statSync,
  relative,
  readFileSync,
  promises,
} = nodeFs;
const { mkdir } = promises;

const rimraf = promisify(rimrafCb);

const packageRootDir = dirname(require.resolve('react-creates/package.json'));
const rootTempDir = join(packageRootDir, '..', '..', '.temp');

export class CliDriver {
  tempDirectory: ITempDirectory | undefined;

  static loadFixtureSync(name: string) {
    return loadDirSync(join(packageRootDir, 'fixtures', name));
  }

  public beforeAndAfter() {
    beforeEach(async () => {
      this.tempDirectory = await createTempDirectory();
    });

    afterEach(async () => {
      await this.tempDirectory!.remove();
    });

    return this;
  }

  populateDirectorySync = (files: FilesStructure) => {
    if (!this.tempDirectory) {
      throw new Error('tempDirectory is not defined, did you run "beforeAndAfter"?');
    }

    populateDirectorySync(this.tempDirectory.path, files);

    return this;
  };

  runSync = (args: string[] = []) => {
    if (!this.tempDirectory) {
      throw new Error('tempDirectory is not defined, did you run "beforeAndAfter"?');
    }

    const childProcess = runCliSync(args, this.tempDirectory.path);

    return {
      output: childProcess.stdout,
      error: childProcess.stderr,
      ...this,
    };
  };

  loadDirectorySync = (dirName = '.') => {
    if (!this.tempDirectory) {
      throw new Error('tempDirectory is not defined, did you run "beforeAndAfter"?');
    }

    const directory = join(this.tempDirectory.path, dirName);

    return loadDirSync(directory);
  };
}

export const symlinkSymbol = Symbol('symlink');

export interface LinkedDirectory {
  type: typeof symlinkSymbol;
  path: string;
}
export interface FilesStructure {
  [filepath: string]: string | FilesStructure | LinkedDirectory;
}

export function runCliSync(cliArgs: string[] = [], cwd: string) {
  return spawnSync('node', [require.resolve('react-creates/bin/react-creates.js'), ...cliArgs], {
    encoding: 'utf8',
    cwd,
  });
}

export function populateDirectorySync(
  rootDir: string,
  files: FilesStructure,
  context: { symlinks: Map<string, Set<string>> } = { symlinks: new Map() }
) {
  for (const [filePath, content] of Object.entries(files)) {
    const path = join(rootDir, filePath);

    if (typeof content === 'object') {
      if (content.type === symlinkSymbol) {
        const existingPath = join(path, content.path as string);
        try {
          symlinkSync(existingPath, path, 'junction');
        } catch {
          // The existing path does not exist yet so we save it in the context to create it later.

          if (!context.symlinks.has(existingPath)) {
            context.symlinks.set(existingPath, new Set());
          }

          context.symlinks.get(existingPath)!.add(path);
        }
      } else {
        mkdirSync(path);

        if (context.symlinks.has(path)) {
          for (const linkedPath of context.symlinks.get(path)!) {
            symlinkSync(path, linkedPath, 'junction');
          }

          context.symlinks.delete(path);
        }

        populateDirectorySync(path, content as FilesStructure, context);
      }
    } else {
      writeFileSync(path, content);

      if (context.symlinks.has(path)) {
        for (const linkedPath of context.symlinks.get(path)!) {
          symlinkSync(path, linkedPath, 'junction');
        }

        context.symlinks.delete(path);
      }
    }
  }
}

export interface Files {
  [filepath: string]: string;
}

export function loadDirSync(rootPath: string, dirPath: string = rootPath): Files {
  return readdirSync(dirPath).reduce<Files>((acc, entry) => {
    const fullPath = join(dirPath, entry);
    const key = relative(rootPath, fullPath).replace(/\\/g, '/');
    const stat = statSync(fullPath);
    if (stat.isFile()) {
      acc[key] = readFileSync(fullPath, 'utf8');
    } else if (stat.isDirectory()) {
      return {
        ...acc,
        ...loadDirSync(rootPath, fullPath),
      };
    } else {
      throw new Error('Not Implemented');
    }
    return acc;
  }, {});
}

export interface ITempDirectory {
  /**
   * Absolute path to created directory.
   */
  path: string;

  /**
   * Remove the directory and all its contents.
   */
  remove(): Promise<void>;
}

export async function createTempDirectory(prefix = 'temp-'): Promise<ITempDirectory> {
  const path = join(rootTempDir, prefix + Math.random().toString(36).substring(2));
  await mkdir(path, { recursive: true });

  return {
    path,
    remove: () => rimraf(path),
  };
}
