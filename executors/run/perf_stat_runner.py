import os
import subprocess

# Runs perf stat and captures the events.
# TODO: support arguments/stdin passing to the executable
def run(executable, perf_events):
    # allowed perf for non-root:
    # sudo sh -c 'echo 1 >/proc/sys/kernel/perf_event_paranoid'
    # sudo sh -c 'echo kernel.perf_event_paranoid=1 > /etc/sysctl.d/local.conf'
    perf_result = subprocess.Popen(
            ["perf", "stat", "-e", perf_events, executable],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
    perf_stdout,perf_stderr = perf_result.communicate()

    # TODO: parse and return this
    print(perf_stdout)
    #print(perf_stderr)
