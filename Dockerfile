FROM --platform=${BUILDPLATFORM} node:21 AS python-builder

RUN apt-get update && \
    apt-get install -y python3-venv python3-pip

WORKDIR /app
COPY . .

RUN python3 -m venv venv
RUN . venv/bin/activate && pip install markdown2 feedgen
RUN . venv/bin/activate && npm run build:metadata

FROM node:21

COPY package*.json ./
RUN npm i --only=production

WORKDIR /app
COPY . .

RUN npm run build:html
COPY --from=python-builder /app/blogmetadata.json ./blogmetadata.json
COPY --from=python-builder /app/rss/rss.xml ./rss/rss.xml

ENV NODE_ENV=production
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]
