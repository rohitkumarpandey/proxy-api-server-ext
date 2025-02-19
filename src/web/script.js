document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded........');
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
    const vscode = acquireVsCodeApi();
    vscode.postMessage({
        command: 'callTypeScriptMethod',
        text: 'Hello from JavaScript'
    });
});