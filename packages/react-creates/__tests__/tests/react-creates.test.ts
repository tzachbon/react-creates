import mockFs from 'mock-fs';
import tempy from 'tempy';
import { componentTestkit } from "../testkit/component.testkit";
import { tempProjectTestkit } from "../testkit/create-react-app.testkit";

describe("react-creates", () => {
  const driver = tempProjectTestkit({ install: true });

  driver.beforeAndAfter();

  beforeEach(() => {
    mockFs.restore()
  })

  it("should create component (happy flow)", async () => {
    const cmpName = `TestCmp`;
    const componentDriver = await driver.createComponent(cmpName);

    expect(await componentDriver.testFileExists()).toBe(true);
    expect(await componentDriver.componentFileExists()).toBe(true);
    expect(await componentDriver.isStyleMatch()).toBe(true);

    const { stdout } = await driver.runScript("build");

    const isIncludesSuccessMessage = (stdout as string)
      .trim()
      .includes(`Compiled successfully`.trim());

    expect(isIncludesSuccessMessage).toBe(true);
  });

  it('should fail for not having react', async () => {

    const componentDriver = componentTestkit('SomeComponent', { target: tempy.directory() })
    await expect(componentDriver.create()).rejects.toHaveProperty('stderr')
  })
});
