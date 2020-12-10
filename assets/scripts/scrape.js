window.onload = function() {
    if (window.sessionStorage['joel_courtney_dropbox_access_token']) {
        var path = urlParams['p'];
        var type = urlParams['t'];
        var clean = urlParams['clean'];
        if (!path) {
            path = "";
        }
        if (!type) {
            type = "folder";
        }
        if (!clean) {
            clean = "n";
        }
        var xhttp = new XMLHttpRequest();
        var parameters;
        if (type == 'folder') {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var content = JSON.parse(this.responseText);
                    content.entries.sort(function(a,b) {return ( ( a.name == b.name ) ? 0 : ( ( a.name > b.name ) ? 1 : -1 ) );});
                    var text = "";
                    text += "<h1>Navigation</h1>";
                    text += '<div class="btn-group btn-group-justified btn-group-lg">';
                    if (path != "") {
                        var up = path.slice(0, path.lastIndexOf('/'));
                        text += '<a href="/scrape" target="_self" class="btn btn-danger">Root</a>';
                        text += '<a href="/scrape?p=' + up + '" target="_self" class="btn btn-danger">Up</a>';
                    } else {
                        text += '<a href="/scrape" target="_self" class="btn btn-danger disabled">Root</a>';
                        text += '<a href="/scrape" target="_self" class="btn btn-danger disabled">Up</a>';
                    }
                    text += '</div>'
                    // text += '<div class="btn-group-vertical btn-group-lg">';
                    text += '<div class="container-fluid">';
                    text += '<div class="row">';
                    var col_count = 0;
                    for (var i = 0; i < content.entries.length; i++) {
                        var node = content.entries[i];
                        if (node['.tag'] == 'folder') {
                            if (col_count == 4) {
                                col_count = 0;
                                text += '</div><div class="row">';
                            }
                            col_count++;
                            text += '<div class="col-md-3 text-center" style="padding-top:10px">';
                            text += '<a href="/scrape?p='+node.path_lower+'&t='+node['.tag']+'" target="_self" class="btn btn-primary">';
                            text += node.name;
                            text += '</a>';
                            text += '</div>';
                        }
                    }
                    text += '</div>';
                    text += '</div>';
                    text += "<h1>Files</h1>";
                    text += '<div class="container-fluid">';
                    text += '<div class="row">'; 
                    col_count = 0;
                    for (var i = 0; i < content.entries.length; i++) {
                        var node = content.entries[i];
                        if (node['.tag'] == 'file') {
                            if (col_count == 3) {
                                col_count = 0;
                                text += '</div><div class="row">';
                            }
                            col_count++;
                            text += '<div class="col-md-4 text-center" style="padding-top:10px">';
                            text += '<a href="/scrape?p='+node.path_lower+'&t='+node['.tag']+'" target="_self" class="btn btn-primary">';
                            text += node.name;
                            text += '</a>';
                            text += '</div>';
                        }
                    }
                    text += '</div>';
                    text += '</div>';
                    console.log(text);
                    document.getElementById("pastebox").innerHTML = text;
                } else {
                    console.log("Readystate: " + this.readyState);
                    console.log("Status: " + this.status);
                }
            };
            xhttp.open("POST", "https://api.dropboxapi.com/2/files/list_folder", true);
            parameters = {
                "path": path,
                "recursive": false,
                "include_media_info": false,
                "include_deleted": false,
                "include_has_explicit_shared_members": false,
                "include_mounted_folders": true,
                "include_non_downloadable_files": true,
            };
            xhttp.setRequestHeader("Authorization" , "Bearer " + window.sessionStorage['joel_courtney_dropbox_access_token']);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(parameters));
        } else if (type == 'file') {
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var content = this.responseText;
                    if (clean == "n")
                        render(content);
                    else
                        render(content, true);
                }
            }
            xhttp.open("POST", "https://content.dropboxapi.com/2/files/download", true);
            parameters = {
                'path': path
            };
            xhttp.setRequestHeader("Authorization" , "Bearer " + window.sessionStorage['joel_courtney_dropbox_access_token']);
            xhttp.setRequestHeader("Dropbox-API-Arg", JSON.stringify(parameters));
            xhttp.send();
        }
    } else {
        var text = "";
        text += "<h1>Enter Dropbox Access Key</h1>";
        text += "<p>This tool is for <b>my use only</b>. If you have stumbled across this page accidentally, don't enter an access key. If you do, I don't guarantee that you won't loose all your data.</p>";
        text += "<br />";
        text += `<form onsubmit="store_access_key()" target="_self">
        <div class="form-group">
          <label for="pwd">Access Key:</label>
          <input type="password" class="form-control" id="pwd">
        </div>
        <button type="submit" class="btn btn-danger">Submit</button>
      </form><br />`;
        paste(text, false);
    }
};

function store_access_key() {
    var p = document.getElementById("pwd").value;
    console.log(p);
    window.sessionStorage['joel_courtney_dropbox_access_token'] = p;
}
