import * as http from 'http';
import * as vscode from './vscode-apis';
const PORT = 9000;

let server: http.Server;
const startServer = () => {
    server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello from VS Code Extension Server!\n');
    });

    server.listen(3000, 'localhost', () => {
        vscode.toastMessage(`Server started on http://localhost:${PORT}`);
    });
}

const stopServer = () => {
    if (server) {
        server.close(() => {
            vscode.toastMessage('Server stopped');
        });
    }
}

const startStopServer = () => {
    server && server.listening ? stopServer() : startServer();
}

export {
    startServer,
    stopServer,
    startStopServer
};