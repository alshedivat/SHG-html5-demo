/* Laser pulse parameters
 *
 * Created:     08/31/2011
 * Updated:     08/10/2014
 * Author:      Maruan Al-Shedivat
 *
 * Description: Create, draw, and move laser pulses.
 */

// Pulse images
var red_pulse  = new Image(40,30);
red_pulse.src  = 'images/red_pulse.svg';
var red_pulse1 = new Image(70,40);
red_pulse1.src = 'images/red_pulse1.svg';
var blue_pulse = new Image(40,30);
blue_pulse.src = 'images/blue_pulse.svg';

// Pulses parameters
const pulses_delay = 1200;  // ms
const pulses_step  = 4;     // px per frame

// SH intensity
var SH_intensity = 0;
var max_SHG_dist = 10;
var detection_text;

// Laser paths
function laser_path(img, L, transX, transY, rot, next_paths) {
    this.L = L;
    this.image = img;
    this.pulses = [];
    this.next_paths = next_paths || [];
    this.group = new Kinetic.Group({
        x           : transX,
        y           : transY,
        rotation    : rot,
    });
    dynamic_layer.add(this.group);

    this.addPulse = function(I) {
        var pulse = new Kinetic.Image({
            x           : 0,
            y           : 0,
            image       : this.image,
        });
        this.group.add(pulse);
        this.pulses.push(pulse);
    }
}

function animate_laser_pulses(frame) {
    // Add new pulses to the first path every pulse_delay seconds
    if (Math.round(frame.time / pulses_delay) >
        Math.round((frame.time - frame.timeDiff) / pulses_delay)) {
        paths[0].addPulse();
    }

    // Move all the pulses forward
    for (var i = 0; i < paths.length; i++) {
        for (var p in paths[i].pulses) {
            paths[i].pulses[p].move({x: pulses_step, y: 0});
        }
    }

    // Generate SHG
    if (paths[3].pulses.length > 0 && paths[7].pulses.length > 0) {
        path3_pulse_dist = paths[3].L - paths[3].pulses[0].getPosition().x;
        path7_pulse_dist = paths[7].L - paths[7].pulses[0].getPosition().x;
        dist_diff = Math.abs(path7_pulse_dist - path3_pulse_dist);
        if ((path3_pulse_dist < 0 || path7_pulse_dist < 0) && dist_diff < 30) {
            paths[3].pulses[0].remove();
            paths[3].pulses.shift();
            // Add pulses to the next paths if exist
            for (var j = 0; j < paths[3].next_paths.length; j++) {
                next_path = paths[paths[3].next_paths[j]];
                next_path.addPulse();
            }
            paths[7].pulses[0].remove();
            paths[7].pulses.shift();
            // Add pulses to the next paths if exist
            for (var j = 0; j < paths[7].next_paths.length; j++) {
                next_path = paths[paths[7].next_paths[j]];
                next_path.addPulse();
            }
            paths[10].addPulse();
            SH_intensity = (100 * Math.exp(- dist_diff / 10)).toFixed(3);
        }
    }

    // Update all the paths
    for (var i = 0; i < paths.length; i++) {
        if (paths[i].pulses.length > 0) {
            if (paths[i].pulses[0].getPosition().x > paths[i].L){
                // Remove the first pulse
                paths[i].pulses[0].remove();
                paths[i].pulses.shift();
                // Add pulses to the next paths if exist
                for (var j = 0; j < paths[i].next_paths.length; j++) {
                    next_path = paths[paths[i].next_paths[j]];
                    next_path.addPulse();
                }
                // Detect SHG
                if (i == 10) {
                    detection_text.setText('I = ' + SH_intensity + ' units');
                }
            }
        }
    }
}
