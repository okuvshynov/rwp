// This is sqlite implementation of the data access. 
// Maybe, in future, we'll migrate to something different;
const sqlite3 = require('sqlite3');

class DBSQLite {
  constructor(path) {
    this.db = new sqlite3.Database(path);
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

  /*
   * Executes insert statement and returns a promise with last
   * inserted id (or error)
   */
  async insert(sql, params) {
    return new Promise((resolve, reject) => { 
      // Using 'function' instead of arrow notation
      // to get access to this.lastID
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async executors() {
    return this.all("select * from executors");
  }

  async active_tasks() {
    return this.all("select * from tasks where status=0");
  }

  /*
   * Picks the task with status = 0 in FIFO order and atomically modifies the status.
   * This is implemented in DB because we might need more complicated filtering re:
   * which executor can run which task. For example,
   * same CPU architecture but different number of cores. So, it's likely the query will
   * become more complicated than it is right now.
   */
  async dequeue() {
  }

  async new_task(source) {
    return this.insert("INSERT INTO tasks(task_config, status) VALUES(?, ?)", [source, 0]);
  }
}

var db = new DBSQLite("service/db/db.sqlite");
db.active_tasks()
.then(r => {
  console.log(r);
})
.catch(err => {
  console.error(err);
});

db.new_task('mov ax, bx')
.then(id => {
  console.log('inserted! ', id);
})
.catch(err => {
  console.error(err);
})
