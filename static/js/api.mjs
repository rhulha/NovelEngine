const textPlainHeaders = new Headers({
    'Content-Type': 'text/plain',
});

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
    const requestOptions = {
        method: 'POST',
        headers: textPlainHeaders,
        body: prompt,
    };

    fetch('./api/load/'+treePath, requestOptions)
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

export function callGenerate(treePath, callback) {
    const requestOptions = {
        method: 'POST',
        headers: textPlainHeaders,
        body: prompt,
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