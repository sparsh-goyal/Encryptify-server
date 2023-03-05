module.exports = {
    atob: function (base64) {
        return new Buffer(base64, 'base64').toString('utf8');
    },
    btoa: function (str) {
        return new Buffer(str).toString('base64');
    }
}
