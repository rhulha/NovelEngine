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

function save_text_area() {
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
}

setInputChange("text-area-main", () => {save_text_area()});

setClick("reformat", ()=>{
    document.getElementById("text-area-main").value = document.getElementById("text-area-main").value.replace(/\./g, '.\r\n');
    save_text_area();
});

setClick("generate", ()=>{
    let path = getSelectedTreePath();
    if( path === "" ) {
        alert("Please select a tree node.");
        return;
    }
    console.log(path);
    // https://kilianvalkhof.com/2010/css-html/css3-loading-spinners-without-images/
    // https://stephanwagner.me/only-css-loading-spinner
    $('#generate').addClass('spinner');
    callGenerate(path, (data)=>{
        document.getElementById("text-area-main").value = data;
        $('#generate').removeClass('spinner');
    })
});

