# Copyright (c) 2019 Oleksandr Kuvshynov
# See /LICENSE for details

import http.client
import json
from build import nasm_builder
from run import perf_stat_runner

conn = http.client.HTTPConnection('127.0.0.1:3030')
conn.request('GET', '/task')

response = conn.getresponse()
config = json.loads(response.read().decode())

(exe, errors) = nasm_builder.build("/tmp/", config["source"], ["-felf64"])

perf_stat_runner.run(exe, config["perf_events"])
