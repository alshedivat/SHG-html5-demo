/* Dynamics_v0.7
 *
 * Date:    06.09.2011
 * Author:  Maruan F. Al-Shedivat
 * E-mail:  alshedivat.maruan@gmail.com
 *
 * Description: набор функций, придающий динамику объектам:
 *              линии задержки и лазерным импульсам.
 */

//laser pulses variables
var animate_laser_pulses = false;
var paths = [];


//image movements variables
var kin;
var rectX = 0;
var rectY = 0;
var d_lY = 0;
var diff_Y = 0;
var draggingRect = false;
var draggingRectOffsetY = 0;
var delay_line = new Image(110,57);

//variables for buttons
var start_bg_color = '#dcffdb';
var start_text_color = '#0A0';
var stop_bg_color = '#ffdbdc';
var stop_text_color = '#A00';

var ctrl_color_UP = "#eee";
var ctrl_color_DOWN = "#eee";
var ctrl_arrow_color_UP = "#666";
var ctrl_arrow_color_DOWN = "#666";

function moveDelayLine(mPosY, movingOffset)
{
    rectY = mPosY - movingOffset;
    // laser line offset
    var diff_Y = mPosY - movingOffset - d_lY + 2;
    d_lY = mPosY - movingOffset + 2;
    paths[4].len += diff_Y;
    paths[5].translation.y += diff_Y;
    paths[6].len += diff_Y;
    paths[6].translation.y += diff_Y;
    for (var i in paths[6].pulses) {
        paths[6].pulses[i].x += diff_Y;
    }
}

