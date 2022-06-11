import { nodeFs } from '@file-services/node';
import type { IFileSystem } from '@file-services/types';
import findCacheDir from 'find-cache-dir';

interface FileSystemCacheOptions {
  fileSystem?: IFileSystem;
  rootDir?: string;
}

export class FileSystemCache {
  private currentContent: Record<string, any> | undefined;
  static create({ fileSystem = nodeFs, rootDir = process.cwd() }: FileSystemCacheOptions = {}) {
    return new this(fileSystem, fileSystem.join(FileSystemCache.getCacheRootPath({ rootDir }), 'cache.json'));
  }

  static getCacheRootPath({ rootDir = process.cwd() }: FileSystemCacheOptions = {}) {
    const cachePathDir = findCacheDir({
      name: 'react-creates',
      create: true,
      cwd: rootDir,
    })!;

    return cachePathDir;
  }

  static delete({ fileSystem = nodeFs, rootDir = process.cwd() }: FileSystemCacheOptions = {}) {
    const cachePath = FileSystemCache.getCacheRootPath({ rootDir });

    if (fileSystem.existsSync(cachePath)) {
      fileSystem.unlinkSync(cachePath);
      return true;
    }

    return false;
  }

  private constructor(private fileSystem: IFileSystem, private cachePath: string) {}

  has(key: string): boolean {
    const cacheContent = this.getCacheContent();

    if (!cacheContent) {
      return false;
    }

    return key in cacheContent;
  }

  get<T = any>(key: string) {
    const cacheContent = this.getCacheContent();

    if (!cacheContent) {
      return;
    }

    return cacheContent[key] as T;
  }

  set<T = any>(key: string, value: T) {
    this.currentContent = { ...this.getCacheContent(), [key]: value };

    this.fileSystem.writeFileSync(this.cachePath, JSON.stringify(this.currentContent, null, 3));
  }

  private getCacheContent() {
    if (!this.fileSystem.existsSync(this.cachePath)) {
      this.fileSystem.writeFileSync(this.cachePath, '{}');
      this.currentContent = {};
    }

    if (!this.currentContent) {
      this.currentContent = (this.fileSystem.readJsonFileSync(this.cachePath) as Record<string, any>) ?? {};
    }

    return this.currentContent;
  }
}
