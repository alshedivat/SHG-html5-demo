/* Animate laser pulses dynamics
 *
 * Date:    06.09.2011
 * Author:  Maruan Al-Shedivat
 *
 * Description: Animate object dynamics.
 */

// Button colors
var start_bg_color   = '#DCFFDB';
var start_text_color = '#0A0';
var stop_bg_color    = '#FFDBDC';
var stop_text_color  = '#A00';

var ctrl_color_UP         = "#eee";
var ctrl_color_DOWN       = "#eee";
var ctrl_arrow_color_UP   = "#666";
var ctrl_arrow_color_DOWN = "#666";

// Delay line image and parameters
var delay_mirrors_img = new Image(110,57);
delay_mirrors_img.src = 'images/delay_line.svg';

// Delay coordinates
var Dx1 = 375;
var Dx2 = 446;
var Dy  = 188;
var DL  = 95;

var Dy_max = 210;
var Dy_min = 145;

var D_step = 2;

function gen_control_objects() {

    // Add start button
    var start_button = new Kinetic.Group({
        x           :  30,
        y           : 330,
    });
    start_rect = new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 40,
        width       : 100,
        fill        : start_bg_color,
        stroke      : '#090',
    });
    start_text = new Kinetic.Text({
        x           :  20,
        y           :  8,
        text        : 'START',
        fontSize    : 24,
        fontFamily  : 'Calibri',
        fill        : start_text_color,
    });
    start_region = new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 40,
        width       : 100,
        opacity     : 1,
    });
    start_button.add(start_rect).add(start_text).add(start_region);
    start_region.on('mouseover', function(){
        document.body.style.cursor = 'pointer';
        start_rect.fill('#090');
        start_text.fill('#FFF');
        start_button.draw();
    });
    start_region.on('mouseout', function(){
        document.body.style.cursor = 'default';
        start_rect.fill(start_bg_color);
        start_text.fill(start_text_color);
        start_button.draw();
    });
    start_region.on('mousedown touchend', function(){
        start_rect.fill(start_bg_color);
        start_text.fill(start_text_color);
        start_button.draw();
    });
    start_region.on('mouseup touchstart', function(){
        start_rect.fill('#090');
        start_text.fill('#FFF');
        start_button.draw();
    });
    start_region.on('click tap', function(){
        anim.start();
    });

    // Add stop button
    var stop_button = new Kinetic.Group({
        x           : 150,
        y           : 330,
    });
    stop_rect = new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 40,
        width       : 100,
        fill        : stop_bg_color,
        stroke      : '#900',
    });
    stop_text = new Kinetic.Text({
        x           :  24,
        y           :  8,
        text        : 'STOP',
        fontSize    : 24,
        fontFamily  : 'Calibri',
        fill        : stop_text_color,
    });
    stop_region = new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 40,
        width       : 100,
        opacity     : 1,
    });
    stop_button.add(stop_rect).add(stop_text).add(stop_region);
    stop_region.on('mouseover', function(){
        document.body.style.cursor = 'pointer';
        stop_rect.fill('#900');
        stop_text.fill('#FFF');
        stop_button.draw();
    });
    stop_region.on('mouseout', function(){
        document.body.style.cursor = 'default';
        stop_rect.fill(stop_bg_color);
        stop_text.fill(stop_text_color);
        stop_button.draw();
    });
    stop_region.on('mousedown touchend', function(){
        stop_rect.fill(stop_bg_color);
        stop_text.fill(stop_text_color);
        stop_button.draw();
    });
    stop_region.on('mouseup touchstart', function(){
        stop_rect.fill('#900');
        stop_text.fill('#FFF');
        stop_button.draw();
    });
    stop_region.on('click tap', function(){
        anim.stop();
        detection_text.setText('I = 0 units');
        for (var i = 0; i < paths.length; i++) {
            for (var p in paths[i].pulses)
                paths[i].pulses[p].remove();
            paths[i].pulses = [];
        }
        dynamic_layer.clear();
        dynamic_layer.draw();
    });

    // Add delay line
    var laser_path_delay = new Kinetic.Line({
        points      : [M1.x, M1.y, Dx1, Dy+DL, Dx2, Dy+DL, M2.x, M2.y],
        stroke      : 'red',
        strokeWidth : 2,
    });
    var delay_mirrors = new Kinetic.Image({
        x           : 355,
        y           : 280,
        image       : delay_mirrors_img,
        draggable   : true,
        dragBoundFunc: function(pos) {
          return {
            x: this.getAbsolutePosition().x,
            y: Math.min(Math.max(pos.y, Dy_min), Dy_max),
          }
        }
    });
    delay_mirrors.on('dragmove', function(){
        document.body.style.cursor = 'ns-resize';
        var DL_prev = DL;
        DL = delay_mirrors.getPosition().y + 1 - Dy;
        var D_step = DL - DL_prev;

        // Update and re-draw laser paths
        laser_path_delay.points([M1.x,M1.y,Dx1,Dy+DL,Dx2,Dy+DL,M2.x,M2.y]);
        laser_path_delay.draw();

        // Update pulse positions and path lengths
        paths[4].L = DL;
        paths[6].L = DL;
        paths[6].group.move({x: 0, y: D_step});
        paths[5].group.move({x: 0, y: D_step});
    });
    delay_mirrors.on('mouseover', function(){
        document.body.style.cursor = 'ns-resize';
    });
    delay_mirrors.on('mouseout', function(){
        document.body.style.cursor = 'default';
    });

    // Add delay buttons
    var delay_control  = new Kinetic.Group({
        x           : 480,
        y           : 300,
    });
    var up_rect = new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 30,
        width       : 30,
        fill        : ctrl_color_UP,
        stroke      : '#333',
    });
    var up_arrow = Arrow(15, 25, 15, 5, 0, 4, 5, ctrl_arrow_color_UP);
    var up_region = new Kinetic.Rect({
        x           : 0,
        y           : 0,
        height      : 30,
        width       : 30,
        opacity     : 0,
    });
    up_region.on('mouseover', function(){
        document.body.style.cursor = 'pointer';
        up_rect.fill(ctrl_arrow_color_UP);
        up_arrow.stroke(ctrl_color_UP);
        delay_control.draw();
    });
    up_region.on('mouseout', function(){
        document.body.style.cursor = 'default';
        up_rect.fill(ctrl_color_UP);
        up_arrow.stroke(ctrl_arrow_color_UP);
        delay_control.draw();
    });
    up_region.on('mouseup touchstart', function(){
        up_rect.fill(ctrl_arrow_color_UP);
        up_arrow.stroke(ctrl_color_UP);
        delay_control.draw();
    });
    up_region.on('mousedown touchend', function(){
        up_rect.fill(ctrl_color_UP);
        up_arrow.stroke(ctrl_arrow_color_UP);
        delay_control.draw();
    });
    up_region.on('click tap', function(){
        if (delay_mirrors.getAbsolutePosition().y > Dy_min) {
            delay_mirrors.move({x: 0, y: -D_step});
            DL -= D_step;
            laser_path_delay.points([M1.x,M1.y,Dx1,Dy+DL,Dx2,Dy+DL,M2.x,M2.y]);
            delay_mirrors.getLayer().draw();

            // Update pulse positions and path lengths
            paths[4].L = DL;
            paths[6].L = DL;
            paths[6].group.move({x: 0, y: -D_step});
            paths[5].group.move({x: 0, y: -D_step});
        }
    });

    var control_down  = new Kinetic.Group();
    var down_rect = new Kinetic.Rect({
        x           : 0,
        y           : 40,
        height      : 30,
        width       : 30,
        fill        : ctrl_color_UP,
        stroke      : '#333',
    });
    var down_arrow = Arrow(15, 45, 15, 65, 0, 4, 5, ctrl_arrow_color_DOWN);
    var down_region = new Kinetic.Rect({
        x           : 0,
        y           : 40,
        height      : 30,
        width       : 30,
        opacity     : 1,
    });
    down_region.on('mouseover', function(){
        document.body.style.cursor = 'pointer';
        down_rect.fill(ctrl_arrow_color_DOWN);
        down_arrow.stroke(ctrl_color_DOWN);
        delay_control.draw();
    });
    down_region.on('mouseout', function(){
        document.body.style.cursor = 'default';
        down_rect.fill(ctrl_color_DOWN);
        down_arrow.stroke(ctrl_arrow_color_DOWN);
        delay_control.draw();
    });
    down_region.on('mouseup touchstart', function(){
        down_rect.fill(ctrl_arrow_color_DOWN);
        down_arrow.stroke(ctrl_color_DOWN);
        delay_control.draw();
    });
    down_region.on('mousedown touchend', function(){
        down_rect.fill(ctrl_color_DOWN);
        down_arrow.stroke(ctrl_arrow_color_DOWN);
        delay_control.draw();
    });
    down_region.on('click tap', function(){
        if (delay_mirrors.getAbsolutePosition().y < Dy_max) {
            delay_mirrors.move({x: 0, y: D_step});
            DL += D_step;
            laser_path_delay.points([M1.x,M1.y,Dx1,Dy+DL,Dx2,Dy+DL,M2.x,M2.y]);
            delay_mirrors.getLayer().draw();

            // Update pulse positions and path lengths
            paths[4].L = DL;
            paths[6].L = DL;
            paths[6].group.move({x: 0, y: D_step});
            paths[5].group.move({x: 0, y: D_step});
        }
    });

    delay_control.add(up_rect).add(up_arrow).add(up_region);
    delay_control.add(down_rect).add(down_arrow).add(down_region);

    return {start       : start_button,
            stop        : stop_button,
            delay_path  : laser_path_delay,
            delay_line  : delay_mirrors,
            delay_ctrl  : delay_control};
}
