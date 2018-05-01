"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const _ = require("lodash");
const AssertionError = require("assertion-error");
var defaultCompilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
};
function handleDiagnostics(type, diagnostics) {
    diagnostics.forEach(diagnostic => {
        var { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        throw new AssertionError(`${type}: ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`, {
            actual: diagnostic
        });
    });
}
function compile(fileNames, options, done) {
    try {
        const program = ts.createProgram(fileNames, options);
        // TODO: this is generating errors so disabling for now. Will continue to investigate.
        // handleDiagnostics('Declaration', program.getDeclarationDiagnostics());
        handleDiagnostics('Global', program.getGlobalDiagnostics());
        console.log('Global finished');
        handleDiagnostics('Semantic', program.getSemanticDiagnostics());
        console.log('Semantic finished');
        handleDiagnostics('Syntactic', program.getSyntacticDiagnostics());
        console.log('Syntactic finished');
        done();
    }
    catch (e) {
        done(e);
    }
}
exports.compile = compile;
function compileDirectory(path, filter, options, done) {
    if (!done) {
        if (!options) {
            done = filter;
            filter = undefined;
        }
        else {
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
            console.log('error error error');
            throw new AssertionError('Error while walking directory for files.', {
                actual: err
            });
        }
        else {
            compile(results, options, done);
        }
    });
}
exports.compileDirectory = compileDirectory;
function walk(dir, filter, done) {
    if (!done) {
        done = filter;
        filter = undefined;
    }
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) {
            return done(err);
        }
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file)
                return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                }
                else {
                    if (!filter || filter(file)) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
}
exports.walk = walk;
;
