import { Path, Document, Schema } from './schema';
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
export declare function compile(document: Document): Compiled;
