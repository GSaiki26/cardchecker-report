# Basics
FROM node:19.2-alpine
WORKDIR /app

# Envs
ENV CARDCHECKER_PROTO_URI https://raw.githubusercontent.com/GSaiki26/cardchecker-api/master/app/src/proto/cardchecker.proto
ENV WORKER_PROTO_URI https://raw.githubusercontent.com/GSaiki26/worker-api/master/app/src/proto/worker.proto
# Update the container
RUN apk upgrade --update --no-cache
RUN apk add --no-cache wget tzdata

# Configure the user
RUN chown -R node /app
USER node

# Install the packages
COPY --chown=node ./package.json .
RUN yarn install --production

# Copy the project
COPY --chown=node ./tsconfig.json .
RUN mkdir src; mkdir src/proto;
RUN wget "$CARDCHECKER_PROTO_URI" -O ./src/proto/cardchecker.proto
RUN wget "$WORKER_PROTO_URI" -O ./src/proto/worker.proto

COPY --chown=node ./src ./src

# Get the proto from the cardchecker api


# Build and run
RUN yarn run build
CMD yarn run start:prod
