/// <reference path="../../dist/typescript-definition-tester.d.ts" />
import * as tt from "typescript-definition-tester";
import * as test from 'test';

tt.compile(['somefilename'], {}, () => {});

const person: test.IPerson = {
    name: 'Adam'
}