import * as migration_20261104_100130 from './20261104_100130';
import * as migration_20261104_105518 from './20261104_105518';

export const migrations = [
  {
    up: migration_20261104_100130.up,
    down: migration_20261104_100130.down,
    name: '20261104_100130',
  },
  {
    up: migration_20261104_105518.up,
    down: migration_20261104_105518.down,
    name: '20261104_105518'
  },
];
