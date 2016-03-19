import { CompiledPath } from './compiler';
export interface ValidationError {
    where?: string;
    name?: string;
    actual: any;
    expected: any;
}
export declare function request(compiledPath: CompiledPath, method: string, query?: any, body?: any): ValidationError[];
export declare function response(compiledPath: CompiledPath, method: string, status: number, body?: any): ValidationError;
