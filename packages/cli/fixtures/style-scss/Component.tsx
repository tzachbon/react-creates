import type React from 'react';
import './style.scss';

interface ComponentProps {}

export const Component: React.FC<ComponentProps> = () => {
  return <div className="Component">Component works!</div>;
};
