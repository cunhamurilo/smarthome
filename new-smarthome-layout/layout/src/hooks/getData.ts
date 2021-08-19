

export function getData() {

    let responseText = ''
    var xhr = new XMLHttpRequest();
    xhr.open('GET', serverPath, true);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return;
        responseText = this.responseText;
        console.log(responseText)
    };
    xhr.send();


    return responseText

}