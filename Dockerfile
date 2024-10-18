FROM node:21

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3-venv python3-pip

# Set working directory
WORKDIR /app

# Create a virtual environment
RUN python3 -m venv venv

RUN . venv/bin/activate && pip install markdown2 feedgen

COPY package*.json ./
RUN npm i --only=production

COPY . .

RUN . venv/bin/activate && npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "run", "start"]

