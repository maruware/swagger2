[![Build Status](https://travis-ci.org/carlansley/swagger2.svg?branch=master)](https://travis-ci.org/carlansley/swagger2)
[![Coverage Status](https://coveralls.io/repos/github/carlansley/swagger2/badge.svg?branch=master)](https://coveralls.io/github/carlansley/swagger2?branch=master)

# swagger2
Loading, parsing and validating requests to HTTP services based on Swagger v2.0 documents.  It is designed to
run in environments with node v5.x and above.

## Installation

```shell
$ npm install swagger2 --save
```

## Limitations

* requires node v5.4 or above
* swagger2 is written in Typescript 1.8+, targeting ES6.  It must be run with the following nodejs parameters:

```shell
node --harmony --harmony_default_parameters --harmony_destructuring
```

## Development

First, grab the source from <a href="https://github.com/carlansley/swagger2">GitHub</a>.

From within the swagger2 directory, to run tests:

```shell
$ npm install
$ npm test
```

To see code coverage in a web-browser:

```shell
$ npm run cover:browser
```

To clean up:

```shell
$ npm run clean
```

## License

MIT
