#!/usr/bin/env node

'use strict';

/*     _    _   _ ____ ___ _     ___ _____ _____ 
 *    / \  | \ | / ___|_ _| |   |_ _|  ___| ____|
 *   / _ \ |  \| \___ \| || |    | || |_  |  _|
 *  / ___ \| |\  |___) | || |___ | ||  _| | |___
 * /_/   \_\_| \_|____/___|_____|___|_|   |_____|
 *
 * ~ I Didn't Choose The Ansi Life,
 *   The Ansi Life Chose Me ~
 */

var Life = {
    g: [],

    xy2i: function (x, y) {
        return y * this.w + x;
    },

    start: function (B, S) {
        var C = '\x1b[', // ANSI CSI
            self = this,
            i, w = ~~ (console._stdout.columns / 2) - 1,
            h = console._stdout.rows;

        this.w = w;
        this.h = h;

        for (i = 0; i < w * h; i++) {
            self.g.push(~~(Math.random() + 0.5));
        }

        process.stdout.write(C + '1;1H' + C + 'J');

        setInterval(function () {
            var i, xx, yy, x, y, n, s, _g, l;
            _g = self.g.concat();
            for (i = 0; i < _g.length; i++) {
                x = i % self.w;
                y = ~~ (i / self.w);
                n = 0;
                for (xx = -1; xx <= 1; xx++) {
                    for (yy = -1; yy <= 1; yy++) {
                        n += (xx | yy) & self.g[self.xy2i(x + xx, y + yy)];
                    }
                }
                l = self.g[i];
                _g[i] = B[n] | l & S[n];
            }
            self.g = _g.concat();
            s = '';
            for (i = 1; i < self.w * self.h; i++) {
                s += C + (self.g[i] ? '46m  ' : '40m  ');
                if ((i % (self.w)) === 0) {
                    s += '\n';
                }
            }
            process.stdout.write(C + '1;1H' + s);
        }, parseInt(process.argv[2]) || 50);
    }
};

// RULES; B=birth, S=sustain
var B = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    S = [0, 0, 1, 1, 0, 0, 0, 0, 0, 0];

if (process.argv.filter(function (v) {
    return v.indexOf('-h') > -1;
}).length) {
    console.log('Usage: ' + process.argv.slice(0, 2).join(' ') + ' [DELAY_IN_MS=50]');
} else {
    Life.start(B, S);
}
