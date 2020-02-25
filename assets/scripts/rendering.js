window.MathJax = {
  loader: {load: ['[tex]/physics', '[tex]/newcommand']},
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    packages: {'[+]': ['physics', 'newcommand']},
    processEscapes: false,
    processEnvironments: true
  },
  svg: {
    fontCache: 'global'
  },
};

function add_script(s) {
  var script = document.createElement('script');
  script.src = s;
  script.async = true;
  document.head.appendChild(script);
}

add_script('https://cdn.jsdelivr.net/npm/mathjax@latest/es5/tex-svg.js');
add_script('/assets/scripts/tikzjax-min.js');
add_script('https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js');

// window.addEventListener('load', function () {
//   var content = document.body.innerHTML;
//   content = content.replace("<tikz>", "<center><script type='text/tikz'>\\begin{tikzpicture}[scale=2]");
//   content = content.replace("</tikz>", "\\end{tikzpicture}</script></center>");
//   console.log(content);
//   document.body.innerHTML = content;
//   window.dispatchEvent(new CustomEvent("renderrequest"));
// });

function prettify_code(text) {

}

var canvas_id_count = 0;
function get_canvas(script_id) {
  var id = "autogen_script_canvas-" + canvas_id_count;
  canvas_id_count++;
  var canvas = document.createElement("canvas");
  canvas.id = id;
}