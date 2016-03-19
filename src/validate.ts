// validate.js

/*
 * Validate requests and responses in a web framework-neutral way
 */

/*
 The MIT License

 Copyright (c) 2014-2016 Carl Ansley

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import {CompiledPath, CompiledDefinition} from './compiler';

export interface ValidationError {
  where?: string;
  name?: string;
  actual: any;
  expected: any;
}


function validate(value: any, schema: CompiledDefinition): ValidationError {
  let valid = schema.validator(value);
  if (!valid) {
    let error: ValidationError = {
      actual: value,
      expected: {
        schema: schema.schema,
        type: schema.type,
        format: schema.format
      }
    };

    if (error.expected.schema === undefined) {
      delete error.expected.schema;
    }
    if (error.expected.type === undefined) {
      delete error.expected.type;
    }
    if (error.expected.format === undefined) {
      delete error.expected.format;
    }
    return error;
  }
}

export function request(compiledPath: CompiledPath, method: string, query?: any, body?: any): ValidationError[] {

  // get operation object for path and method
  let operation = compiledPath.path[method.toLowerCase()];

  if (operation === undefined) {
    // operation not defined, return 405 (method not allowed)
    return undefined;
  }

  let parameters = operation.parameters;
  let validationErrors: ValidationError[] = [], bodyDefined = false;

  // check all the parameters match swagger schema
  if (parameters === undefined) {

    let error = validate(body, {validator: (value: any) => value === undefined});
    if (error !== undefined) {
      error.where = 'body';
      validationErrors.push(error);
    }

    if (query !== undefined && Object.keys(query).length > 0) {
      Object.keys(query).forEach(key => {
        validationErrors.push({
          where: 'query',
          name: key,
          actual: query[key],
          expected: {}
        });
      });
    }

    return validationErrors;
  }

  parameters.forEach(parameter => {

    let value: any;
    switch (parameter.in) {
      case 'query':
        value = (query || {})[parameter.name];
        break;
      case 'path':
        let actual = compiledPath.name.match(/[^\/]+/g);
        let valueIndex = compiledPath.expected.indexOf('{' + parameter.name + '}');

        value = actual[valueIndex];

        if (valueIndex === -1 || valueIndex >= actual.length) {
          throw Error(`Cannot obtain path parameter ${parameter.name} from ${compiledPath}`);
        }
        break;
      case 'body':
        value = body;
        bodyDefined = true;
        break;
      default:
      // do nothing
    }

    let error = validate(value, parameter);
    if (error !== undefined) {
      error.where = parameter.in;
      validationErrors.push(error);
    }
  });

  // ensure body is undefined if no body schema is defined
  if (!bodyDefined && body !== undefined) {
    let error = validate(body, {validator: (value: any) => value === undefined});
    if (error !== undefined) {
      error.where = 'body';
      validationErrors.push(error);
    }
  }

  return validationErrors;
}


export function response(compiledPath: CompiledPath, method: string, status: number, body?: any): ValidationError {
  let operation = compiledPath.path[method.toLowerCase()];

  // check the response matches the swagger schema
  let response = operation.responses[status];
  if (response === undefined) {
    response = operation.responses['default'];
  }

  return validate(body, response);
}
