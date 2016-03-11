// document.spec.ts

/*
 The MIT License

 Copyright (c) 2014-2016 Carl Ansley

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import * as assert from 'assert';
import * as document from './document';
import * as schema from './schema';

/* tslint:disable:max-line-length */

const MINIMAL_SWAGGER_DOCUMENT: schema.Document = {
  swagger: '2.0',
  info: {
    title: '',
    version: ''
  },
  paths: {}
};

const PETSTORE_DOCUMENT: schema.Document = {
  swagger: '2.0',
  info: {'version': '1.0.0', 'title': 'Swagger Petstore', 'license': {'name': 'MIT'}},
  host: 'petstore.swagger.io',
  basePath: '/v1',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/pets': {
      'get': {
        'summary': 'List all pets',
        'operationId': 'listPets',
        'tags': ['pets'],
        'parameters': [{
          'name': 'limit',
          'in': 'query',
          'description': 'How many items to return at one time (max 100)',
          'required': false,
          'type': 'integer',
          'format': 'int32'
        }],
        'responses': {
          '200': {
            'description': 'An paged array of pets',
            'headers': {'x-next': {'type': 'string', 'description': 'A link to the next page of responses'}},
            'schema': {'$ref': '#/definitions/Pets'}
          }, 'default': {'description': 'unexpected error', 'schema': {'$ref': '#/definitions/Error'}}
        }
      },
      'post': {
        'summary': 'Create a pet',
        'operationId': 'createPets',
        'tags': ['pets'],
        'responses': {
          '201': {'description': 'Null response'},
          'default': {'description': 'unexpected error', 'schema': {'$ref': '#/definitions/Error'}}
        }
      }
    },
    '/pets/{petId}': {
      'get': {
        'summary': 'Info for a specific pet',
        'operationId': 'showPetById',
        'tags': ['pets'],
        'parameters': [{
          'name': 'petId',
          'in': 'path',
          'required': true,
          'description': 'The id of the pet to retrieve',
          'type': 'string'
        }],
        'responses': {
          '200': {
            'description': 'Expected response to a valid request',
            'schema': {'$ref': '#/definitions/Pets'}
          }, 'default': {'description': 'unexpected error', 'schema': {'$ref': '#/definitions/Error'}}
        }
      }
    }
  },
  definitions: {
    'Pet': {
      'required': ['id', 'name'],
      'properties': {
        'id': {'type': 'integer', 'format': 'int64'},
        'name': {'type': 'string'},
        'tag': {'type': 'string'}
      }
    },
    'Pets': {'type': 'array', 'items': {'$ref': '#/definitions/Pet'}},
    'Error': {
      'required': ['code', 'message'],
      'properties': {'code': {'type': 'integer', 'format': 'int32'}, 'message': {'type': 'string'}}
    }
  }
};

