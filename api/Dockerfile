# Dockerfile
FROM pytorch/pytorch:2.5.1-cuda12.4-cudnn9-devel

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git build-essential poppler-utils

# Install dependencies excluding torch
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install flash-attn --no-build-isolation

COPY . .

EXPOSE 8001

CMD ["uvicorn", "api_service:app", "--host", "0.0.0.0", "--port", "8001"]
