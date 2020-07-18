import { tempProjectTestkit } from "./driver/create-react-app.testkit";

describe("react-creates", () => {
  const driver = tempProjectTestkit();

  beforeAll(async () => await driver.start());
  afterAll(async () => await driver.reset());

  it("should create component (happy flow)", async () => {

    const cmpName = `TestCmp`;
    const componentDriver = await driver.createComponent(cmpName);

    expect(await componentDriver.testFileExists()).toBe(true);
    expect(await componentDriver.componentFileExists()).toBe(true);
    expect(await componentDriver.isStyleMatch()).toBe(true);
  });
});
