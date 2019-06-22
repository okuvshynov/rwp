const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

var nasm_builder = {
  build : function(working_dir, source, options) {
    [src, obj, exe] = ['b.asm', 'b.o', 'b.out'].map(
      f => path.join(working_dir, f)
    );

    // TODO: error-handling
    const r = fs.writeFileSync(src, source);

    console.log(options.concat(src, '-o', obj));
    const nasm = spawnSync('nasm', options.concat(src, '-o', obj));
    console.log(nasm.stderr.toString('utf8'));
    const ld = spawnSync('ld', [obj, '-o', exe]);
    console.log(ld.stderr.toString('utf8'));

    return exe;
  }
}
module.exports = nasm_builder;
