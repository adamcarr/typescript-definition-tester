# Purpose

The purpose of this repository is to wrap the TypeScript compiler so that a consumer can easily test their ambient module declarations against example *.ts files.
This module uses chai assertions so that a user can easily add this step to existing unit test infrastructure.

## Install

* Add typescript-definition-tester to your devDependencies property in your package.json file
```
npm install typescript-definition-tester --save-dev
```
* [optional] Link the typescript-definition-tester.d.ts file using tsd `tsd link --save`

## Testing

The recommended way to test ambient module declarations is to create an "examples" directory in your test folder. Then, you can pull in these *.ts example files 
in a single test file that will pass these files to the TypeScript compiler.

Example:

```
/// <reference path="../typings/tsd.d.ts" />

import * as ts from "typescript";
import * as tt from "typescript-definition-tester";
import * as fs from "fs";
import * as chai from "chai";

describe('ambient declaration tests', () => {
    it('should compile examples successfully against my-module.d.ts', (done) => {
        tt.compileDirectory(
            __dirname + '/examples',
            (fileName: string) => fileName.indexOf('.ts') > -1,
            () => done()
            );
    });
});
```

You should be able to run this test file with mocha `mocha test/my-test-file.js`. The above example is written in TypeScript. You will need to compile this using `tsc --module commonjs test/my-test-file.js` or you can just write your test using normal JavaScript.