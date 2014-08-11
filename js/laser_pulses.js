/* Laser_pulses_v0.4
 *
 * Created:     08.31.2011
 * Updated:     08.10.2014
 * Author:      Maruan Al-Shedivat
 *
 * Description: Create, draw, and move laser pulses.
 */

// Pulse images
var red_pulse = new Image(40,30);
var red_pulse1 = new Image(40,70);
var blue_pulse = new Image(40,30);

// Pulses parameters
const pulses_delay = 3000;      // in ms
const pulses_step = 5;          // in px

// Delay between pulses
var between_pulses;

// SH intensity
var SH_intensity = 0;

// Lengths of laser paths
function laser_path(img, L, transX, transY, rot) {
    this.len = L;
    this.translation = {
        x : transX,
        y : transY,
    }
    this.rotation = rot;
    this.image = img;
    this.pulses = [];

    this.addPulse = function(_x, _y, A, l, pic) {
        var pulse = {
            img : pic || img,
            amp : A   || 40,
            len : l   || 30,
            x   : _x  || 0,
            y   : _y  || 0
        };
        this.pulses.push(pulse);
    }
}

// Add a pulse to paths and recursively call itself with delay.
function generate_laser_pulses() {
    if (animate_laser_pulses) {
        paths[0].addPulse(0,0);
        setTimeout('generate_laser_pulses()', pulses_delay);
    }
}

function movePulses() {
    if (animate_laser_pulses) {
        // Moving all the pulses in each path
        for (var n in paths) {
            for (var i in paths[n].pulses) {
                paths[n].pulses[i].x += pulses_step;
            }
        }

        // Verifying if some of them reached the end of the 1-st path
        if (paths[0].pulses.length > 0 && paths[0].pulses[0].x > paths[0].len){
            paths[0].pulses.shift();
            paths[1].addPulse(0,0);
            paths[3].addPulse(0,0);
        }

        // Verifying this for paths of reflected pulses
        if (paths[1].pulses.length > 0 && paths[1].pulses[0].x > paths[1].len){
            paths[1].pulses.shift();
            paths[2].addPulse(0,0,40,70,red_pulse1);
        }
        if (paths[2].pulses.length > 0 && paths[2].pulses[0].x > paths[2].len){
            paths[2].pulses.shift();
            paths[10].addPulse(0,0);
        }

        // Verifying this for paths of transmitted pulses
        for (var k=4; k<8; k++) {
            if (paths[k-1].pulses.length > 0 &&
                paths[k-1].pulses[0].x > paths[k-1].len) {
                paths[k-1].pulses.shift();
                paths[k].addPulse(0,0);
            }
        }
        if (paths[7].pulses.length > 0 &&
            paths[7].pulses[0].x > paths[7].len) {
            paths[7].pulses.shift();
            paths[9].addPulse(0,0);
        }

        // SH generation
        if (paths[9].pulses.length > 0 &&
            paths[9].pulses[0].x > paths[9].len) {
            paths[9].pulses.shift();
        }
        if (paths[10].pulses.length > 0 &&
            paths[10].pulses[0].x > paths[10].len) {
            paths[10].pulses.shift();
        }

        if (paths[7].pulses.length > 0 &&
            paths[2].pulses.length > 0 &&
            ((paths[2].len-paths[2].pulses[0].x) < pulses_step ||
             (paths[7].len-paths[7].pulses[0].x) < pulses_step)) {
            between_pulses = Math.abs(paths[2].len - paths[2].pulses[0].x - (paths[7].len - paths[7].pulses[0].x));
            if (between_pulses < 40) {
                if (between_pulses < 30) {
                    if (between_pulses < 20) {
                        if (between_pulses < 10) {
                            paths[8].addPulse(0,0,50);
                        } else {
                            paths[8].addPulse(0,0,45);
                        }
                    } else {
                        paths[8].addPulse(0,0,35);
                    }
                } else {
                    paths[8].addPulse(0,0,25);
                }
                paths[7].pulses.shift();
                paths[9].addPulse(0,0);
                paths[2].pulses.shift();
                paths[10].addPulse(0,0);
            } else {
                SH_intensity = 0;
            }
        }
        if (paths[8].pulses.length > 0 &&
            paths[8].pulses[0].x > paths[8].len ) {
            paths[8].pulses.shift();
            SH_intensity = parseInt(Math.exp(-between_pulses*between_pulses/1000)*1000) - between_pulses*10;
        }
        kin.drawStage();
        setTimeout('movePulses()', 33) // about 30 fps
    } else {
        for (var i in paths) {
            paths[i].pulses = [];
        }
        kin.drawStage();
    }
}
