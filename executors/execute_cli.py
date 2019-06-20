# Copyright (c) 2019 Oleksandr Kuvshynov
# See /LICENSE for details

# This is the simplest version of executor
# For now I'm using it to automate some local runs and see what exactly 
# will we need. 

import sys
from build import nasm_builder
from run import perf_stat_runner

# TODO: handle errors
source = open(sys.argv[1], 'r').read() 
print(source)
perf_events = sys.argv[2] # comma-separated list

(exe, errors) = nasm_builder.build("/tmp/", source, ["-felf64"])
print(exe)
print(errors)
perf_stat_runner.run(exe, perf_events)
