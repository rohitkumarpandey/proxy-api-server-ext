# Proxy API Server Extension

The **Proxy API Server Extension** is a Visual Studio Code extension designed to help developers quickly set up a local server for mocking API responses. This extension simplifies the process of creating and managing mock APIs, making it easier to test and debug applications without relying on external services.

---

## Features

- **Start a Mock Server**: Instantly start a local server to serve mock API responses.
- **Customizable Responses**: Define response bodies, headers, and HTTP status codes for your APIs.
- **Dynamic API Management**: Add, update, or delete APIs on the fly.
- **Simulate Latency**: Test your application under different network conditions by simulating response delays.
- **Integrated Web Interface**: Manage APIs through an intuitive web-based interface embedded in the extension.

---

## Installation

1. Install the extension from the Visual Studio Code Marketplace.
2. Ensure you have Node.js installed on your system.

---

## Usage

### 1. Start the Server
- Click on the Proxy API Server in the status bar to start the server.
- Alternatively, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
- Run the command: **"Proxy API Server: Start Server"**.

### 2. Define Mock APIs
- Use the web interface to create and configure APIs.
- Specify the HTTP method, endpoint, response body, headers, and status code.

### 3. Test Your APIs
- Access your mock APIs at `http://localhost:5256/<endpoint>` using tools like Postman, cURL, or your application.
- Access server status at `http://localhost:5256/pas/status` to view the details like server status, port and list of mocked apis.
