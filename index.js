var   os         = require('os')
    , __         = require('underscore')
    , unflatten  = require('unflatten')
    , customVars = {};

module.exports.middleware = function (req, res, next) {
    if (req.url !== '/debug/vars') {
        return next();
    }

    var response = __.extend({}, custom(), stats());
    res.send(response);
};

function custom () {
    var customObj = {};
    __.each(customVars, function (obj, key) {
        customObj[key] = obj.value
    });
    return unflatten(customObj);
};

function stats () {
    return {
        'os': {
            'freemem': os.freemem(),
            'totalmem': os.totalmem(),
            'type': os.type(),
            'platform': os.platform(),
            'arch': os.arch(),
            'release': os.release(),
            'hostname': os.hostname(),
        },
        'process': {
            'uptime': process.uptime(),
            'argv': process.argv.join(' '),
            'memoryUsage': process.memoryUsage(),
            'versions': process.versions
        },
    }
}

var NumberVar = function () {
    this.value = new Number();
};

NumberVar.prototype.set = function (value) {
    if (typeof value == 'string' || value instanceof String) {
        throw new Error(value + ' is a String');
    }
    if (isNaN(value)) {
        throw new Error(value + ' is not a Number');
    }
    this.value = value;
};

NumberVar.prototype.add = function (value) {
    if (typeof value == 'string' || value instanceof String) {
        throw new Error(value + ' is a String');
    }
    if (isNaN(value)) {
        throw new Error(value + ' is not a Number');
    }
    this.value += value;
};

module.exports.newNumber = function (key) {
    customVars[key] = new NumberVar();
    return customVars[key];
};

var StringVar = function () {
    this.value = new String();
};

StringVar.prototype.set = function (value) {
    this.value = value;
};

module.exports.newString = function (key) {
    customVars[key] = new StringVar();
    return customVars[key];
};