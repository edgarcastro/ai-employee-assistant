# myagents

A simple web agent app with Flask, Flask-SocketIO, and OpenAI agents.

## Description

This project creates an agent for a browser-based design app called GFX. The agent can add text and images to a canvas based on user prompts. It uses Flask as the backend and real-time communication via Socket.IO.

## Features

- Accepts user input via web sockets
- Agent generates commands and explanations for a design app
- Supports adding text and images to the canvas
- Real-time communication using Flask-SocketIO

## Requirements

- Python 3.13+
- [See `pyproject.toml` for dependencies]

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/myagents.git
   cd myagents
   ```

2. **Install dependencies**:

   ```bash
   pip install .    # or: pip install -r requirements.txt
   ```

3. **Create a `.env` file** and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

## Usage

Run the app locally:

```bash
python main.py
```

This starts the Flask server with SocketIO enabled. You can connect from a browser client and send messages.

## Project Structure

```
.
├── main.py
├── agents.py
├── .env
├── .python-version
└── README.md
```

## How it works

- **Backend**: Handles incoming socket messages. When a message is received, it is processed by an agent which determines if it should add text or an image.
- **Agent**: Receives textual instructions and uses tools (`add_text` and `add_image`) to generate appropriate commands for the GFX design app.
- **Socket Events**:
  - Send `agent_message` event to trigger agent processing.
  - Server emits `message` events in response.

## Example Usage

1. **Send a message to add text**:

   ```json
   {
     "event": "agent_message",
     "data": "Add 'Hello World' to the canvas"
   }
   ```

2. **Send a message to add an image**:
   ```json
   {
     "event": "agent_message",
     "data": "Insert the company logo image"
   }
   ```

## License

MIT
