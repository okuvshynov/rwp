# Copyright (c) 2019 Oleksandr Kuvshynov
# See /LICENSE for details

# This is the simplest version of executor
# For now I'm using it to automate some local runs and see what exactly 
# will we need. 

import sys
import subprocess

def nasm_build(source_path, options):
    nasm_result = subprocess.Popen(
            ["nasm"] + options + [source_path, "-o", "/tmp/rwp_sample.o"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
    nasm_stdout,nasm_stderr = nasm_result.communicate()


# assumes default location /tmp/rwp_sample.o and /tmp/rwp_executable
def ld_link():
    ld_result = subprocess.Popen(
            ["ld", "/tmp/rwp_sample.o", "-o", "/tmp/rwp_executable"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
    ld_stdout,ld_stderr = ld_result.communicate()

def run_perf_stat(perf_events):
    # allowed perf for non-root:
    # sudo sh -c 'echo 1 >/proc/sys/kernel/perf_event_paranoid'
    # sudo sh -c 'echo kernel.perf_event_paranoid=1 > /etc/sysctl.d/local.conf'
    perf_result = subprocess.Popen(
            ["perf", "stat", "-e", perf_events, "/tmp/rwp_executable"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
    perf_stdout,perf_stderr = perf_result.communicate()
    print(perf_stdout)
    #print(perf_stderr)

source_path = sys.argv[1]
perf_events = sys.argv[2] # comma-separated list

nasm_build(source_path, ["-felf64"])
ld_link()
run_perf_stat(perf_events)
