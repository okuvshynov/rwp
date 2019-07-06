// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

// This is sqlite implementation of the data access module.
// Maybe, in future, we'll have to migrate to something different;
// To implement:
// [x] get list of active executors
// [x] submit new task
// [ ] get result of task execution
// [ ] get job queue status
// [ ] see past runs [later]
// [ ] mark executor as 'active'
// [x] dequeue task
// [x] submit a result of task execution
const sqlite3 = require('sqlite3');
const uuidv1 = require('uuid/v1');
const fs = require('fs');

class DBSQLite {
  constructor(path) {
    this.db = new sqlite3.Database(path);
    this.valid = false;
  }

  async connect() {
    /*
     * This might be a first run, so we init the db with the empty tables
     */
    const sql_path = './service/db/create_if_not_exists.sql';
    return new Promise((resolve, reject) => {
      if (this.valid) {
        resolve();
      } else {
        fs.readFile(sql_path, 'utf8', (err, content) => {
          if (err) {
            reject(err);
          } else {
            this.db.exec(content, (err) => {
              if (err) {
                this.valid = false;
                reject(err);
              } else {
                this.valid = true;
                resolve();
              }
            });
          }
        });
      }
    });
  }

  isValid() {
    return this.valid;
  }

  /*
   * This section is a promise wrappers around callback-style
   * sqlite API
   */
  async all(sql) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async get(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }


  /*
   * Executes insert statement and returns a promise with last
   * inserted id (or error)
   */
  async insert(sql, params) {
    return new Promise((resolve, reject) => {
      // Using 'function' instead of arrow notation
      // to get access to this.lastID
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async active_executors() {
    return this.all('select * from executors');
  }

  async active_tasks() {
    return this.all('select * from tasks where status=0');
  }

  /*
   * Picks the task with status = 0 in FIFO order and atomically modifies
   * the status. This is implemented in DB because we might need more
   * complicated filtering re:which executor can run which task. For example,
   * same CPU architecture but different number of cores.
   * So, it's likely the query will become more complicated than it is now.
   */
  async dequeue() {
    return new Promise((resolve, reject) => {
      const run_id = uuidv1();
      this.db.run(
        `UPDATE tasks SET run_uuid = ?, status = 1 WHERE id IN (
            SELECT id FROM tasks WHERE status = 0 
            ORDER BY id ASC
            LIMIT 1
        )`, [run_id], (err) => {
          if (err) {
            reject(err);
          } else {
            this.db.get(
              'SELECT * FROM tasks WHERE run_uuid=?', [run_id], (err, row) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(row);
                }
              });
          }
        });
    });
  }

  /*
   * Submit new task.
   */
  async new_task(source) {
    const task_uuid = uuidv1();
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO tasks(task_config, uuid, status) VALUES(?, ?, ?)',
        [source, task_uuid, 0],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(task_uuid);
          }
        }
      );
    });
  }

  // TODO: also modify task status.
  // Although, maybe run_uuid counts as a status and we do not need it at all.
  // TODO: make sure to not record duplicated results
  // TODO: maybe avoid 'results' table entirely.
  async record_task_result(run_uuid, result) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE
             tasks
           SET
             result = ?, status = 2 
           WHERE
             run_uuid = ? AND status = 1`, [result, run_uuid], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });
  }

  /*
   * Get result of task execution by task UUID (not to confuse with run UUID)
   * Maybe it's a good idea to get by id?
   */
  async get_task_result(task_uuid) {
    return this.get(
      `SELECT 
         tasks.task_config, 
         tasks.run_uuid, 
         tasks.id, 
         tasks.uuid,
         tasks.result 
       FROM 
        tasks 
       WHERE 
         tasks.uuid = ?`,
      [task_uuid]
    );
  }
}

module.exports = DBSQLite;
