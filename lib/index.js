/**
 * Created by 1002125 on 15. 7. 21..
 */

var fs = require('fs');
var colors = require("colors");
var _ = require("underscore");
var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;
var execSync = child_process.execSync;
var async = require('async');
var tunnels = [];

// set theme
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

var internals = {};

exports.start = function (filename) {
    var config = internals.parseJson(filename);
    console.log(filename);
    if (config == -1) {
        console.log(colors.error("config filename is wrong"));
    } else if (config == -2) {
        console.log(colors.error("config file format is wrong"));
    }
    else {
        internals.tunnelingStart(config);
    }
};

exports.status = function () {
    internals.tunnelingStatus(function (err, numOfProcess) {
        if (err) {
            console.log(colors.error(err));
        } else {

            if (numOfProcess === 0) {
                console.log(colors.help("uzys-elasticache-tunnel is not running"));
            } else {
                var  subscription =  " number of processes are running";
                if(numOfProcess ===1) {
                    subscription =  " process is running";
                }
                console.log(colors.info(numOfProcess) + subscription);

            }
        }
    });
};
exports.stop = function () {
    console.log(colors.info('uzys-elasticache-tunnel is about to stop'));
    internals.tunnelingStop(function (err, stopprocess) {

    });
};


internals.parseJson = function (filename) {
    var ret, fileData;
    try {
        fileData = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        return -1;
    }

    try {
        ret = JSON.parse(fileData);
    } catch (e) {
        return -2;
    }
    return ret;

};
internals.tunnelingStart = function (config) {
    var hosts;
    if (Array.isArray(config)) {
        hosts = config;
    } else {
        hosts = [config];
    }
    var cnt = 0 ;
    async.eachSeries(hosts, function (host, callback) {
        cnt++
        var cmd = 'ssh -2 -f -N -i ' + host.ec2Cert + ' -L' + host.localPort + ':' + host.elasticacheEndpoint + ':' + host.elasticachePort + ' ' + host.ec2User + '@' + host.ec2Endpoint;
        var mCmd = host.localPort + ':' + host.elasticacheEndpoint + ':' + host.elasticachePort + ' ' + host.ec2User + '@' + host.ec2Endpoint;
        exec("ps aux | grep -v awk |awk '/" + mCmd + "/ {print $2}'",
            function (err, stdout, stderr) {
                var pids = _.compact(stdout.split("\n"));
                if (pids.length > 0) {
                    console.log('same tunneling is already running - '+ cnt + ' config, pid ='  , pids);

                    callback();
                } else {

                    var ssh = exec(cmd);
                    ssh.stdout.on('data', function (data) {
                        console.log(colors.info(data));
                    });

                    ssh.stderr.on('data', function (data) {
                        console.log(colors.error(data));
                    });

                    ssh.on('exit', function (code) {
                        if (code != 0)
                            callback('error occured');
                        else
                            callback();
                    });


                }
            });
    }, function (err) {
        if (err) {
            console.log(colors.warn('failed to create tunnel'));
            internals.tunnelingStop();
        } else {
            console.log(colors.info('All tunnel have been created successfully'));
            process.exit();
        }
    });

};
internals.tunnelingStop = function (callback) {
    var child = exec("ps aux | grep -v awk |awk '/ssh -2 -f -N -i/ {print $2}'",
        function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                return callback(err, stderr);
            }

            var pids = _.compact(stdout.split("\n"));
            for (var i = 0; i < pids.length; i++) {
                var buf = execSync("kill -9 " + pids[i]);
                console.log(i + 1 + " tunneling stop - ", pids[i]);
            }
            if (pids.length == 0)
                console.log("no tunneling to stop");
            //console.log('stop process:',pids);
        });
};
internals.tunnelingStatus = function (callback) {
    var child = exec('ps -ef | grep \'ssh -2 -f -N -i\' | grep -v grep | wc -l',
        function (err, stdout, stderr) {
            callback(err, parseInt(stdout));
        });
};
