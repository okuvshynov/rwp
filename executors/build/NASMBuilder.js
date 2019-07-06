// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const { spawnSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class NASMBuilder {
  static async build(working_dir, source_code, options) {
    return new Promise(async (resolve, reject) => {
      let [src, obj, exe] = ['b.asm', 'b.o', 'b.out'].map(
        f => path.join(working_dir, f)
      );

      try {
        await fs.writeFile(src, source_code);
        const nasm = spawnSync('nasm', options.concat(src, '-o', obj));
        if (nasm.status !== 0) {
          reject(nasm.stderr);
          return;
        }
        const ld = spawnSync('ld', [obj, '-o', exe]);
        if (ld.status !== 0) {
          reject(ld.stderr);
          return;
        }

        resolve(exe);
      }
      catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = NASMBuilder;
