import { PathItem, Document, Definition } from './schema';
export interface Compiled {
    (path: string): CompiledPath;
}
export interface CompiledDefinition extends Definition {
    validator?: (value: any) => boolean;
}
export interface CompiledPath {
    regex: RegExp;
    path: PathItem;
    name: string;
    expected: string[];
}
export declare function compile(document: Document): Compiled;
