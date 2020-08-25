import updateNotifier from 'update-notifier';

const pkg = require('./../../package.json');

export const checkForUpdate = () => updateNotifier({ pkg }).notify();
