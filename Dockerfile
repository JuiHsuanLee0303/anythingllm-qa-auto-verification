# --- Base Stage ---
# Use an official Python runtime as a parent image
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# --- Builder Stage ---
# This stage installs dependencies
FROM base AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt


# --- Final Stage ---
# This stage copies the application code and installed dependencies
FROM base

# Copy wheels from builder stage
COPY --from=builder /app/wheels /app/wheels

# Install dependencies from local wheels
RUN pip install --no-cache /app/wheels/*

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Define the command to run the application using Gunicorn
# --workers 4: Specifies the number of worker processes.
# --bind 0.0.0.0:5001: Binds the server to all network interfaces on port 5001.
# --timeout 120: Sets the worker timeout to 120 seconds for long-running tasks.
# app:app: Specifies the module 'app' and the Flask instance 'app' within it.
CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:5001", "--timeout", "120", "app:app"] 