function drawDynamics()
{
    var canvas = kin.getCanvas();
    var context = kin.getContext();
    // context.scale(0.7,0.7)

    rectX = 355;
    rectY = 280;
    d_lY = 283;     //laser horizontal line coords

    kin.setDrawStage(function(){
        var mousePos = kin.getMousePos();

        if (draggingRect) {
            if (mousePos.y - draggingRectOffsetY < 308 && mousePos.y - draggingRectOffsetY > 210) {
                moveDelayLine(mousePos.y, draggingRectOffsetY);
            }
        }

        kin.clear();

        // draw static objects
        static_drawings(context);

        //draw laser pulses on different paths
        for (var n in paths) {
            context.save();
            context.translate(paths[n].translation.x, paths[n].translation.y);
            context.rotate(paths[n].rotation);
            for (var i in paths[n].pulses) {
                context.drawImage(paths[n].pulses[i].img, paths[n].pulses[i].x, paths[n].pulses[i].y - (paths[n].pulses[i].amp-30)/2, paths[n].pulses[i].len, paths[n].pulses[i].amp);
            }
            context.restore();
        }

        //start button region
        kin.beginRegion();
            context.save();
            context.translate(130,330);
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#090';
            context.fillStyle = start_bg_color;
            context.rect(-100,0,105,40);
            context.fill();

            context.font = "18pt Calibri";
            context.fillStyle = start_text_color;
        context.fillText('START',-90,30);
        context.stroke();

            context.closePath();
            context.restore();

            kin.addRegionEventListener("onmouseover", function(){
                start_bg_color = '#0A0';
                start_text_color = '#FFF';
                document.body.style.cursor = 'pointer';
            });
            kin.addRegionEventListener("onmouseout", function(){
                if (! animate_laser_pulses) {
                    start_bg_color = '#dcffdb';
                    start_text_color = '#0A0';
                }
                document.body.style.cursor = 'default';
            });
            kin.addRegionEventListener("onmousedown", function(){
                if (! animate_laser_pulses) {
                    animate_laser_pulses = true;
                    generate_laser_pulses();
                    movePulses();
                }
            });
        kin.closeRegion();

        //stop button region
        kin.beginRegion();
            context.save();
            context.translate(130,330);
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#900';
            context.fillStyle = stop_bg_color;
            context.rect(30,0,105,40);
            context.fill();
            context.stroke();

            context.font = "18pt Calibri";
            context.fillStyle = stop_text_color;
        context.fillText('STOP',50,30);

            context.closePath();
            context.restore();

            kin.addRegionEventListener("onmouseover", function(){
                stop_bg_color = '#A00';
                stop_text_color = '#FFF';
                document.body.style.cursor = 'pointer';
            });
            kin.addRegionEventListener("onmouseout", function(){
                stop_bg_color = '#ffdbdc';
                stop_text_color = '#A00';
                document.body.style.cursor = 'default';
            });
            kin.addRegionEventListener("onmousedown", function(){
                    animate_laser_pulses = false;
                    start_bg_color = '#dcffdb';
                    start_text_color = '#0A0';
            });
        kin.closeRegion();

        // buttons to control delay line: UP and DOWN
        kin.beginRegion();
            context.save();
            context.translate(480,305);

            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#222';
            context.rect(0, 0, 30, 30);
            context.fillStyle = ctrl_color_UP;
            context.fill();
            context.stroke();
            context.closePath();

            context.restore();

            kin.addRegionEventListener('onmouseover', function(){
                document.body.style.cursor = 'pointer';
                ctrl_color_UP = '#666';
                ctrl_arrow_color_UP = '#eee';
            });
            kin.addRegionEventListener('onmouseout', function(){
                document.body.style.cursor = 'default';
                ctrl_color_UP = '#eee';
                ctrl_arrow_color_UP = '#666';
            });
            kin.addRegionEventListener('onmousedown', function(){
                if (rectY - 1 > 210) {
                    moveDelayLine(rectY, 1);
                }
            });
            kin.addRegionEventListener('onmouseup', function(){

            });
        kin.closeRegion();

        kin.beginRegion();
            context.save();
            context.translate(480,305);

            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#222';
            context.fillStyle = ctrl_color_DOWN;
            context.rect(0, 35, 30, 30);
            context.fill();
            context.stroke();
            context.closePath();

            context.restore();

            kin.addRegionEventListener('onmouseover', function(){
                document.body.style.cursor = 'pointer';
                ctrl_color_DOWN = '#666';
                ctrl_arrow_color_DOWN = '#eee';
            });
            kin.addRegionEventListener('onmouseout', function(){
                document.body.style.cursor = 'default';
                ctrl_color_DOWN = '#eee';
                ctrl_arrow_color_DOWN = '#666';
            });
            kin.addRegionEventListener('onmousedown', function(){
                if (rectY - 1 < 308) {
                    moveDelayLine(rectY, -1);
                }
            });
            kin.addRegionEventListener('onmouseup', function(){

            });
        kin.closeRegion();

        context.save();
        context.translate(480,305);
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = ctrl_arrow_color_UP;
        context.moveTo(15, 25);
        context.lineTo(15, 5);
        context.moveTo(15, 5);
        context.lineTo(12, 13);
        context.moveTo(15, 5);
        context.lineTo(18, 13);
        context.stroke();

        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = ctrl_arrow_color_DOWN;
        context.moveTo(15, 40);
        context.lineTo(15, 60);
        context.moveTo(15, 60);
        context.lineTo(12, 52);
        context.moveTo(15, 60);
        context.lineTo(18, 52);
        context.stroke();

        context.restore();

        context.restore();


        // delay line image region
        kin.beginRegion();
            context.drawImage(delay_line, rectX, rectY, 110, 57);
            // draw rectangular region for image
            context.beginPath();
                context.rect(rectX, rectY, 110, 57);
            context.closePath();

            kin.addRegionEventListener('onmouseover', function(){
                document.body.style.cursor = 'pointer';
            });
            kin.addRegionEventListener('onmouseout', function(){
                document.body.style.cursor = 'default';
                draggingRect = false;
            });
            kin.addRegionEventListener('onmousedown', function(){

                draggingRect = true;
                var mousePos = kin.getMousePos();
                draggingRectOffsetY = mousePos.y - rectY;
            });
            kin.addRegionEventListener('onmouseup', function(){
                draggingRect = false;
            });

        kin.closeRegion();

    });
}

window.onload = function(){
    //pulse pictures
    red_pulse.src = 'images/red_pulse.svg';
    blue_pulse.src = 'images/blue_pulse.svg';
    red_pulse1.src = 'images/red_pulse1.svg';

    //creating laser paths
    paths.push(new laser_path(red_pulse, 100, 150, 143, 0));
    //reflected
    paths.push(new laser_path(red_pulse, 70, 265, 160, -Math.PI / 2));
    paths.push(new laser_path(red_pulse, 275, 272, 40, 0));
    //transmitted
    paths.push(new laser_path(red_pulse, 65, 275, 143, 0));
    paths.push(new laser_path(red_pulse, 95, 392, 155, Math.PI / 2));
    paths.push(new laser_path(red_pulse, 45, 375, 266, 0));
    paths.push(new laser_path(red_pulse, 95, 430, 290, -Math.PI / 2));
    paths.push(new laser_path(red_pulse, 145, 440, 144, -90 / 154));
    //SH
    paths.push(new laser_path(blue_pulse, 85, 620, 34, -Math.PI / 11));

    paths.push(new laser_path(blue_pulse, 9, 615, 25, -90 / 154));
    paths.push(new laser_path(blue_pulse, 20, 615, 40, 0));

    kin = new Kinetic_2d('the_canvas');
    //delay line image
    delay_line.src = 'images/delay_line.svg';
    drawDynamics();
};

window.onblur = function(){
    animate_laser_pulses = false;
    start_bg_color = '#dcffdb';
    start_text_color = '#0A0';
}
