document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded........');
    const vscode = acquireVsCodeApi();
        vscode.postMessage({
            command: 'callTypeScriptMethod',
            text: 'Hello from JavaScript'
        });
});