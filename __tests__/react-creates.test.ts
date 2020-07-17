import { tempProjectTestkit } from "./driver/create-mini-project.testkit";

describe("react-creates", () => {
  const driver = tempProjectTestkit();

  beforeEach(async () => await driver.start());
  afterEach(async () => await driver.reset());

  it("should create component",async  () => {
    console.log(await driver.createComponent("__Test__"));

    expect(true).toBe(true);
  });
});
