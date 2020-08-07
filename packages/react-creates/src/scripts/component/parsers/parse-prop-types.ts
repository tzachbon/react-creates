import { Language } from './parse-language'
import getPackageJson from '../../../utils/get-package-json';


type ParsePropTypes = (options: { propTypes: boolean, target?: string }) => Promise<boolean>

export const parsePropTypes: ParsePropTypes = async ({ propTypes, target = process.cwd() }) => {

  if (propTypes) return propTypes;

  const packageJson = await getPackageJson({ cwd: target }) || {}
  const { dependencies } = packageJson;

  return Boolean(dependencies?.['prop-types'])
}