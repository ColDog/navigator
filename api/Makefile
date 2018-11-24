export PATH := $(PATH):node_modules/.bin/

install:
	yarn install
.PHONY: install

start:
	tsc
	node dist/index.js
.PHONY: start

build:
	tsc
.PHONY: build

migrate:
	knex migrate:latest
.PHONY: build

test:
	LOG_LEVEL=3 NODE_ENV=test jest
.PHONY: test

lint:
	tslint 'src/**/*.ts'
.PHONY: lint
