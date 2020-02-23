var keys = [];

window.addEventListener("keypress", function(ev) {
    keys.push(ev.key);
    var word = keys.slice(-4).join('');
    this.console.log(word);
    if (word == 'snek') {
        this.window.location.href = '/sneaky';
    } else if (word == 'home') {
        this.window.location.href = '/'
    }
});