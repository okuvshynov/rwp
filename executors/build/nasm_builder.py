import os
import subprocess

def build(working_dir, source, options):
    fullpath = lambda f: os.path.join(working_dir, f)
    (src, obj, exe) = tuple(fullpath(f) for f in ("a.asm", "a.o", "a.out"))

    with open(src, "w") as src_file:
        src_file.write(source)

    nasm_result = subprocess.Popen(
            ["nasm"] + options + [src, "-o", obj],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
    nasm_stdout,nasm_stderr = nasm_result.communicate()
    print(nasm_stderr)
    
    ld_result = subprocess.Popen(
            ["ld", obj, "-o", exe],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
    ld_stdout,ld_stderr = ld_result.communicate()
    print(ld_stderr)

    return (exe, []) # assume no errors
