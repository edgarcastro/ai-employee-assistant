from typing import Any
from dotenv import load_dotenv
from agents import Agent, Runner, function_tool, RunContextWrapper
from flask import Flask
from flask_socketio import SocketIO, emit
from sqlalchemy import create_engine, select, Column, Integer, String, Date, Float
from sqlalchemy.orm import DeclarativeBase, Session
import asyncio
import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a strong secret key
socketio = SocketIO(app, cors_allowed_origins="*")

engine = create_engine(os.getenv('DATABASE_URL'))

def check_db_connected():
    try:
        with engine.connect() as connection:
            connection.execute(select(1))
        print("Database is connected.")
    except Exception as e:
        print("Database connection failed:", e)

check_db_connected()



class Base(DeclarativeBase):
    pass

class Employee(Base):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    entry_date = Column(Date)
    salary = Column(Float)

def handle_error(context: RunContextWrapper[Any], error: Exception):
    print(f"Error: {error}")

@function_tool(failure_error_function=handle_error)
def get_employee_by_gender(gender: str) -> dict:
    """
    Retrieves employees by their gender.
    """
    query = select(Employee).where(Employee.gender == gender)
    with Session(engine) as session:
        employees = session.scalars(query).all()
        return [e.__dict__ for e in employees]

@function_tool(failure_error_function=handle_error)
def get_employee_highest_salary() -> dict:
    """
    Retrieves the employee with the highest salary.
    """
    query = select(Employee).order_by(Employee.salary.desc())
    with Session(engine) as session:
        employees = session.scalars(query).all()
        return [e.__dict__ for e in employees]

@function_tool(failure_error_function=handle_error)
def get_employee_lowest_salary() -> dict:
    """
    Retrieves the employee with the lowest salary.
    """
    query = select(Employee).order_by(Employee.salary.asc())
    with Session(engine) as session:
        employees = session.scalars(query).all()
        return [e.__dict__ for e in employees]

agent = Agent(
    name="Employee Agent",
    instructions=(
        "An agent that retrieves employees from the database.\n"
        "When the user asks you to retrieve employees, use the proper tool and return \n"
        "a human readable explanation of the action that was taken.\n"
    ),
    tools=[get_employee_by_gender, get_employee_highest_salary, get_employee_lowest_salary],
)

@socketio.on('user_message')
def handle_user_message(message):
    try:
        result = asyncio.run(Runner.run(agent, input=str(message)))
        emit('agent_message', result.final_output)
    except Exception as e:
        emit('agent_error', f"Error: {e}")
   
if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5050, allow_unsafe_werkzeug=True)
