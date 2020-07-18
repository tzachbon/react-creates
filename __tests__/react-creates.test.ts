import { tempProjectTestkit } from "./driver/create-react-app.testkit";

describe("react-creates", () => {
  const driver = tempProjectTestkit();

  beforeAll(async () => await driver.start());
  afterAll(async () => await driver.reset());

  it("should create component (happy flow)", async () => {
    // console.log(await driver.createComponent("__Test__"));

    await driver.createComponent('TestCmp')
    expect(true).toBe(true);
  });
});
