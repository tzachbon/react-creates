import React from 'react';
import { render } from '@testing-library/react';
import {{name}} from '.';


describe("{{name}}", () => {
  it("should match snapshot", () => {
    const { getByText } = render(<{{name}} />);
    const linkElement = getByText(/{{name}} works!/i);
    expect(linkElement).toBeInTheDocument();
  });
});