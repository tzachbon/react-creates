import { spawnSync } from 'child_process';
import { createTempDirectory, ITempDirectory } from 'create-temp-directory';
import { nodeFs } from '@file-services/node';

const { join, symlinkSync, mkdirSync, writeFileSync, readdirSync, statSync, relative, readFileSync } = nodeFs;

export class CliDriver {
  tempDirectory: ITempDirectory | undefined;
  constructor() {}

  public beforeAndAfter() {
    before(async () => {
      this.tempDirectory = await createTempDirectory();
    });

    after(async () => {
      await this.tempDirectory!.remove();
    });

    return this;
  }

  populateDirectorySync(files: FilesStructure) {
    if (!this.tempDirectory) {
      throw new Error('tempDirectory is not defined, did you run "beforeAndAfter"?');
    }

    populateDirectorySync(this.tempDirectory.path, files);

    return this;
  }

  runSync(args: string[] = []) {
    if (!this.tempDirectory) {
      throw new Error('tempDirectory is not defined, did you run "beforeAndAfter"?');
    }

    const childProcess = runCliSync(args, this.tempDirectory.path);

    return {
      output: childProcess.stdout,
      error: childProcess.stderr,
    };
  }
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
