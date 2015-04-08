/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/typescript-definition-tester.d.ts" />

import * as tt from "typescript-definition-tester";

tt.walk('dirname', (err, result) => { });
tt.walk('dirname', (fileName) => true, (err, result) => { });