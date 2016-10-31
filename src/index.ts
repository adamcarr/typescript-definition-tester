/// <reference path="../typings/tsd.d.ts" />

import * as ts from "typescript";
import * as fs from "fs";
import * as _ from "lodash";
import AssertionError = require("assertion-error");

var defaultCompilerOptions: ts.CompilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
};

function handleDiagnostics(type: string, diagnostics: ts.Diagnostic[]) {
    diagnostics.forEach(diagnostic => {
        var { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        throw new AssertionError(`${type}: ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`, {
            actual: diagnostic
        });
    });
}

export function compile(fileNames: string[], options: ts.CompilerOptions, done: Function): void {
    var program = ts.createProgram(fileNames, options);
    
    // TODO: this is generating errors so disabling for now. Will continue to investigate.
    // handleDiagnostics('Declaration', program.getDeclarationDiagnostics());
    handleDiagnostics('Global', program.getGlobalDiagnostics());
    handleDiagnostics('Semantic', program.getSemanticDiagnostics());
    handleDiagnostics('Syntactic', program.getSyntacticDiagnostics());

    done();
}

export function compileDirectory(path: string, done: Function): void;
export function compileDirectory(path: string, options: ts.CompilerOptions, done: Function): void;
export function compileDirectory(path: string, filter: (fileName: string) => boolean, done: Function): void;
export function compileDirectory(path: string, filter: (fileName: string) => boolean, options: ts.CompilerOptions, done: Function): void;
export function compileDirectory(path: string, filter?: any, options?: any, done?: Function): void {
    if (!done) {
        if (!options) {
            done = filter;
            filter = undefined;
        } else {
            done = options;
            if (!_.isFunction(filter)) {
                options = filter;
                options = undefined;
            }
        }
    }

    options = _.merge(defaultCompilerOptions, (options || {}));

    walk(path, filter, (err, results) => {
        if (err) {
            console.log('error error error')
            throw new AssertionError('Error while walking directory for files.', {
                actual: err
            });
        } else {
            compile(results, options, done);
        }
    });
}

export function walk(dir: string, done: (err: any, results?: string[]) => void): void;
export function walk(dir: string, filter: (fileName: string) => boolean, done: (err: any, results?: string[]) => void): void;
export function walk(dir: string, filter?: (fileName: string) => boolean, done?: (err: any, results?: string[]) => void): void {
    if (!done) {
        done = filter;
        filter = undefined;
    }

    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) {
            return done(err);
        }
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if (!filter || filter(file)) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
};
