# ai-employee-assistant

A web-based AI agent application that queries employee data from a MySQL database using OpenAI Agents SDK, Flask, Flask-SocketIO, and React.

![Demo](demo.gif)

## Description

This project creates an intelligent agent that can query and retrieve employee information from a MySQL database. The agent uses OpenAI's Agents SDK to understand natural language queries and execute appropriate database operations. It features a modern React frontend with real-time communication via Socket.IO.

## Features

- **AI-Powered Database Queries**: Natural language interface to query employee data
- **Real-time Communication**: WebSocket-based communication between frontend and backend
- **MySQL Database**: Persistent storage with pre-populated employee data (100+ records)
- **Multiple Query Tools**:
  - Filter employees by gender
  - Find employees with highest salary
  - Find employees with lowest salary
- **Docker Support**: Easy deployment with Docker Compose
- **Modern Stack**: React + TypeScript frontend, Flask + SQLAlchemy backend

## Requirements

- Docker
- OpenAI API Key
- Node.js 22+ (for local development)
- Python 3.13+ (for local development)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/edgarcastro/ai-employee-assistant.git
   cd ai-employee-assistant
   ```

2. **Create a `.env` file** in the `agent/` directory:

   ```bash
   cd agent
   cp .env.example .env
   ```

   Then add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=mysql+pymysql://myagents_user:myagents_password@mysql:3306/myagents_db
   ```

3. **Start the application with Docker Compose**:

   ```bash
   docker compose up --build
   ```

   This will start:

   - MySQL database on port 3306
   - Flask backend (agent) on port 5050
   - React frontend (client) on port 3000

## Usage

### Using Docker Compose (Recommended)

```bash
docker compose up
```

Access the application at `http://localhost:3000`

### Local Development

**Backend (Agent)**:

```bash
cd agent
pip install -e .
python main.py
```

**Frontend (Client)**:

```bash
cd client
yarn install
yarn dev
```

**Database**:
The MySQL database will be automatically initialized with the `employees` table and 100 test records when using Docker Compose.

## Project Structure

```
.
├── agent/                 # Flask backend with OpenAI Agents
│   ├── main.py           # Main application file
│   ├── Dockerfile        # Backend container configuration
│   ├── pyproject.toml    # Python dependencies
│   └── .env              # Environment variables (create from .env.example)
├── client/               # React frontend
│   ├── src/
│   │   ├── App.tsx       # Main React component
│   │   └── components/   # React components
│   ├── Dockerfile        # Frontend container configuration
│   └── package.json      # Node.js dependencies
├── database/
│   └── init.sql          # Database initialization script
├── docker-compose.yml    # Docker orchestration
└── README.md
```

## How it works

- **Frontend (React)**: Provides a chat interface where users can ask questions about employees
- **Backend (Flask + SocketIO)**: Receives messages via WebSocket and processes them through the OpenAI Agent
- **Agent (OpenAI Agents SDK)**: Interprets natural language queries and selects appropriate tools to query the database
- **Database (MySQL)**: Stores employee data with fields: id, name, age, gender, entry_date, salary
- **Tools Available**:
  - `get_employee_by_gender`: Filters employees by gender (Male, Female, Other)
  - `get_employee_highest_salary`: Returns employees with the highest salary
  - `get_employee_lowest_salary`: Returns employees with the lowest salary

## Example Usage

1. **Query employees by gender**:

   ```
   "Show me all male employees"
   "Find all female employees"
   ```

2. **Find salary information**:

   ```
   "Who has the highest salary?"
   "Show me the employee with the lowest salary"
   ```

3. **Natural language queries**:
   ```
   "How many employees are there?"
   "What's the average salary?"
   ```

## Database Schema

The `employees` table contains:

- `id`: Primary key (auto-increment)
- `name`: Employee name (VARCHAR)
- `age`: Employee age (INT)
- `gender`: Gender (VARCHAR: Male, Female, Other)
- `entry_date`: Date of entry (DATE)
- `salary`: Salary amount (DECIMAL)

The database is pre-populated with 100 test records.

## Socket Events

- **Client → Server**: `user_message` - Sends user query to the agent
- **Server → Client**: `agent_message` - Returns agent response
- **Server → Client**: `agent_error` - Returns error messages
