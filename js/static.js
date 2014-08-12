/* Generate static objects
 *
 * Author       : Maruan Al-Shedivat
 * Created      : 06/09/2011
 * Updated      : 08/09/2014 (move from kineticjs_v1.0.0 to kineticjs_v5.1.0)
 *
 * Description  : Initialize static objects.
 */

// Main points on the schematic (global variables)
L   = {x: 150, y: 160};  // laser
BS  = {x: 280, y: 160};  // beam splitter
S   = {x: 280, y:  70};  // sample
NC  = {x: 600, y:  70};  // nonlinear crystal
M1  = {x: 375, y: 160};  // mirror 1
M2  = {x: 446, y: 160};  // mirror 2
D1  = {x: 375, y: 283};  // delay line point 1
D2  = {x: 446, y: 283};  // delay line point 2

function gen_static_objects() {

    // Create laser
    var laser = new Kinetic.Group({
        x           : 30,
        y           : 120,
    });
    laser.add(new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 80,
        width       : 120,
        fill        : '#FFDBDC',
        stroke      : '#F00',
    }));
    laser.add(new Kinetic.Text({
        x           :  30,
        y           : -30,
        text        : 'Laser',
        fontSize    : 24,
        fontFamily  : 'Calibri',
        fill        : 'red'
    }));

    // Delay line frame
    var delay_frame = new Kinetic.Group({
        x           : 345,
        y           : 200,
    });
    delay_frame.add(new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 170,
        width       : 130,
        stroke      : '#333',
    }));
    delay_frame.add(new Kinetic.Text({
        x           :  20,
        y           : 180,
        text        : 'Delay Line',
        fontSize    : 22,
        fontFamily  : 'Calibri',
        fill        : '#333'
    }));

    // Create laser paths
    var laser_path_start = new Kinetic.Line({
        points      : [L.x, L.y, BS.x, BS.y,],
        stroke      : 'red',
        strokeWidth : 2,
    });

    var laser_path_reflected = new Kinetic.Line({
        points      : [BS.x, BS.y, S.x, S.y, NC.x, NC.y,],
        stroke      : 'red',
        strokeWidth : 2,
    });

    var laser_path_transmitted_1 = new Kinetic.Line({
        points      : [BS.x, BS.y, M1.x, M1.y,],
        stroke      : 'red',
        strokeWidth : 2,
    });

    var laser_path_transmitted_2 = new Kinetic.Line({
        points      : [M2.x, M2.y, NC.x, NC.y],
        stroke      : 'red',
        strokeWidth : 2,
    });

    var laser_path_SHG = new Kinetic.Group({
        x           : NC.x,
        y           : NC.y,
    });
    laser_path_SHG.add(new Kinetic.Line({
        points      : [0, 0, 67, 0,],
        stroke      : '#77F',
        strokeWidth : 2,
    }));
    laser_path_SHG.add(new Kinetic.Line({
        points      : [0, 0, 67, 0,],
        stroke      : '#77F',
        strokeWidth : 2,
        rotation    : -35,
    }));
    laser_path_SHG.add(Arrow(0, 0, 100, 0, -17.5, 2, 7, 'blue'));

    // Sample
    var sample = new Kinetic.Group({
        x           : S.x,
        y           : S.y,
    });
    sample.add(new Kinetic.Line({
        points      : [-20, -5, 20, -5,],
        stroke      : '#666',
        strokeWidth : 4,
        lineCap     : 'round',
        rotation    : -45,
    }));
    sample.add(new Kinetic.Line({
        points      : [-18, -1, 22, -1,],
        stroke      : '#C5C228',
        strokeWidth : 4,
        lineCap     : 'round',
        lineJoin    : 'round',
        dash        : [5, 5],
        rotation    : -45,
    }));
    sample.add(new Kinetic.Text({
        x           : -40,
        y           : -45,
        text        : 'Sample',
        fontSize    : 22,
        fontFamily  : 'Calibri',
        fill        : '#C5C228',
    }));

    // Beam splitter
    beam_splitter = new Kinetic.Group({
        x           : BS.x,
        y           : BS.y,
    });
    beam_splitter.add(new Kinetic.Line({
        points      : [-20, 0, 20, 0],
        stroke      : '#4D60FA',
        strokeWidth : 4,
        lineCap     : 'round',
        rotation    : -45,
    }));
    beam_splitter.add(new Kinetic.Text({
        x           : -60,
        y           :  20,
        text        : 'Beam Splitter',
        fontSize    : 22,
        fontFamily  : 'Calibri',
        fill        : '#4D60FA',
    }));

    // Mirrors
    mirror_1 = new Kinetic.Group({
        x           : M1.x,
        y           : M1.y,
    });
    mirror_1.add(new Kinetic.Line({
        points      : [-20, -2, 20, -2],
        stroke      : '#4D90FE',
        strokeWidth : 4,
        lineCap     : 'round',
        rotation    : 45,
    }));
    mirror_2 = new Kinetic.Group({
        x           : M2.x,
        y           : M2.y,
    });
    mirror_2.add(new Kinetic.Line({
        points      : [-20, -2, 20, -2],
        stroke      : '#4D90FE',
        strokeWidth : 4,
        lineCap     : 'round',
        rotation    : -60,
    }));

    // Nonlinear crystal
    crystal = new Kinetic.Group({
        x           : NC.x,
        y           : NC.y,
    });
    crystal.add(new Kinetic.Rect({
        x           :  10,
        y           : -24,
        height      : 15,
        width       : 40,
        fill        : '#8ED6FF',
        stroke      : '#00F',
        rotation    : 75,
    }));
    crystal.add(new Kinetic.Text({
        x           : -30,
        y           :  30,
        text        : 'Nonlinear\nCrystal',
        fontSize    : 22,
        fontFamily  : 'Calibri',
        fill        : '#1596ED',
        align       : 'center',
    }));

    // Detector and diaphragm
    detector = new Kinetic.Group({
        x           : NC.x + 65,
        y           : NC.y - 5,
    });
    detector.add(new Kinetic.Line({
        points      : [0, -55, 0, 25],
        stroke      : '#333',
        strokeWidth : 4,
        lineCap     : 'round',
        lineJoin    : 'round',
        dash        : [35, 10],
        rotation    : -15,
    }));
    detector.add(new Kinetic.Shape({
        drawFunc    : function(context) {
            context.beginPath();
            context.arc(40, -17, 15, -Math.PI / 2, Math.PI / 2, false);
            context.closePath();
            context.moveTo(55, -17);
            context.lineTo(120, -17);
            context.fillStrokeShape(this);
        },
        fill        : '#DDD',
        stroke      : '#222',
        rotation    : -15,
    }));
    detector.add(new Kinetic.Text({
        x           : 20,
        y           : -5,
        text        : 'Detector',
        fontSize    : 22,
        fontFamily  : 'Calibri',
        fill        : '#666',
    }));
    detector.add(new Kinetic.Text({
        x           : -150,
        y           :  150,
        text        : 'Detected SH intensity:',
        fontSize    : 26,
        fontFamily  : 'Calibri',
        fill        : '#333',
    }));

    return [laser, delay_frame, laser_path_SHG,
            laser_path_start, laser_path_reflected,
            laser_path_transmitted_1, laser_path_transmitted_2,
            sample, beam_splitter, mirror_1, mirror_2, crystal, detector];
}
