import {setClick, setInputChange, callLoad, saveTextArea, setupTreeNodeClickEvent, callGenerate, getTreeData, getSelectedTreePath} from './api.mjs';

$(function () {
    getTreeData();
    setupTreeNodeClickEvent();
    setInputChange("text-area-main", () => {saveTextArea()});

    let oak = document.getElementById("openai_api_key").value;

    if( oak === "" ) {
        document.getElementById("openai_api_key").value = localStorage.getItem("openai_api_key");
    }

});

setClick("reformat", ()=>{
    let text = document.getElementById("text-area-main").value;
    text = text.replace(/\./g, '.\r\n');
    text = text.replace(/^"|"$/g, '');
    document.getElementById("text-area-main").value = text;
    saveTextArea();
});

setClick("save_api_key", ()=>localStorage.setItem("openai_api_key", document.getElementById("openai_api_key").value));

setClick("reset", ()=>{
    let path = getSelectedTreePath();
    if( path === "" ) {
        alert("Please select a tree node.");
        return;
    }
    callLoad(path, (data) => {
        document.getElementById("text-area-main").value = data;
        saveTextArea();
    });
});

setClick("generate", ()=>{
    let path = getSelectedTreePath();
    if( path === "" ) {
        alert("Please select a tree node.");
        return;
    }
    console.log(path);

    let prompt = document.getElementById("text-area-main").value;
    if( prompt === "" ) {
        alert("Please input a prompt.");
        return;
    }

    let match = prompt.match(/{{(.*?)}}/);
    if( match ) {
        let get_path = match[1];
        let get_prompt = localStorage.getItem(get_path);
        prompt = prompt.replace(/{{(.*?)}}/, get_prompt);
    }

    let openai_api_key = document.getElementById("openai_api_key").value;
    


    // https://kilianvalkhof.com/2010/css-html/css3-loading-spinners-without-images/
    // https://stephanwagner.me/only-css-loading-spinner
    $('#generate').addClass('spinner');
    callGenerate(path, prompt, openai_api_key, (data)=>{
        document.getElementById("text-area-main").value = data;
        saveTextArea();
        $('#generate').removeClass('spinner');
    })
});

