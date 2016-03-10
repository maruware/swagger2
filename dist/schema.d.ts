export declare type ParameterType = 'query' | 'path' | 'body';
export declare type DataType = 'string' | 'number' | 'integer' | 'boolean';
export declare type DataFormat = 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
export interface Schema {
    type: DataType;
    format: DataFormat;
    schema: any;
}
export interface Parameter extends Schema {
    name: string;
    in: ParameterType;
}
export interface Response extends Schema {
    description: string;
}
export interface Operation {
    summary: string;
    parameters: Parameter[];
    responses: {
        [statusCode: string]: Response;
    };
}
export interface Path {
    [method: string]: Operation;
}
export interface Info {
    title: string;
    version: string;
}
export interface Document {
    swagger: '2.0';
    info: Info;
    basePath?: string;
    paths: {
        [path: string]: Path;
    };
}
