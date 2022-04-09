import { render } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should match snapshot', () => {
    const { getByText } = render(<Component />);
    const linkElement = getByText(/Component works!/i);
    expect(linkElement).toBeInTheDocument();
  });
});
