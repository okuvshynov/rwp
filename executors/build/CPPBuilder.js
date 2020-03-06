// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

const { spawnSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class CPPBuilder {
  static async build(working_dir, source_code, options) {
    return new Promise(async (resolve, reject) => {
      let [src, exe] = ['b.c', 'b.out'].map(
        f => path.join(working_dir, f)
      );

      try {
        await fs.writeFile(src, source_code);
        const gpp = spawnSync('g++', options.concat('-O3', '-o', exe, src));
        if (gpp.status !== 0) {
          reject(gpp.stderr);
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

module.exports = CPPBuilder;
