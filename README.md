[![Build Status](https://travis-ci.org/carlansley/swagger2.svg?branch=master)](https://travis-ci.org/carlansley/swagger2)
[![Coverage Status](https://coveralls.io/repos/github/carlansley/swagger2/badge.svg?branch=master)](https://coveralls.io/github/carlansley/swagger2?branch=master)

# swagger2
Loading, parsing and validating requests to HTTP services based on Swagger v2.0 documents.  It is designed to
run in environments with node v5.x and above.

## Installation

```shell
$ npm install swagger2 --save
```

## Usage

Basic loading and validation of swagger 2.0 document:

```
import * as swagger from 'swagger2';

// load YAML swagger file
const documnet = swagger.loadDocumentSync('./swagger.yml');

// validate document
if (!swagger.validateDocument(document)) {
  throw Error(`./swagger.yml does not conform to the Swagger 2.0 schema`);
}
```

You can compile the document for fast validation of operation requests and responses within
the framework of your choosing.  Koa 2 example:

```
let app = new Koa();

...
app.use(body());
app.use(createKoaMiddleware(document));
...


function createKoaMiddleware(document: swagger.Document) {

  // construct a validation object, pre-compiling all schema and regex required
  let compiled = swagger.compileDocument(document);

  return async(context, next) => {

    if (!context.path.startsWith(document.basePath)) {
      // not a path that we care about
      await next();
      return;
    }

    let compiledPath = compiled(context.path);
    if (compiledPath === undefined) {
      // if there is no single matching path, return 404 (not found)
      context.status = 404;
      return;
    }

    // check the request matches the swagger schema
    let validationErrors = swagger.validateRequest(compiledPath,
      context.method, context.request.query, context.request.body);
    if (validationErrors === undefined) {
      // operation not defined, return 405 (method not allowed)
      context.status = 405;
      return;
    }

    if (validationErrors.length > 0) {
      context.status = 400;
      context.body = {
        code: 'SWAGGER_REQUEST_VALIDATION_FAILED',
        errors: validationErrors
      };
      return;
    }

    // wait for the operation to execute
    await next();

    // check the response matches the swagger schema
    let error = swagger.validateResponse(compiledPath, context.method, context.status, context.body);
    if (error) {
      error.where = 'response';
      context.status = 500;
      context.body = {
        code: 'SWAGGER_RESPONSE_VALIDATION_FAILED',
        errors: [error]
      };
    }
  };
}


```

## Limitations

* requires node v5.4 or above
* currently only supports synchronous loading (via swagger.loadDocumentSync)
* does not support all Swagger 2.0 features (e.g. files)
* swagger2 is written in Typescript 1.8+, targeting ES6.  Recommended to run in an environment with the following nodejs parameters:

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
