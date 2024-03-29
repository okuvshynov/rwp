// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const { spawnSync } = require('child_process');
const fs = require('fs');

/*
 * allowed perf for non-root:
 * sudo sh -c 'echo 1 >/proc/sys/kernel/perf_event_paranoid'
 * sudo sh -c 'echo kernel.perf_event_paranoid=1 > /etc/sysctl.d/local.conf'
 */
class PerfStatRunner {
  static run(executable, events) {
    const output_file = executable + '.stat';
    const separator = ',';
    // TODO: error handling
    spawnSync(
      'perf',
      ['stat', '-e', events, '-o', output_file, '-x', separator, executable]
    );

    let res = {};

    (fs.readFileSync(output_file, 'utf8'))
      .split('\n')
      .map(
        l => {
          const f = l.split(separator);

          if (f.length >= 3) {
          // first field is counter value, 3rd field is counter name
            res[f[2]] = parseInt(f[0], 10);
          }
        }
      );

    return res;
  }
}
module.exports = PerfStatRunner;

