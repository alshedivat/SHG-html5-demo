/* Nanolab Demo
 *
 * Author       : Maruan Al-Shedivat
 * Created      : 06/09/2011
 * Updated      : 08/09/2014
 *
 * Description  : SHG detection demo.
 */

// Ensure the pixel ration for the device
Kinetic.pixelRatio = window.devicePixelRatio;

// Array of laser paths
var paths = [];

// Kinetic animation object
var anim;

// Layers of the canvas stage
var static_layer  = new Kinetic.Layer();
var dynamic_layer = new Kinetic.Layer();
var control_layer = new Kinetic.Layer();

 // Helper functions
 function Arrow(fromx, fromy, tox, toy, rotation, width, headlen, color){
    var angle = Math.atan2(toy-fromy, tox-fromx);
    return new Kinetic.Line({
        points      : [fromx, fromy, tox, toy,
                       tox-headlen*Math.cos(angle-Math.PI/6),
                       toy-headlen*Math.sin(angle-Math.PI/6),
                       tox, toy, tox-headlen*Math.cos(angle+Math.PI/6),
                       toy-headlen*Math.sin(angle+Math.PI/6)],
        stroke      : color,
        rotation    : rotation,
        strokeWidth : width,
        lineCap     : 'round',
        lineJoin    : 'round',
    });
}

window.onload = function(){
    stage = new Kinetic.Stage({
        container   : 'demoCanvas',
        width       : 536,
        height      : 300,
        scaleX      : 536/777,
        scaleY      : 536/777,
    });

    // Generate and add static objects to the static layer
    var static_objects = gen_static_objects();
    for (var i = 0; i < static_objects.length; i++) {
        static_layer.add(static_objects[i]);
    }

    // Generate control objects (buttons and delay line)
    var control_objects = gen_control_objects();
    for (var name in control_objects) {
        control_layer.add(control_objects[name]);
    }

    // Initialize paths
    paths.push(new laser_path(red_pulse, 100, 150, 143, 0, [1, 3]));

    // Reflected path
    paths.push(new laser_path(red_pulse, 70, 265, 160, -90, [2]));
    paths.push(new laser_path(red_pulse1, 275, 272, 47, 0, [8]));

    // Transmitted path
    paths.push(new laser_path(red_pulse, 65, 275, 143, 0, [4]));
    paths.push(new laser_path(red_pulse, 95, 392, 155, 90, [5]));
    paths.push(new laser_path(red_pulse, 45, 375, 266, 0, [6]));
    paths.push(new laser_path(red_pulse, 95, 430, 290, -90, [7]));
    paths.push(new laser_path(red_pulse, 145, 440, 144, -30, [9]));

    //SH
    paths.push(new laser_path(blue_pulse, 12, 620, 53, 0));
    paths.push(new laser_path(blue_pulse, 5, 615, 39, -30));
    paths.push(new laser_path(blue_pulse, 50, 615, 48, -16));

    detection_text = new Kinetic.Text({
        x           : NC.x - 80,
        y           : NC.y + 180,
        text        : 'I = ' + SH_intensity + ' units',
        fontSize    : 26,
        fontFamily  : 'Calibri',
        fill        : 'blue',
    });
    dynamic_layer.add(detection_text);

    // Add layers to the stage
    stage.add(static_layer);
    stage.add(control_layer);
    stage.add(dynamic_layer);

    // Add animation
    anim = new Kinetic.Animation(animate_laser_pulses, dynamic_layer);
}

// Add events and listeners
window.onblur = function(){
    anim.stop();
    detection_text.setText('I = 0 units');
    for (var i = 0; i < paths.length; i++) {
        for (var p in paths[i].pulses)
            paths[i].pulses[p].remove();
        paths[i].pulses = [];
    }
    dynamic_layer.clear();
    dynamic_layer.draw();
}
