function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            var text = e.target.result;
            render(text, true);
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

window.onload = function () {
    window.dispatchEvent(new CustomEvent("renderrequest"));
    document.getElementById('upload').addEventListener('change', handleFileSelect, false);
};