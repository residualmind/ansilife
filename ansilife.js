#!/usr/bin/env node

'use strict';

/*     _    _   _ ____ ___ _     ___ _____ _____
 *    / \  | \ | / ___|_ _| |   |_ _|  ___| ____|
 *   / _ \ |  \| \___ \| || |    | || |_  |  _|
 *  / ___ \| |\  |___) | || |___ | ||  _| | |___
 * /_/   \_\_| \_|____/___|_____|___|_|   |_____|
 *
 * ~ I Didn't Choose The Ansi Life,
 *   The Ansi Life Chose Me ~       []
 *                                []  []
 *       []        [][]             [][]
 *         []    []    []    [][]
 *     [][][]      [][]      [][]
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
            h = console._stdout.rows,
            interval;

        this.w = w;
        this.h = h;

        for (i = 0; i < w * h; i++) {
            self.g.push(~~(Math.random() + 0.5));
        }

        process.stdin.setRawMode(true);
        process.stdout.write(C + '?25l' + C + '1;1H' + C + 'J');

        process.stdin.on('readable', function () {
            if (process.stdin.read() !== null) {
                self.die = true;
                process.stdin.setRawMode(false);
            }
        });

        interval = setInterval(function () {
            var i, xx, yy, x, y, n, s, _g;

            if (self.die) {
                clearInterval(interval);
                process.stdin.removeAllListeners('readable');
                process.stdout.write(C + '?25h' + C + '0m');
                process.stdout.write('\n\n“The History Of The Universe In Three Words\n\n CHAPTER ONE\n  Bang!\n\n CHAPTER TWO' +
                    '\n  sssss\n\n CHAPTER THREE\n  crunch.\n\n THE END”\n\n\n ― Iain M. Banks\n\n');
                return;
            }

            _g = self.g.concat();
            for (i = 0; i < _g.length; i++) {
                x = i % self.w;
                y = ~~ (i / self.w);
                n = 256; // 0b100000000 is zero neighbors
                for (xx = -1; xx <= 1; xx++) {
                    for (yy = -1; yy <= 1; yy++) {

                        // shift right for each neighbor
                        n >>= (xx | yy) & self.g[self.xy2i(x + xx, y + yy)];
                    }
                }

                // either [B]irth criteria are met, or cell was alive last cycle and [S]ustain criteria are met
                // in order for the cell to be alive this cycle
                _g[i] = ~~!!((B & n) | (self.g[i] && (S & n)));
            }

            self.g = _g.concat();
            s = self.g.map(function (v, i) {
                return C + ['40m  ', '46m  '][v] + ['\n', ''][~~!!(!i | (i % self.w))];
            }).join('');

            process.stdout.write(C + '1;1H' + s.slice(7));

        }, parseInt(process.argv[2]) || 50);
    }
};

// RULES; B=birth, S=sustain
var B = parseInt('000100000', 2), // 3 neighbors bring a cell to life
    S = parseInt('001100000', 2); // 2 or 3 neighbors sustain a cell's life

if (process.argv.filter(function (v) {
    return v.indexOf('-h') > -1;
}).length) {
    console.log('Usage: ' + process.argv.slice(0, 2).join(' ') + ' [DELAY_IN_MS=50]');
} else {
    Life.start(B, S);
}
