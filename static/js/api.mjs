const textPlainHeaders = new Headers({'Content-Type': 'text/plain'});
const jsonHeaders = new Headers({"Content-Type": "application/json"});

export let setClick=(id, callback)=>document.getElementById(id).addEventListener("click", callback);
export let setInputChange = (id, callback) => document.getElementById(id).addEventListener("input", callback);

export function setupTreeNodeClickEvent() {
    $('#tree').on('select_node.jstree', function (e, data) {
        let path = getSelectedTreePath();
        console.log(  path );
        let prompt = localStorage.getItem(path);
        if( prompt === null ) {
            callLoad(path, (data) => {
                document.getElementById("text-area-main").value = data;
                saveTextArea();
            });
        } else {
            document.getElementById("text-area-main").value = prompt;
        }
    });
}


export function saveTextArea() {
    var myprompt = document.getElementById("text-area-main").value;
    let path = getSelectedTreePath();
    if( path === "" ) {
        alert("Please select a tree node.");
        return;
    }
    console.log(path, myprompt);
    /*
    callSave(path, myprompt, (data) => {
        console.log(data);
    });
    */
    localStorage.setItem(path, myprompt);
}

export function getSelectedTreePath() {
    let instance = $('#tree').jstree();
    let selectedNode = instance.get_selected(true);
    if (!selectedNode || selectedNode.length === 0) {
        return "";
    }
    let path = selectedNode[0].text;
    let pointer = selectedNode[0];
    while(true) {
        if (pointer.parent === "#") {
            break;
        }
        pointer = instance.get_node(pointer.parent);
        path = pointer.text + "/" + path;
    }

    return path;
}

export function getTreeData() {
    fetch('./api/items')
        .then(response => response.json())
        .then(data => {
            $('#tree').jstree({
                'core': {
                    'data': data
                }
            })
        })
        .catch(error => {
            console.error('Error:', error);
        });

    $('#tree').on('ready.jstree', function() {
        $("#tree").jstree("open_all");          
    });
}

export function callSave(treePath, text, callback) {
    const requestOptions = {
        method: 'POST',
        headers: textPlainHeaders,
        body: text,
    };

    fetch('./api/save/'+treePath, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        callback(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export function callLoad(treePath, callback) {
    fetch('./api/load/'+treePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        callback(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

export function callGenerate(treePath, prompt, openai_api_key, callback) {
    const jsonData = {
        openai_api_key: openai_api_key,
        prompt: prompt,
    };
    const jsonStr = JSON.stringify(jsonData);

    const requestOptions = {
        method: 'POST',
        headers: jsonHeaders,
        body: jsonStr,
    };

    fetch('./api/generate/'+treePath, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        callback(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}