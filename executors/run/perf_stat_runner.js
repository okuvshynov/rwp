const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/*
 * allowed perf for non-root:
 * sudo sh -c 'echo 1 >/proc/sys/kernel/perf_event_paranoid'
 * sudo sh -c 'echo kernel.perf_event_paranoid=1 > /etc/sysctl.d/local.conf'
 */
var perf_stat_runner = {
  run : function(executable, events) {
    console.log(events, executable);
    const perf_stat = spawnSync('perf', ['stat', '-e', events, executable]);

    console.log(perf_stat.stdout.toString('utf8'));
    console.log(perf_stat.stderr.toString('utf8'));
  }
}
module.exports = perf_stat_runner;
