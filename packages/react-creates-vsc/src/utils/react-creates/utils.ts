import { window } from 'vscode';
import { ValuesType } from 'utility-types';

export const yesOrNoQuestion = {
  YES: 'Yes',
  NO: 'No',
} as const;

export const cacheTypes = {
  CACHE: 'Use cache (default)',
  SKIP_CACHE: "Skip cache (won't save cache value)",
} as const;

export const getYesOrNoQuestion = async (title: string) =>
  (await window.showQuickPick(Object.values(yesOrNoQuestion), { placeHolder: title })) as
    | ValuesType<typeof yesOrNoQuestion>
    | undefined;

export const getQuickOptions = async <T, J extends {} = {}>(title: string, options: J) =>
  (await window.showQuickPick(Object.values(options ?? {}), {
    placeHolder: title,
  })) as T | undefined;
