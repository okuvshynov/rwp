const DBSQLite = require('../service/db/DBSQLite.js');

/*
 * For testing, just mock SQLite in memory
 * This way we don't care about any cleanups
 */
const path = ':memory:';

it('initializes correctly', async() => {
  expect.assertions(3);
  const db = new DBSQLite(path);

  /* New DB is initialized */
  await db.connect();
  expect(db.isValid()).toBe(true);

  /* expect to be empty */
  const executors = await db.active_executors();
  expect(executors).toHaveLength(0);

  const tasks = await db.active_tasks();
  expect(tasks).toHaveLength(0);
});

it('submits new task', async() => {
  expect.assertions(2);
  const db = new DBSQLite(path);

  /* New DB is initialized */
  await db.connect();
  expect(db.isValid()).toBe(true);

  await db.new_task('mov ax, bx');
  const tasks = await db.active_tasks();

  expect(tasks).toHaveLength(1);
});

it('can dequeue the task which exists', async() => {
  expect.assertions(2);
  const db = new DBSQLite(path);
  await db.connect();
  expect(db.isValid()).toBe(true);

  await db.new_task('mov ax, bx');
  const task = await db.dequeue();
  expect(task).toMatchObject({id: 1, status: 1});
});

it('tries to dequeue the task which doesn\'t exist', async() => {
  expect.assertions(2);
  const db = new DBSQLite(path);
  await db.connect();
  expect(db.isValid()).toBe(true);

  const task = await db.dequeue();
  expect(task).toBeUndefined();
});

it('dequeues the task and can set/get result', async() => {
  expect.assertions(4);
  const db = new DBSQLite(path);
  await db.connect();
  expect(db.isValid()).toBe(true);

  const code = 'mov ax, bx';

  await db.new_task(code);
  const task = await db.dequeue();
  expect(task.task_config).toBe(code);

  const res = '{cycles: 123}';
  await db.record_task_result(task.run_uuid, res);

  const task_result = await db.get_task_result(task.uuid);
  expect(task_result.id).toBe(task.id);
  expect(task_result.result).toBe(res);
});
