import {callSave, callLoad, callGenerate, getTreeData, getSelectedTreePath} from './api.mjs';

$(function () {
    getTreeData();
    $('#tree').on('select_node.jstree', function (e, data) {
        let path = data.node.text;
        let pointer = data.node;
        while(true) {
            if (pointer.parent === "#") {
                break;
            }
            pointer = data.instance.get_node(pointer.parent);
            path = pointer.text + "/" + path;

        }
        console.log(  path );

        callLoad(path, (data) => {
            document.getElementById("text-area-main").value = data;
        });
    });
});

let setClick=(id, callback)=>document.getElementById(id).addEventListener("click", callback);
let setInputChange = (id, callback) => document.getElementById(id).addEventListener("input", callback);

setInputChange("text-area-main", () => {
    var myprompt = document.getElementById("text-area-main").value;
    let path = getSelectedTreePath();
    if( path === "" ) {
        alert("Please select a tree node.");
        return;
    }
    console.log(path, myprompt);
    callSave(path, myprompt, (data) => {
        console.log(data);
    });
});

setClick("gen", ()=>{
    var myprompt = document.getElementById("text-area-main").value;
    //myprompt = myprompt.replace(/[^a-zA-Z0-9\\., ]/g, "");
    console.log(myprompt);
    callGenerate(myprompt, (data)=>{
        document.getElementById("text-area-main").value = data;
    })
});

