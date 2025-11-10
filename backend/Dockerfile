# Use official lightweight Python image
FROM python:3.13-slim

# Set working directory inside the container
WORKDIR /app

# Install essential system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY Pipfile Pipfile.lock ./

# Install pipenv and dependencies
RUN pip install --no-cache-dir pipenv && \
    pipenv requirements > requirements.txt || pipenv run pip freeze > requirements.txt && \
    pip install --no-cache-dir -r requirements.txt

# Install Django CORS Headers (in case not listed in Pipfile)
RUN pip install --no-cache-dir django-cors-headers

# Copy project files into container
COPY . .

# Set environment variables (prevent Django from writing .pyc files)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose Django's default port
EXPOSE 8000

# Run Django development server (SQLite-based)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
