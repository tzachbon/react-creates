import type React from 'react';
import './style.css';

interface ComponentProps {}

export const Component: React.FC<ComponentProps> = () => {
  return <div className="Component">Component works!</div>;
};
