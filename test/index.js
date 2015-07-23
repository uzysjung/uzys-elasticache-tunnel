/**
 * Created by 1002125 on 15. 7. 23..
 */
var Code = require('code');
var Lab = require('lab');
var ChildProcess = require('child_process');
var Path = require('path');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

var binPath = Path.join(__dirname, '..', 'bin', 'uzys-elasticache-tunnel');

describe('Test CLI', function () {

    it('start with wrong configuration filename', function (done) {

        var cli = ChildProcess.spawn(binPath, ['start', 'noname.json']);

        var output = '';

        cli.stdout.on('data', function (data) {
            output += data;
        });

        cli.stderr.on('data', function (data) {
            expect(data).to.not.exist();
        });

        cli.once('close', function (code, signal) {
            expect(code).to.equal(0);
            expect(signal).to.not.exist();
            expect(output).to.contain('config filename is wrong');
            done();
        });
    });
    it('start with wrong json format config', function (done) {

        var wrongFormatJsonPath = Path.join(__dirname, 'wrongFormat.json');

        var cli = ChildProcess.spawn(binPath, ['start', wrongFormatJsonPath]);

        var output = '';

        cli.stdout.on('data', function (data) {
            output += data;
        });

        cli.stderr.on('data', function (data) {
            expect(data).to.not.exist();
        });

        cli.once('close', function (code, signal) {
            expect(code).to.equal(0);
            expect(signal).to.not.exist();
            expect(output).to.contain('config file format is wrong');
            done();
        });
    });

    it('status - is not running', function (done) {
        var cli = ChildProcess.spawn(binPath, ['status']);

        var output = '';

        cli.stdout.on('data', function (data) {
            output += data;
        });

        cli.stderr.on('data', function (data) {
            expect(data).to.not.exist();
        });

        cli.once('close', function (code, signal) {
            expect(code).to.equal(0);
            expect(signal).to.not.exist();
            expect(output).to.contain('uzys-elasticache-tunnel is not running');
            done();
        });
    });
    it('stop - no tunneling to stop', function (done) {
        var cli = ChildProcess.spawn(binPath, ['stop']);

        var output = '';

        cli.stdout.on('data', function (data) {
            output += data;
        });

        cli.stderr.on('data', function (data) {
            expect(data).to.not.exist();
        });

        cli.once('close', function (code, signal) {
            console.log('output:',output);
            expect(code).to.equal(0);
            expect(signal).to.not.exist();
            expect(output).to.contain('no tunneling to stop');
            done();
        });
    });
});