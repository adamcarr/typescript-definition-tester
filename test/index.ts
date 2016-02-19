/// <reference path="../typings/tsd.d.ts" />

import * as ts from "typescript";
import * as tt from "../src/index";
import * as fs from "fs";

describe('ambient declaration tests', () => {
    it('should compile examples successfully against typescript-definition-tester.d.ts', (done) => {
        tt.compileDirectory(
            './test/examples',
            (fileName: string) => fileName.indexOf('.ts') > -1,
            () => done()
            );
    });
});
