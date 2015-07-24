# uzys-elasticache-tunnel
[![Build Status](https://travis-ci.org/uzysjung/uzys-elasticache-tunnel.svg?branch=master)](http://travis-ci.org/uzysjung/uzys-elasticache-tunnel)
[![NPM Version](http://img.shields.io/npm/v/uzys-elasticache-tunnel.svg?style=flat)](https://www.npmjs.com/package/uzys-elasticache-tunnel)

You can connect to elasticache outside the aws network

## Installation

You can install this through [npm](https://npmjs.org):

`npm install -g uzys-elasticache-tunnel`

## Requirements
 - Elasticache Endpoint (want to connect)
 - AWS EC2 ( for port forwarding)
 - ssh
 - node.js

## configuration file <config.json>
```
[
  {
    "localPort": 6379,
    "elasticacheEndpoint": "abcd.cache.amazonaws.com",
    "elasticachePort": 6379,
    "ec2Endpoint": "aaaa.ec2.amazon.com",
    "ec2User" : "ubuntu",
    "ec2Cert": "~/.ssh/EC2.pem"
  },
  {
    "localPort": 6378,
    "elasticacheEndpoint": "efgh.cache.amazonaws.com",
    "elasticachePort": 6379,
    "ec2Endpoint": "aaaa.ec2.amazon.com",
    "ec2User" : "ubuntu",
    "ec2Cert": "~/.ssh/EC2.pem"
  }
]
```
  - first config  : localhost:6379 => abcd.cache.amazonaws.com:6379 
  - second config : localhost:6378 => efgh.cache.amazonaws.com:6379
  
if you use Elasticache redis you can connect using redis-cli  
```
redis-cli -h localhost -p 6378 // connect to efgh.cache.amazonaws.com:6379
redis-cli -h localhost -p 6379 // connect to abcd.cache.amazonaws.com:6379 
```
## How to use
```
  Usage: uzys-elasticache-tunnel [options] [command]

  Commands:

    start [filename]  start tunneling with configuration file (default: config.json)
    stop              stop tunneling
    status            show tunneling status

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

#### Usage Example
- start  - `uzys-elasticache-tunnel start ./config.json`
- stop   - `uzys-elasticache-tunnel stop`
- status - `uzys-elasticache-tunnel status`


