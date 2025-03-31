import { syncDb } from './sync-db';

describe('syncDb', () => {
  it('should work', () => {
    expect(syncDb()).toEqual('sync-db');
  });
});
