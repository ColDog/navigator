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

test: build
	rm test.sqlite || true
	NODE_ENV=test node dist/migrate.js
	LOG_LEVEL=3 NODE_ENV=test jest $(t)
.PHONY: test

lint:
	tslint 'src/**/*.ts'
.PHONY: lint

clean:
	rm -r dist node_modules || true
.PHONY: clean
