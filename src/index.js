/**
 * debuk
 *
 * Copyright © 2016 . All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import defer from 'lodash/defer';
import once from 'lodash/once';

const defaults = {
  name: 'Anonymous',
  params: false,
  time: true,
  trace: false,
  profile: false,
  count: true,
  _console: console,
};

const notSupportedWarning = (method) =>
 console.warn(`${method} is not supported in this environment`); // eslint-disable-line no-console

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
  const clearCount = () => {
    callCount && count && _console.log(`${name} count: ${callCount}`);
    callCount = 0;
  };

  const beforeEach = (args) => { // eslint-disable-line no-unused-vars
    trace && _console.trace(fn);
    count && ++callCount && clearCount();
    time && _console.time(name);
    profile && _console.profile(name);
  };

  const afterEach = (args, result) => {
    profile && _console.profileEnd(name);
    time && _console.timeEnd(name);
    params && _console.log(`${name} params ${args} => ${result}`);
  };

  const afterTick = (...data) => defer((args, result) => { // eslint-disable-line no-unused-vars
    count && clearCount();
    afterTickOnce = once(afterTick); // eslint-disable-line no-use-before-define
  }, ...data);
  let afterTickOnce = once(afterTick);

  return (...args) => {
    // Setup
    beforeEach(args);

    const result = fn(...args);

    afterEach(args, result);
    afterTickOnce(args, result);
    return result;
  };
};

export default debuk;

