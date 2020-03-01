---
title: Renderer Tool
permalink: render
scripts:
    - https://cdn.plot.ly/plotly-latest.min.js
    - /assets/scripts/render.js
    - https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js
    - https://cdn.jsdelivr.net/npm/mathjax@latest/es5/tex-svg.js
    - https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js
    - https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
    - /assets/scripts/params.js
    - /assets/scripts/tikzjax-min.js
    - /assets/scripts/upload_render.js
---
# Markdown, MathJax, and TikzJax Renderer
<form enctype="multipart/form-data">
<div class="form-group">
    <label for="upload">Upload a markdown file:</label>
    <input class="btn btn-primary form-control-file" id="upload" type="file" accept="text/md" name="files[]" size=30>
</div>
</form>

# How to use

This is my own homebrew Markdown, so there are some rules.

## $\LaTeX$ Math

This uses MathJax for $\LaTeX$ math rendering. Use the `$...$` delimiters for inline math, and the `$$...$$` delimiters for centered equations. Also use the custom `$%...%$` delimiters for a centered align block. Example:

```latex
$%
z &= re^{i\theta} & \text{polar form} \\
&= r\cdot (\cos(\theta)+i\sin(\theta)) & \text{Euler's formula}
%$
```

Produces:

\begin{align}
z &= re^{i\theta} & \text{polar form} \\\ 
&= r\cdot (\cos(\theta)+i\sin(\theta)) & \text{Euler's formula}
\end{align}

The Physics and NewCommand libraries are already included.

## Tikz Diagrams

You can embed Tikz diagrams by surrounding your code with `<tikz></tikz>` tags. Example:

```latex
<tikz>
\draw (0,0) circle (1);
\draw (0,0) circle (2);
\draw[dotted] (0,0) circle (1.5);
\draw (0,0) -- (1,0);
\draw (0,0) -- (0,2);
\node[above] at (0.5, 0) {$a$};
\node[right] at (0, 1.3) {$b$};
\draw[dotted] (0,0) -- (-1.06, 1.06);
\node[above, right] at (-0.4, 0.4) {$s$};
</tikz>
```

Produces:

{% capture c %}
\draw (0,0) circle (1);
\draw (0,0) circle (2);
\draw[dotted] (0,0) circle (1.5);
\draw (0,0) -- (1,0);
\draw (0,0) -- (0,2);
\node[above] at (0.5, 0) {$a$};
\node[right] at (0, 1.3) {$b$};
\draw[dotted] (0,0) -- (-1.06, 1.06);
\node[above, right] at (-0.4, 0.4) {$s$};
{% endcapture %}
{% include tikz.html c=c %}

The diagram will automatically avoid page breaks when printing. You can include $\LaTeX$ in node text, but it might not render complicated expressions properly.

## Scripting and Plotting

If you'd like to use Javascript, you can just place a `<script>` tag in the middle of your markdown. It will be automatically lifted into the head of the document and run. If you'd like a div for plotting, use `<script div>` and reference the div id with `%%%div%%%`. Example:

```html
<script div>
var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter'
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter'
};

var data = [trace1, trace2];

Plotly.newPlot('%%%div%%%', data);
</script>
```

Produces:

<div id="placeholder" style="width:600px;height:300px;" class="scriptdiv"></div>
<script>
var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter'
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter'
};

var data = [trace1, trace2];

Plotly.newPlot('placeholder', data);
</script>

Plotly.js is automatically included.