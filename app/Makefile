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
	react-scripts build
.PHONY: test

clean:
	rm -rf node_modules build || true
.PHONY: clean
