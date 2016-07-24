/**
 * debuk
 *
 * Copyright © 2016 . All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
/* eslint-env mocha */
import chai, { expect } from 'chai';
import debuk from '../src/index.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('debuk', () => {
  it('Should return the called function when executed', () => {
    const mockedConsole = {
      log: sinon.spy(),
      count: sinon.spy(),
      time: sinon.spy(),
      timeEnd: sinon.spy(),
    };

    const myFn = (a, b) => a + b;
    const prefFn = debuk(myFn, { 
      params: true,
      name: 'test', 
      _console: mockedConsole,
      trace: true,
      profile: true,
    });
    const args = [
      [1, 3],
      [-3, 4],
    ];
    args.forEach(input => {
      expect(myFn(input)).to.be.equal(prefFn(input));
    });
    expect(mockedConsole.time).have.been.callCount(args.length);
    expect(mockedConsole.log).have.been.callCount(args.length);
  });

  it('Should call with this binding', () => {
    let fnFromDifferentContext;

    // issolated context
    (() => {
      const glb = 5;
      fnFromDifferentContext = () => glb;
    })();

    const prefFn = debuk(fnFromDifferentContext);
    expect(prefFn()).to.be.equal(5);
  });
});
