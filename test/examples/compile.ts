/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/typescript-definition-tester.d.ts" />
/// <reference path="./test.interface.d.ts" />

import * as tt from "typescript-definition-tester";
import * as test from 'test';

tt.compile(['somefilename'], {}, () => {});

const person: test.IPerson = {
    name: 'Adam'
}