var ctx1 = null;
var ctx2 = null;

var width = 0;
var height1 = 0;
var height2 = 0;
var total_height = 0;

var center = {x:-0.743643908147151, y:0.131825894205330};
var zoom = 1/0.000000000051299;

var max_iterations = 10000;
var pixels_per_frame = 300;

var queried = false;
var data1 = []
var data2 = []
var start = 0;

var scan_i = 0;

function start_mandelbrot() {
  var d = new Date();
  start = d.getTime()/1000;
  var canvas1 = $("#mandelbrot-1")[0];
  var canvas2 = $("#mandelbrot-2")[0];
  width = parseInt(window.getComputedStyle(canvas1).width);
  console.log(width);
  console.log(parseInt(window.getComputedStyle(canvas2).width));
  height1 = parseInt(window.getComputedStyle(canvas1).height);
  height2 = parseInt(window.getComputedStyle(canvas2).height);
  total_height = height1+height2;
  scan_i = width * (total_height+1);

  canvas1.width = width;
  canvas2.width = width;
  canvas1.height = height1;
  canvas2.height = height2;
  ctx1 = canvas1.getContext("2d");
  ctx2 = canvas2.getContext("2d");
  ctx1.fillStyle = "rgba(0,0,0,0)";
  ctx2.fillStyle = "rgba(0,0,0,0)";
  ctx1.fillRect(0,0,width,height1);
  ctx2.fillRect(0,0,width,height2);
  draw();
}

function draw() {
  if (scan_i >= 0) {
    window.requestAnimationFrame(draw);
  }
  for (var i = 0; i < pixels_per_frame; i++) {
    let px = scan_i % width;
    let py = Math.floor(scan_i / width);
    do_mandelbrot(px,py);
    scan_i--;
  }
}

function hslToRgb(h, s, l){
  var r, g, b;
  var hue2rgb = function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  var p = 2 * l - q;
  //q = 1, p = 0
  r = hue2rgb(p, q, h + 1/3);
  g = hue2rgb(p, q, h);
  b = hue2rgb(p, q, h - 1/3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function do_mandelbrot(px, py) {
  var c_real = (px - width/2)/zoom + center.x;
  var c_imag = (total_height/2 - py)/zoom + center.y;

  var z_real = 0;
  var z_imag = 0;

  var z_real_sqr = 0;
  var z_imag_sqr = 0;
  var j = 0;
  while (z_real_sqr + z_imag_sqr < 4 && j < max_iterations) {
    z_imag = (z_real+z_imag)*(z_real+z_imag) - z_real_sqr - z_imag_sqr + c_imag;
    z_real = z_real_sqr - z_imag_sqr + c_real;
    z_real_sqr = z_real*z_real;
    z_imag_sqr = z_imag*z_imag;
    j++;
  }

  if (j < max_iterations) {
    var scale_j = (j/max_iterations);
    var rgb = hslToRgb(((1/3)+scale_j)%1, 1, 0.5)
    color = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.5)";
    if (py <= height1) {
      ctx1.fillStyle = color;
      ctx1.fillRect(px,py,1,1);
    } else {
      ctx2.fillStyle = color;
      ctx2.fillRect(px, py-height1-1, 1, 1);
    }
  }
}
