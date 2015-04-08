var dts = require('dts-bundle');
var pkg = require('./package.json');

dts.bundle({
    name: pkg.name,
    main: 'dist/index.d.ts'
});