/**
 * debuk
 *
 * Copyright © 2016 . All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import defer from 'lodash.defer';
import once from 'lodash.once';

export const defaults = {
  name: 'Anonymous',
  params: false,
  time: true,
  trace: false,
  profile: false,
  count: true,
  console,
  TEMPLATE: {
    params: (name, args, result) => [`${name} params `, args, ' => ', result],
    count: (name, callCount) => `${name} count: ${callCount}`,
    notSupported: (method) =>
      `${method} is not supported in this environment`, // eslint-disable-line no-console


  },
};

const debuk = (fn, options = {}) => {
  const {
    name,
    params,
    time,
    trace,
    profile,
    count,
    console: _console,
    TEMPLATE,
  } = Object.assign({}, defaults, { name: fn.name }, options);

  _console.profile = _console.profile ||
    (() => _console.warn(TEMPLATE.notSupported('console.profile')));
  _console.profileEnd = _console.profileEnd || (() => {});
  _console.trace = _console.trace || (() => _console.warn(TEMPLATE.notSupported('console.trace')));

  let callCount = 0;

  const beforeEach = (args) => { // eslint-disable-line no-unused-vars
    trace && _console.trace(fn);
    count && ++callCount;
    time && _console.time(name);
    profile && _console.profile(name);
  };

  const afterEach = (args, result) => {
    profile && _console.profileEnd(name);
    time && _console.timeEnd(name);
    params && _console.log(...TEMPLATE.params(name, args, result));
  };

  const afterTick = (...data) => defer((args, result) => { // eslint-disable-line no-unused-vars
    if (count) {
      _console.log(TEMPLATE.count(name, callCount));
      callCount = 0;
    }
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

