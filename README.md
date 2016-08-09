# debuk

>Debug and performance test your code with a minimum setup

[![NPM
version](http://img.shields.io/npm/v/debuk.svg?style=flat-square)](https://www.npmjs.com/package/debuk)
[![NPM
downloads](http://img.shields.io/npm/dm/debuk.svg?style=flat-square)](https://www.npmjs.com/package/debuk)
[![Build
Status](http://img.shields.io/travis/udnisap/debuk/master.svg?style=flat-square)](https://travis-ci.org/udnisap/debuk)
[![Codecov](https://img.shields.io/codecov/c/github/udnisap/debuk.svg)](https://codecov.io/gh/udnisap/debuk)
[![Dependency
Status](http://img.shields.io/david/udnisap/debuk.svg?style=flat-square)](https://david-dm.org/udnisap/debuk)
## How to Install

### Node

```sh
$ npm install --save-dev debuk
```
in the code
```js
import Debuk from 'debuk';
var Debuk = require('debuk');
```

### Browser(UMD)
This can be directly included into client side without any dependencies via
```html
<!--- latest version --->
<script src='https://npmcdn.com/debuk/dist/debuk.js'>
<!--- minified version --->
<script src='https://npmcdn.com/debuk/dist/debuk.min.js'>

<!--- a specific version --->
<script src='https://npmcdn.com/debuk@1.0.0/dist/debuk.js'>

<script>
var Debuk = debuk.default;
</script>
```
you can also download source from the
[Releases](https://github.com/udnisap/debuk/releases)

### Browser
If you are using any dependency management system like webpack or browserify,
you can use the [Node import](#node)


## Usage
Debuk is a wrapper to any function. You can simply wrap any function with
`Debuk` and you can use it to check different runtime behaviours of that
function.

```js
const myFun = function MyFun(){
// implementation
}

// Wrap the method with Debuk
const myFun = Debuk(function MyFun(){
// implementation
});
```

### Simple example (Number of method calls)

```js
var mySum = function mySum(a, b){
  return a + b;
};

var list = [1,2,3,4,5,6];
list
  .map(i => mySum(i, 5))
  .reduce((a,i)=> mySum(a + 2, mySum(i, 5)));
```
Can you guess the number of mySum calls in the the above code and the parameters
each were called with?
Change the code above to wrap mySum with Debuk as below and you can view them on
your browser console alone with the time it took to execute each function.

```js
var mySum = Debuk(function mySum(a, b){
  return a + b;
});
```
```sh
//Console output
mySum: 0.182ms
mySum params 1,5 => 6
mySum: 0.103ms
mySum params 2,5 => 7
mySum: 0.076ms
mySum params 3,5 => 8
mySum: 0.076ms
mySum params 4,5 => 9
mySum: 0.075ms
mySum params 5,5 => 10
mySum: 0.073ms
mySum params 6,5 => 11
mySum: 0.074ms
mySum params 7,5 => 12
mySum: 0.076ms
mySum params 8,12 => 20
mySum: 0.070ms
mySum params 8,5 => 13
mySum: 0.073ms
mySum params 22,13 => 35
mySum: 0.077ms
mySum params 9,5 => 14
mySum: 0.072ms
mySum params 37,14 => 51
mySum: 0.073ms
mySum params 10,5 => 15
mySum: 0.071ms
mySum params 53,15 => 68
mySum: 0.074ms
mySum params 11,5 => 16
mySum: 0.075ms
mySum params 70,16 => 86
mySum count: 16
```
Check [JSBin](https://jsbin.com/baxupum/edit?html,js)

### Console.count does the samething
Well in case you didnt know you can use `console.count` to do the samething. But
what is more about Debuk is that it does the count per execution cycle not
global. So it will show how many times the method was used for that execution
cycle. In most of the cases you want to check what happens when on a particular
state. (When the user clicks on this button how many times this method was
called). Debuk is ideal for that. 

## API
```js
debuk(fn, options)
```
####fn
function to be wrapped
####options
options to debuk. 
defaults are 
```js
  {  
    name: 'Anonymous',
    params: false,
    time: true,
    trace: false,
    profile: false,
    promise: true,
    count: true,
  }
```

## Contributions
- We use sementic versioning and each build will trigger a version based on the
  commit message. 
- 100% test coverage.

## Roadmap
- [x] Functions returning promises
- [ ] Add ES6 Decorator support
- [ ] Add support for ES6 Classes
- [ ] Performance statistics calculation (Mean / SD / Average)

## License

MIT © 2016 

`
