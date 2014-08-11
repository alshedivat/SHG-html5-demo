/* Draw_static_objects_v0.5
 *
 * Date:        06.09.2011
 * Updated:     08.10.2014
 * Author:      Maruan F. Al-Shedivat
 *
 * Description: Draw static elements and put dynamic ones on
                the initial positions.
 */

//on-load drawings
function static_drawings(context)
{
    //draw laser
    context.beginPath();
    context.strokeStyle = '#F00';
    context.fillStyle = "#ffdbdc";
    context.lineWidth   = 2;
    context.rect(30,120,120,80);
    context.fill();
    context.stroke();
    context.font = "18pt Calibri";
    context.fillStyle = '#F00';
    context.fillText('Laser', 55,110);

    context.beginPath();
    context.moveTo(150,160);
/*  context.lineTo(180,160);
    context.moveTo(220,160);
*/  context.lineTo(280,160);
    context.stroke();
    context.beginPath();
    context.lineWidth   = 1;
    //transmissed
    context.moveTo(280,160);
    context.lineTo(375,160);
    context.lineTo(375,d_lY);
    context.lineTo(446,d_lY);
    context.lineTo(446,160);
    context.lineTo(600,57);
    //reflected
    context.moveTo(280,160);
    context.lineTo(280,57);
    context.lineTo(600,57);
    context.stroke();
    context.lineWidth   = 2;

/*  //draw Glan's prism
    context.strokeStyle = '#222';
    context.strokeRect(180,140,40,40);
    context.beginPath();
    context.moveTo(180,140);
    context.lineTo(220,180);
    context.stroke();
*/
    //draw beam splitter
    context.beginPath();
    context.strokeStyle = '#4D60FA';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.moveTo(265,175);
    context.lineTo(295,145);
    context.stroke();
    context.font = "12pt Calibri";
    context.fillStyle = '#00A';
   context.fillText('Beam Splitter', 235,195);

    //draw delay line
    context.strokeStyle = '#222';
    context.lineWidth = 2;
    context.strokeRect(345,200,130,170);
    context.font = "16pt Calibri";
    context.fillStyle = '#333';
   context.fillText('Delay Line', 350,395);

    // Sample
    context.beginPath();
    context.strokeStyle = '#666';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.moveTo(262,68);
    context.lineTo(290,40);
    context.stroke();
    context.beginPath();
    context.strokeStyle = '#c5c228';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.moveTo(266,69);
    context.lineTo(271,64);
    context.moveTo(276,59);
    context.lineTo(281,54);
    context.moveTo(286,49);
    context.lineTo(291,44);
    context.stroke();
    context.font = "16pt Calibri";
    context.fillStyle = '#b3b506';
   context.fillText('Sample', 250,25);

    //draw lenses
    context.beginPath();
    context.strokeStyle = '#4D90FE';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.moveTo(360,145);    //second
    context.lineTo(390,175);
    context.moveTo(435,175);    //third
    context.lineTo(455,145);
    context.stroke();

    //draw nonlinear crystal
    context.font = "14pt Calibri";
    context.fillStyle = '#1596ed';
    context.fillText('Nonlinear', 565,100);
    context.fillText('Crystal', 575,120);
    context.save();
    context.translate(600,57);
    context.rotate(-Math.PI / 11);
    context.beginPath();
    context.rect(0,-20,15,40);
    context.fillStyle = '#8ED6FF';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#222';
    context.stroke();

    //draw diaphragm
    context.moveTo(60, 10);
    context.lineTo(60, 60);
    context.moveTo(60, -10);
    context.lineTo(60, -60);
    context.moveTo(55, -10);
    context.lineTo(65, -10);
    context.moveTo(55, 10);
    context.lineTo(65, 10);
    context.stroke();

    //draw SH beam
    context.beginPath();
    context.strokeStyle = '#00D';
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.moveTo(16,0);
    context.lineTo(120,0);
    context.lineTo(110,2);
    context.lineTo(110,-2);
    context.lineTo(120,0);
    context.stroke();

    context.rotate(Math.PI / 11);
    context.beginPath();
    context.strokeStyle = '#77F';
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.moveTo(17,0);
    context.lineTo(60,0);
    context.moveTo(15,-10);
    context.lineTo(50,-35);
    context.stroke();

    //draw detector
    context.rotate(Math.PI / -11);
    context.beginPath();
    context.strokeStyle = '#222';
    context.arc(140, 0, 15, -Math.PI / 2, Math.PI / 2, false);
    context.closePath()
    context.fillStyle = '#ddd';
    context.fill();
    context.moveTo(155, 0);
    context.lineTo(180,0);
    context.stroke();
    context.restore();
    context.font = "14pt Calibri";
    context.fillStyle = '#555';
    context.fillText('Detector', 690,60);

    //Write the detected intensity
    context.font = "16pt Calibri";
    context.fillStyle = '#666';
    context.fillText('Detected SH intensity:', 520,215);
    context.font = "18pt Calibri";
    context.fillStyle = '#22D';
    context.fillText('I = ' + SH_intensity + ' units', 540,250);
}
