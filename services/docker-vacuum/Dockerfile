#
# Build Production Artifacts
# ==========================================
#
# this first step takes in the source files and build the artifacts
# (basicall all that need to be transpiled).
#
# We do install the NPM dependencies twice so to copy over to the
# production image only what is strictly needed to execute our app.
# 
# NPM Install is the first step so to exploit Docker's cache mechanism
# and speed up the building process. We will re-install from NPM only
# if we touch the `package.json` file. Which doesn't happen so often.
#

FROM node:11.11 AS builder

# NPM Install for building
WORKDIR /usr/src/app-build
ADD package.json /usr/src/app-build/package.json
RUN yarn install --production=false

# NPM Install for production
WORKDIR /usr/src/app-run
ADD package.json /usr/src/app-run/package.json
RUN cp /usr/src/app-build/yarn.lock ./
RUN yarn install --production=true

# Copy source files:
WORKDIR /usr/src/app-build
ADD index.js /usr/src/app-build
ADD .babelrc /usr/src/app-build
ADD .env /usr/src/app-build/.env
ADD .eslintrc /usr/src/app-build/.eslintrc
ADD .eslintignore /usr/src/app-build/.eslintignore

# Build backend
WORKDIR /usr/src/app-build
ADD ssr /usr/src/app-build/ssr
RUN npm run build


#
# Runner Image
# ==========================================
#
# in this step we start over with a fresh image and copy only what is
# strictly necessary in order to run a production build.
#
# the idea is to keep this image as small as possible.
#

FROM node:11.11 AS runner

# # Install GIT
# RUN apk update && apk upgrade && \
#     apk add --no-cache bash git openssh

# # Let gyp modules
# RUN apk add --no-cache --virtual .gyp \
#         python \
#         make \
#         g++ \
#     && npm install \
#         [ your npm dependencies here ] \
#     && apk del .gyp

# Copy assets for build:
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app-run/node_modules ./node_modules
COPY --from=builder /usr/src/app-build/build-ssr ./build-ssr
ADD package.json /usr/src/app
ADD index.js /usr/src/app





#
# Startup Info
# ==========================================
#

# Default environment configuration:
ENV NODE_ENV development
ENV LOG_LEVEL error
ENV DATA_PATH /var/lib/gatsby-deploy

ENTRYPOINT [ "node", "index.js" ]
