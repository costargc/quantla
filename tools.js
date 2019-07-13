var colors = require('colors');


module.exports = function () {
    this.grabmykey = function () {
        p1 = "DZGEY11";
        p2 = "JGGNO1624";

        p1 = encrypt(p1, -10);
        p2 = encrypt(p2, -10);

        return p1 + "" + p2

    };

    this.encrypt = function (msg, key) {
        var encMsg = "";

        for (var i = 0; i < msg.length; i++) {
            var code = msg.charCodeAt(i);

            // Encrypt only letters in 'A' ... 'Z' interval
            if (code >= 65 && code <= 65 + 26 - 1) {
                code -= 65;
                code = mod(code + key, 26);
                code += 65;
            }

            encMsg += String.fromCharCode(code);
        }

        return encMsg;
    };

    this.mod = function (n, p) {
        if (n < 0)
            n = p - Math.abs(n) % p;

        return n % p;
    };

    this.checkcolor = function (num) {
        if (num.indexOf("-") > -1) {
            return colors.red(num);
        }
        else {
            return colors.green(num);
        }
    }
}