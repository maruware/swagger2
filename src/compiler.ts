// compiler.js

/*
 * Convert a swagger document into a compiled form so that it can be used by validator
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

import * as jsonValidator from 'is-my-json-valid';
import * as deref from 'json-schema-deref-sync';

import {Path, Document, Schema} from './schema';

export interface Compiled {
  (path: string): CompiledPath;
}

export interface CompiledSchema extends Schema {
  validator?: (value: any) => boolean;
}

export interface CompiledPath {
  regex: RegExp;
  path: Path;
  name: string;
  expected: string[];
}

export function compile(document: Document): Compiled {
  // get the de-referenced version of the swagger document
  let swagger = deref(document);

  // add a validator for every parameter in swagger document
  Object.keys(swagger.paths).forEach(pathName => {
    let path = swagger.paths[pathName];
    Object.keys(path).forEach(operationName => {
      let operation = path[operationName];
      (operation.parameters || []).forEach((parameter: CompiledSchema) => {
        parameter.validator = jsonValidator(parameter.schema || parameter);
      });
      Object.keys(operation.responses).forEach(statusCode => {
        let response = operation.responses[statusCode];
        if (response.schema) {
          response.validator = jsonValidator(response.schema);
        } else {
          // no schema, so ensure there is no response
          response.validator = (body: any) => body === undefined;
        }
      });
    });
  });

  let matcher: CompiledPath[] = Object.keys(swagger.paths)
    .map(name => {
      return {
        name,
        path: swagger.paths[name],
        regex: new RegExp(swagger.basePath + name.replace(/\{[^}]*}/g, '[^/]+') + '$'),
        expected: name.match(/[^\/]+/g)
      };
    });

  return (path: string) => {
    // get a list of matching paths, there should be only one
    let matches = matcher.filter(match => !!path.match(match.regex));
    if (matches.length === 1) {
      return matches[0];
    }
  };
}
