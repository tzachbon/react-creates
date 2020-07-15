import React from 'react';
import renderer from 'react-test-renderer';
import {%name%} from '.';


describe("{%name%}", () => {
  it("should match snapshot", () => {
    const tree = renderer(<{%name%} />);
    expect(tree).toMatchSnapshot();
  });
});
