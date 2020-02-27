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

var delimiters = [
    ["<tikz>", "</tikz>"],
    ["$%", "%$"],
    ["$$", "$$"],
    ["$", "$"]
];

var replacements = [
    [/<tikz>/g, '<center><sc'+'ript type="text/tikz">\\begin{tikzpicture}[scale=2]'],
    [/<\/tikz>/g, '\\end{tikzpicture}</scr'+'ipt></center>'],
    [/\$%/g, "\\begin{align}"],
    [/%\$/g, "\\end{align}"],
    [/<table>/g, '<table class="table table-bordered table-nonfluid">']
]

function convert(text) {
    var result = text;
    var cuts = [];
    var cut_counter = 0;
    for (var d = 0; d < delimiters.length; d++) {
        var pair = delimiters[d];
        var i = result.indexOf(pair[0]);
        while (i != -1) {
            var j = result.indexOf(pair[1], i+1);
            if (j == -1) {
                console.log("missing close delimiter: " + pair[1]);
                return "missing close delimiter: " + pair[1];
            }
            var cut = result.slice(i, j+pair[1].length);
            cuts.push(cut);
            result = result.slice(0, i) + "%%%" + cut_counter++ + "%%%" + result.slice(j+pair[1].length);
            i = result.indexOf(pair[0]);
        }
    }
    var converter = new showdown.Converter();
    converter.setOption('tables', true);
    converter.setOption('literalMidWordUnderscores', false);
    converter.setFlavor('github');
    result = converter.makeHtml(result);
    for (var i = 0; i < cuts.length; i++) {
        result = result.replace("%%%" + i + "%%%", function() {return cuts[i];});
    }
    for (var i = 0; i < replacements.length; i++) {
        result = result.replace(replacements[i][0], replacements[i][1]);
    }
    return result;
}

function render(text, clean, from_link) {
    if (clean) {
        paste(text, true);
        document.body.className = "";
        var stylesheets = document.getElementsByTagName('link'), i, sheet;
        for (i in stylesheets) {
            sheet = stylesheets[i];
            if (sheet.parentNode) {
                if (sheet.getAttribute('type').toLowerCase() == 'text/css')
                    sheet.parentNode.removeChild(sheet);
            }
        }
        var link = $("<link />", {
            rel: "stylesheet",
            type: "text/css",
            href: "/assets/css/render_style.css"
        });
        $('head').append(link);
    } else {
        paste(text, false);
    }
    window.dispatchEvent(new CustomEvent("renderrequest"));
    MathJax.typesetPromise();
}

function prettify_code(text) {

}

var canvas_id_count = 0;
function get_canvas(script_id) {
  var id = "autogen_script_canvas-" + canvas_id_count;
  canvas_id_count++;
  var canvas = document.createElement("canvas");
  canvas.id = id;
}

function paste(text, body) {
    if (body) {
        document.body.innerHTML = text;
    } else {
        document.getElementById("pastebox").innerHTML = text;
    }
}