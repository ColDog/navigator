FROM alpine:3.8
RUN apk add --no-cache --update \
    git \
    nodejs \
    python3 \
    yarn \
    bash \
  && \
  pip3 install --upgrade pip setuptools && \
  pip --no-cache-dir install pyyaml ansicolors

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/src/app/bin \
  DEPLOYER_ROOT=/usr/src/app/deployer \
  APP_ROOT=/usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install --production

CMD ["node", "index.js"]