const API_WITH_EXAMPLES_DOCUMENT: schema.Document = {
  'swagger': '2.0',
  'info': {'title': 'Simple API overview', 'version': 'v2'},
  'paths': {
    '/': {
      'get': {
        'operationId': 'listVersionsv2',
        'summary': 'List API versions',
        'produces': ['application/json'],
        'responses': {
          '200': {
            'description': '200 300 response',
            'examples': {'application/json': '{\n    "versions": [\n        {\n            "status": "CURRENT",\n            "updated": "2011-01-21T11:33:21Z",\n            "id": "v2.0",\n            "links": [\n                {\n                    "href": "http://127.0.0.1:8774/v2/",\n                    "rel": "self"\n                }\n            ]\n        },\n        {\n            "status": "EXPERIMENTAL",\n            "updated": "2013-07-23T11:33:21Z",\n            "id": "v3.0",\n            "links": [\n                {\n                    "href": "http://127.0.0.1:8774/v3/",\n                    "rel": "self"\n                }\n            ]\n        }\n    ]\n}'}
          },
          '300': {
            'description': '200 300 response',
            'examples': {'application/json': '{\n    "versions": [\n        {\n            "status": "CURRENT",\n            "updated": "2011-01-21T11:33:21Z",\n            "id": "v2.0",\n            "links": [\n                {\n                    "href": "http://127.0.0.1:8774/v2/",\n                    "rel": "self"\n                }\n            ]\n        },\n        {\n            "status": "EXPERIMENTAL",\n            "updated": "2013-07-23T11:33:21Z",\n            "id": "v3.0",\n            "links": [\n                {\n                    "href": "http://127.0.0.1:8774/v3/",\n                    "rel": "self"\n                }\n            ]\n        }\n    ]\n}'}
          }
        }
      }
    },
    '/v2': {
      'get': {
        'operationId': 'getVersionDetailsv2',
        'summary': 'Show API version details',
        'produces': ['application/json'],
        'responses': {
          '200': {
            'description': '200 203 response',
            'examples': {'application/json': '{\n    "version": {\n        "status": "CURRENT",\n        "updated": "2011-01-21T11:33:21Z",\n        "media-types": [\n            {\n                "base": "application/xml",\n                "type": "application/vnd.openstack.compute+xml;version=2"\n            },\n            {\n                "base": "application/json",\n                "type": "application/vnd.openstack.compute+json;version=2"\n            }\n        ],\n        "id": "v2.0",\n        "links": [\n            {\n                "href": "http://127.0.0.1:8774/v2/",\n                "rel": "self"\n            },\n            {\n                "href": "http://docs.openstack.org/api/openstack-compute/2/os-compute-devguide-2.pdf",\n                "type": "application/pdf",\n                "rel": "describedby"\n            },\n            {\n                "href": "http://docs.openstack.org/api/openstack-compute/2/wadl/os-compute-2.wadl",\n                "type": "application/vnd.sun.wadl+xml",\n                "rel": "describedby"\n            },\n            {\n              "href": "http://docs.openstack.org/api/openstack-compute/2/wadl/os-compute-2.wadl",\n              "type": "application/vnd.sun.wadl+xml",\n              "rel": "describedby"\n            }\n        ]\n    }\n}'}
          },
          '203': {
            'description': '200 203 response',
            'examples': {'application/json': '{\n    "version": {\n        "status": "CURRENT",\n        "updated": "2011-01-21T11:33:21Z",\n        "media-types": [\n            {\n                "base": "application/xml",\n                "type": "application/vnd.openstack.compute+xml;version=2"\n            },\n            {\n                "base": "application/json",\n                "type": "application/vnd.openstack.compute+json;version=2"\n            }\n        ],\n        "id": "v2.0",\n        "links": [\n            {\n                "href": "http://23.253.228.211:8774/v2/",\n                "rel": "self"\n            },\n            {\n                "href": "http://docs.openstack.org/api/openstack-compute/2/os-compute-devguide-2.pdf",\n                "type": "application/pdf",\n                "rel": "describedby"\n            },\n            {\n                "href": "http://docs.openstack.org/api/openstack-compute/2/wadl/os-compute-2.wadl",\n                "type": "application/vnd.sun.wadl+xml",\n                "rel": "describedby"\n            }\n        ]\n    }\n}'}
          }
        }
      }
    }
  },
  'consumes': ['application/json']
};

