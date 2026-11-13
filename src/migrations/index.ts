import * as migration_20261113_174042_initial from './20261113_174042_initial';

export const migrations = [
  {
    up: migration_20261113_174042_initial.up,
    down: migration_20261113_174042_initial.down,
    name: '20261113_174042_initial'
  },
];
