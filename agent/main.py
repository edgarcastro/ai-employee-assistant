from dotenv import load_dotenv
from agents import Agent, Runner, function_tool
from flask import Flask
from flask_socketio import SocketIO, emit
import asyncio

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a strong secret key
socketio = SocketIO(app, cors_allowed_origins="*")

@function_tool
def add_text(text: str):
    emit('add_text', text)


@function_tool
def add_image(url: str):
    emit('add_image', url)

agent = Agent(
    name="Design Agent",
    instructions=(
        "An agent that generates commands for a design app installed in the browser called GFX.\n"
        "You can add text and images to the canvas.\n"
        "When the user asks you to add something, use the appropriate tool and return \n"
        "a human readable explanation of the action that was taken.\n"
    ),
    tools=[add_text, add_image],
)

@socketio.on('message')
def handle_my_event(json):
    print('received json: ' + str(json))
    emit('message', json)

@socketio.on('agent_message')
def handle_agent_message(message):
    print('received agent message: ' + str(message))
    result = asyncio.run(Runner.run(agent, input=str(message)))
    print(result.final_output)
    emit('message', result.final_output)
    return "OK"
   
if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5050, allow_unsafe_werkzeug=True)
