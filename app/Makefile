export PATH := $(PATH):node_modules/.bin/

start:
	react-scripts start
.PHONY: start

install:
	yarn install
.PHONY: install

build:
	react-scripts build
.PHONY: build

test:
	react-scripts test
.PHONY: test

lint:
	prettier 'src/**/*.js' --list-different
.PHONY: lint

format:
	prettier 'src/**/*.js' --write
.PHONY: format

clean:
	rm -rf node_modules build || true
.PHONY: clean
