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
import isClass from 'is-class';

export const defaults = {
  name: 'Anonymous',
  params: false,
  time: true,
  trace: false,
  profile: false,
  count: true,
  promise: true,
  console,
  TEMPLATE: {
    params: (name, args, result) => [`${name} params `, args, ' => ', result],
    count: (name, callCount) => `${name} count: ${callCount}`,
    notSupported: (method) =>
      `${method} is not supported in this environment`, // eslint-disable-line no-console


  },
};

function isPromise(val) {
  return val && typeof val.then === 'function';
}

const debukWrap = (fn, options = {}, bindThis = false) => {
  const {
    name,
    params,
    time,
    trace,
    profile,
    promise,
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

  return function (...args) { // eslint-disable-line func-names
    // Setup
    beforeEach(args);

    const Func = fn;
    let result;
    if (isClass(fn)) {
      result = new Func(...args);
    } else {
      result = bindThis ? fn.bind(this)(...args) : fn(...args);
    }

    if (isPromise(result) && promise) {
      result.then(promiseResult => {
        afterEach(args, promiseResult);
        afterTickOnce(args, result);
      });
    } else {
      afterEach(args, result);
      afterTickOnce(args, result);
    }
    return result;
  };
};

const debuk = (...args1) => {
  if (args1.length === 0) {
    args1.push({}); // add default options
  }
  if (args1.length === 1) {
    if (typeof(args1[0]) === 'object') { // options as first argument - debuk called as decorator
      const options = args1[0];
      return (...args2) => {
        if (args2.length === 1) { // debuk called as class decorator
          return debukWrap(args2[0], options);
        }
        // debuk called as property decorator
        const [target, key, descriptor] = args2; // eslint-disable-line no-unused-vars
        descriptor.value = debukWrap(descriptor.value, options, true);
        return descriptor;
      };
    }
  }
  // debuk called as function
  return debukWrap(...args1);
};

export default debuk;

