import { expect } from 'chai';
import component from '../../../commands/create/component';

suite('Component', () => {
  test('should have name', () => {
    expect(component).to.haveOwnProperty('name');
    expect(component.name).to.equal('react-creates-vsc.component');
  });

  test('should have a command', () => {
    expect(component).to.haveOwnProperty('command');
    expect(component.command).to.be.a('function');
  });
});
