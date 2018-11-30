export APP_ROOT := $(shell dirname $(shell pwd))
export PATH := $(PATH):node_modules/.bin/:$(APP_ROOT)/deployer/bin

start:
	nodemon tsc node dist/index.js
.PHONY: start

install:
	yarn install
.PHONY: install

build:
	tsc
.PHONY: build

migrate:
	knex migrate:latest
.PHONY: build

test:
	LOG_LEVEL=3 NODE_ENV=test jest $(t)
.PHONY: test

lint:
	tslint 'src/**/*.ts'
	prettier 'src/**/*.ts' --list-different
.PHONY: lint

format:
	prettier 'src/**/*.ts' --write
.PHONY: format

clean:
	rm -r dist node_modules || true
.PHONY: clean
