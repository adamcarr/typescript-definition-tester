/// <reference path="../typings/tsd.d.ts" />
import * as ts from "typescript";
export declare function compile(fileNames: string[], options: ts.CompilerOptions, done: Function): void;
export declare function compileDirectory(path: string, done: Function): void;
export declare function compileDirectory(path: string, options: ts.CompilerOptions, done: Function): void;
export declare function compileDirectory(path: string, filter: (fileName: string) => boolean, done: Function): void;
export declare function compileDirectory(path: string, filter: (fileName: string) => boolean, options: ts.CompilerOptions, done: Function): void;
export declare function walk(dir: string, done: (err: any, results?: string[]) => void): void;
export declare function walk(dir: string, filter: (fileName: string) => boolean, done: (err: any, results?: string[]) => void): void;
