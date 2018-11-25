FROM alpine:3.8
RUN apk add --no-cache --update \
    nodejs \
    python3 \
    yarn \
    bash \
  && \
  pip3 install --upgrade pip setuptools && \
  pip --no-cache-dir install pyyaml ansicolors

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/src/app/bin
ENV DEPLOYER_ROOT=/usr/src/app/deployer

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install --production

CMD ["node", "index.js"]
