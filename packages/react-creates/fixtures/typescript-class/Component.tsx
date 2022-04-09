import React from 'react';

interface ComponentProps {}

export class Component extends React.Component<ComponentProps> {
  render() {
    return <div className="Component">Component works!</div>;
  }
}
