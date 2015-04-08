/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/typescript-definition-tester.d.ts" />

import * as tt from "typescript-definition-tester";

tt.compileDirectory('somePath', () => { });
tt.compileDirectory('somePath', {}, () => { });
tt.compileDirectory('somePath', (fileName) => true, () => { });
tt.compileDirectory('somePath', (fileName) => true, {}, () => { });