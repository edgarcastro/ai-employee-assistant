# Use an official Python runtime as a parent image
FROM python:3.13-alpine

# Set the working directory in the container
WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the requirements file into the container at /app
COPY pyproject.toml .
COPY uv.lock .

# Install any needed packages specified in pyproject.toml
RUN uv sync --locked

# Copy the current directory contents into the container at /app
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5050

# Run main.py when the container launches
CMD ["uv", "run", "main.py"]
