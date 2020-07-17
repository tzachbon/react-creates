export default async function isTypescript(target = process.cwd()) {
  let isInsideTypescript;
  try {
    isInsideTypescript = !!require("typescript");
  } catch (e) {
    isInsideTypescript = false;
  }

  return isInsideTypescript;
}
