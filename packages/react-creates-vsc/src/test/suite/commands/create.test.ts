import { expect } from 'chai';
import create from '../../../commands/create';

suite('Create', () => {
  test('should have name', () => {
    expect(create).to.haveOwnProperty('name');
    expect(create.name).to.equal('react-creates-vsc.create');
  });

  test('should have a command', () => {
    expect(create).to.haveOwnProperty('command');
    expect(create.command).to.be.a('function');
  });


});
