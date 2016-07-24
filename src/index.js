/**
 * debuk
 *
 * Copyright © 2016 . All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const defaults = {
  name: 'Anonymous',
  params: false,
  time: true,
  trace: false,
  profile: false,
  count: true,
  _console: console,
};

const notSupportedWarning = (method) => console.warn(`${method} is not currently supported in this environment`) ;
const debuk = (fn, options = {}) => {
  const {
    name,
    params,
    time,
    trace,
    profile,
    count,
    _console,
  } = Object.assign({}, defaults, { name: fn.name }, options);

  _console.profile = profile && _console.profile || (() => notSupportedWarning('console.profile'));
  _console.profileEnd = profile && _console.profileEnd || (() => {});
  _console.trace = trace && _console.trace || (() => notSupportedWarning('console.trace'));

  let callCount = 0;
  const clearCount = () => setTimeout(
    () => {
      callCount && count && _console.log(`${name} count: ${callCount}`);
      callCount = 0;
    },
    0
  );
  return (...args) => {
    // Setup
    trace && _console.trace(fn);
    count && ++callCount && clearCount();
    profile && _console.profile(name);
    time && _console.time(name);

    const results = fn(...args);

    // Windup
    time && _console.timeEnd(name);
    profile && _console.profileEnd(name);
    params && _console.log(`${name} params ${args} ${results}`);

    return results;
  };
};

export default debuk;

