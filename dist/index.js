/// <reference path="../typings/tsd.d.ts" />
var ts = require("typescript");
var fs = require("fs");
var _ = require("lodash");
var AssertionError = require("assertion-error");
var defaultCompilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    target: 1 /* ES5 */,
    module: 1 /* CommonJS */
};
function handleDiagnostics(type, diagnostics) {
    diagnostics.forEach(function (diagnostic) {
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        throw new AssertionError(type + ": " + diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message, {
            actual: diagnostic
        });
    });
}
function compile(fileNames, options, done) {
    var program = ts.createProgram(fileNames, options);
    handleDiagnostics('Declaration', program.getDeclarationDiagnostics());
    handleDiagnostics('Global', program.getGlobalDiagnostics());
    handleDiagnostics('Semantic', program.getSemanticDiagnostics());
    handleDiagnostics('Syntactic', program.getSyntacticDiagnostics());
    done();
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
    walk(path, filter, function (err, results) {
        if (err) {
            throw new AssertionError('Error while walking directory for files.', {
                actual: err
            });
            done();
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
