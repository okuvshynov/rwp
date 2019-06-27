var expect = require('chai').expect;
var DBSQLite = require('../db_sqlite3.js');

describe('DBSQLite', () => {
  it('initialization testing', async () => {
    const path = './service/tests/test_data/db.sqlite';
    const db = new DBSQLite(path);

    /* New DB is initialized */
    const connection = await db.connect();
    expect(db.isValid()).to.be.true;

    /* expect to be empty */
    const executors = await db.active_executors();
    expect(executors).to.be.empty;

    const tasks = await db.active_tasks();
    expect(tasks).to.be.empty;
  });
});

describe('DBSQLite', () => {
  it('new task submission', async () => {
    const path = './service/tests/test_data/db.sqlite';
    const db = new DBSQLite(path);

    /* New DB is initialized */
    const connection = await db.connect();
    expect(db.isValid()).to.be.true;

    await db.new_task("mov ax, bx");
    const tasks = await db.active_tasks();

    expect(tasks).to.have.lengthOf(1);
  });
});

