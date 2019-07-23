// MIT License
// Refer to /LICENSE file for full text
// Copyright (c) 2019 Oleksandr Kuvshynov

// TODO: tests 
function log_every_n_impl(freq, logger, ...message) {
  let caller_line = (new Error).stack.split('\n')[2];
  // static collection of past periods.
  log_every_n_impl.last_called = log_every_n_impl.last_called || new Map();

  let last_record = log_every_n_impl.last_called[caller_line];

  if (last_record === undefined) {
    logger(...message);
    log_every_n_impl.last_called[caller_line] = [0, freq];
  } else {
    if (last_record[0] + 1 >= last_record[1]) {
      logger(...message);
      log_every_n_impl.last_called[caller_line] = [0, last_record[1]];
    } else {
      log_every_n_impl.last_called[caller_line] = [last_record[0] + 1, last_record[1]];
    }
  }
}

function log_every_ms_impl(period, logger, ...message) {
  let caller_line = (new Error).stack.split('\n')[2];
  // static collection of past periods.
  log_every_ms_impl.last_called = log_every_ms_impl.last_called || new Map();

  let last_record = log_every_ms_impl.last_called[caller_line];
  let current_ms = (new Date()).getTime();

  if (last_record === undefined) {
    logger(...message);
    log_every_ms_impl.last_called[caller_line] = [current_ms, period];
  } else {
    if (last_record[0] + last_record[1] < current_ms) {
      logger(...message);
      log_every_ms_impl.last_called[caller_line] = [current_ms, last_record[1]];
    }
  }
}

// probabilistic version, which:
//  - doesn't store the counter anywhere
//  - doesn't look at the stack
function log_maybe_impl(freq, logger, ...message) {
  if (Math.random() * freq < 1) {
    logger(...message);
  }
}

function log_every_ms(period, ...message) {
  log_every_ms_impl(period, console.log, ...message);
}

function log_every_n(freq, ...message) {
  log_every_n_impl(freq, console.log, ...message);
}

function log_maybe(freq, ...message) {
  log_maybe_impl(freq, console.log, ...message);
}

module.exports = {
  log_every_ms,
  log_every_n,
  log_maybe
};
