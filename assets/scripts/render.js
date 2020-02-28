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

function render(input, clean, from_link) {
    var text = input;
    var cuts = [];
    var scripts = [];
    var i = text.indexOf('<script');
    while (i != -1) {
        var j = text.indexOf('</script>');
        if (j == -1) {
            console.log("missing close script tag");
            return "missing close script tag";
        }
        var script = text.slice(i, j+'</script>'.length);
        scripts.push(script);
        text = text.slice(0,i) + text.slice(j+'</script>'.length);
        i = text.indexOf('<script');
    }
    var cut_counter = 0;
    for (var d = 0; d < delimiters.length; d++) {
        var pair = delimiters[d];
        var i = text.indexOf(pair[0]);
        while (i != -1) {
            var j = text.indexOf(pair[1], i+1);
            if (j == -1) {
                console.log("missing close delimiter: " + pair[1]);
                return "missing close delimiter: " + pair[1];
            }
            var cut = text.slice(i, j+pair[1].length);
            cuts.push(cut);
            text = text.slice(0, i) + "%%%" + cut_counter++ + "%%%" + text.slice(j+pair[1].length);
            i = text.indexOf(pair[0]);
        }
    }
    var converter = new showdown.Converter();
    converter.setOption('tables', true);
    converter.setOption('literalMidWordUnderscores', false);
    converter.setFlavor('github');
    text = converter.makeHtml(text);
    for (var i = 0; i < cuts.length; i++) {
        text = text.replace("%%%" + i + "%%%", function() {return cuts[i];});
    }
    for (var i = 0; i < replacements.length; i++) {
        text = text.replace(replacements[i][0], replacements[i][1]);
    }
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
    for (var i = 0; i < scripts.length; i++) {
        $('head').append(scripts[i]);
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