const PETSTORE_SEPARATE_DOCUMENT: schema.Document = {
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'title': 'Swagger Petstore',
    'description': 'A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification',
    'termsOfService': 'http://helloreverb.com/terms/',
    'contact': {'name': 'Wordnik API Team', 'email': 'foo@example.com', 'url': 'http://madskristensen.net'},
    'license': {'name': 'MIT', 'url': 'http://github.com/gruntjs/grunt/blob/master/LICENSE-MIT'}
  },
  'host': 'petstore.swagger.wordnik.com',
  'basePath': '/api',
  'schemes': ['http'],
  'consumes': ['application/json'],
  'produces': ['application/json'],
  'paths': {
    '/pets': {
      'get': {
        'description': 'Returns all pets from the system that the user has access to\nNam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.\n\nSed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.\n',
        'operationId': 'findPets',
        'parameters': [{'$ref': 'parameters.yaml#/tagsParam'}, {'$ref': 'parameters.yaml#/limitsParam'}],
        'responses': {
          '200': {
            'description': 'pet response',
            'schema': {'type': 'array', 'items': {'$ref': 'Pet.yaml'}}
          }, 'default': {'description': 'unexpected error', 'schema': {'$ref': '../common/Error.yaml'}}
        }
      },
      'post': {
        'description': 'Creates a new pet in the store.  Duplicates are allowed',
        'operationId': 'addPet',
        'parameters': [{
          'name': 'pet',
          'in': 'body',
          'description': 'Pet to add to the store',
          'required': true,
          'schema': {'$ref': 'NewPet.yaml'}
        }],
        'responses': {
          '200': {'description': 'pet response', 'schema': {'$ref': 'Pet.yaml'}},
          'default': {'description': 'unexpected error', 'schema': {'$ref': '../common/Error.yaml'}}
        }
      }
    },
    '/pets/{id}': {
      'get': {
        'description': 'Returns a user based on a single ID, if the user does not have access to the pet',
        'operationId': 'find pet by id',
        'parameters': [{
          'name': 'id',
          'in': 'path',
          'description': 'ID of pet to fetch',
          'required': true,
          'type': 'integer',
          'format': 'int64'
        }],
        'responses': {
          '200': {'description': 'pet response', 'schema': {'$ref': 'Pet.yaml'}},
          'default': {'description': 'unexpected error', 'schema': {'$ref': '../common/Error.yaml'}}
        }
      },
      'delete': {
        'description': 'deletes a single pet based on the ID supplied',
        'operationId': 'deletePet',
        'parameters': [{
          'name': 'id',
          'in': 'path',
          'description': 'ID of pet to delete',
          'required': true,
          'type': 'integer',
          'format': 'int64'
        }],
        'responses': {
          '204': {'description': 'pet deleted'},
          'default': {'description': 'unexpected error', 'schema': {'$ref': '../common/Error.yaml'}}
        }
      }
    }
  }
};


const TEST_YAML_DIR = __dirname + '/../test/yaml/';

function load(name: string) {
  // if (name.indexOf('petstore-expanded') !== -1) {
  //   console.log(name);
  //   console.log(JSON.stringify(document.loadDocumentSync(TEST_YAML_DIR + name)))
  // }

  return document.loadDocumentSync(TEST_YAML_DIR + name);
}

function validate(raw: any): schema.Document {
  return document.validateDocument(raw);
}

function ok(expected: schema.Document, name: string) {
  return assert.deepEqual(expected, validate(load(name)));
}

describe('document', () => {

  describe('loadDocumentSync', () => {

    it('does not load invalid YAML', () => assert.throws(() => load('petstore-invalid.yaml')));
    it('load valid YAML', () => assert.ok(load('petstore.yaml')));

  });

  describe('validateDocument', () => {
    it('fail validation on empty object', done => {
      assert.equal(document.validateDocument({}), undefined);
      done();
    });

    it('succeed validation on minimal Swagger v2.0 documents', () => {
      assert.deepEqual(document.validateDocument(MINIMAL_SWAGGER_DOCUMENT), MINIMAL_SWAGGER_DOCUMENT);
    });

    it('succeeds validation on petstore', () => ok(PETSTORE_DOCUMENT, 'petstore.yaml'));
    it('succeeds validation on petstore-separate', () => ok(PETSTORE_SEPARATE_DOCUMENT, 'petstore-separate/spec/swagger.yaml'));
    it('succeed validation on api-with-examples', () => ok(API_WITH_EXAMPLES_DOCUMENT, 'api-with-examples.yaml'));
    it('succeed validation on petstore-expanded', () => assert.ok(validate(load('petstore-expanded.yaml'))));
    it('succeed validation on uber', () => assert.ok(validate(load('uber.yaml'))));

    // TODO work out if these are invalid or not, see https://github.com/jeremyfa/yaml.js/issues/57
    // it('succeed validation on petstore-minimal', () => assert.ok(validate(load('petstore-minimal.yaml'))));
    // it('succeed validation on petstore-simple', () => assert.ok(validate(load('petstore-simple.yaml'))));
    // it('succeed validation on petstore-with-external-docs', () => assert.ok(validate(load('petstore-with-external-docs.yaml'))));

  });


});
