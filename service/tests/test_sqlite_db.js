const expect = require('chai').expect;
const DBSQLite = require('../db_sqlite3.js');

/*
 * For testing, just mock SQLite in memory
 * This way we don't care about any cleanups
 */
const path = ':memory:';

describe('DBSQLite', () => {
  it('initialization testing', async () => {
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

  it('new task submission', async () => {
    const db = new DBSQLite(path);

    /* New DB is initialized */
    const connection = await db.connect();
    expect(db.isValid()).to.be.true;

    await db.new_task("mov ax, bx");
    const tasks = await db.active_tasks();

    expect(tasks).to.have.lengthOf(1);
  });

  it('dequeue the task which exists', async () => {
    const db = new DBSQLite(path);
    const connection = await db.connect();
    expect(db.isValid()).to.be.true;
    
    await db.new_task("mov ax, bx");
    const task = await db.dequeue();
    expect(task).to.include({id: 1, status: 1});
  });

  it('dequeue the task which doesn\'t exist', async () => {
    const db = new DBSQLite(path);
    const connection = await db.connect();
    expect(db.isValid()).to.be.true;
    
    const task = await db.dequeue();
    expect(task).to.be.undefined;
  });

  it('dequeue the task and set result', async () => {
    const db = new DBSQLite(path);
    const connection = await db.connect();
    expect(db.isValid()).to.be.true;
    
    await db.new_task("mov ax, bx");
    const task = await db.dequeue();

    const res = "{cycles: 123}";
    await db.record_task_result(task.run_uuid, res);

    const task_result = await db.get_task_result(task.run_uuid);
    expect(task_result.id).to.equal(task.id);
    expect(task_result.result).to.equal(res);
  });

  // TODO: more tests on corner cases - wrong executor submitting results, etc.
});


