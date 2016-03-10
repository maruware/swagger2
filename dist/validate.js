// validate.js
"use strict";
function validate(value, schema) {
    let valid = schema.validator(value);
    if (!valid) {
        return {
            actual: value,
            expected: {
                schema: schema.schema,
                type: schema.type,
                format: schema.format
            }
        };
    }
}
function request(compiledPath, method, query, body) {
    // get operation object for path and method
    let operation = compiledPath.path[method.toLowerCase()];
    if (operation === undefined) {
        // operation not defined, return 405 (method not allowed)
        return undefined;
    }
    let parameters = operation.parameters;
    // check all the parameters match swagger schema
    if (parameters === undefined) {
        return [];
    }
    let validationErrors = [];
    parameters.forEach(parameter => {
        let value;
        switch (parameter.in) {
            case 'query':
                value = query[parameter.name];
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
                break;
            default:
        }
        let error = validate(value, parameter);
        if (error !== undefined) {
            error.where = parameter.in;
            validationErrors.push(error);
        }
    });
    return validationErrors;
}
exports.request = request;
function response(compiledPath, method, status, body) {
    let operation = compiledPath.path[method.toLowerCase()];
    // check the response matches the swagger schema
    let response = operation.responses[status];
    if (response === undefined) {
        response = operation.responses['default'];
    }
    return validate(body, response);
}
exports.response = response;
//# sourceMappingURL=validate.js.map