ISTIO_VERSION := 1.0.1
K8S_VERSION := v1.11.2
HELM_VERSION := v2.9.1

export APP_ROOT := $(shell dirname $(shell pwd))
export PATH := $(PATH):node_modules/.bin/:$(APP_ROOT)/api/bin

start:
	AUTH_DISABLED=true nodemon -w ./src -x 'tsc && node dist/index.js'
.PHONY: start

start/basic:
	BASIC_AUTH=true BASIC_PASSWORD=password nodemon -w ./src -x 'tsc && node dist/index.js'
.PHONY: start/basic

start/pg:
	DATABASE_DRIVER=postgres \
	DATABASE_NAME=navigator \
	DATABASE_USER=postgres \
	DATABASE_HOST=127.0.0.1 \
	DATABASE_PASSWORD="" \
	NODE_ENV=production \
	AUTH_DISABLED=true nodemon -w ./src -x 'tsc && node dist/index.js'
.PHONY: start/pg

install/istio:
	curl -L -o istio-$(ISTIO_VERSION).tgz https://github.com/istio/istio/releases/download/$(ISTIO_VERSION)/istio-$(ISTIO_VERSION)-linux.tar.gz
	tar -xzvf istio-$(ISTIO_VERSION).tgz
	mkdir -p bin
	cp istio-$(ISTIO_VERSION)/bin/istioctl ./bin/istioctl
	rm istio-$(ISTIO_VERSION).tgz
	rm -rf istio-$(ISTIO_VERSION)
.PHONY: install/istio

install/kubectl:
	curl -LO https://storage.googleapis.com/kubernetes-release/release/$(K8S_VERSION)/bin/linux/amd64/kubectl
	chmod +x ./kubectl
	mv kubectl ./bin/
.PHONY: install/kubectl

install/helm:
	curl -L -o helm-$(HELM_VERSION).tgz https://storage.googleapis.com/kubernetes-helm/helm-$(HELM_VERSION)-linux-amd64.tar.gz
	tar -xzvf helm-$(HELM_VERSION).tgz
	mv linux-amd64/helm ./bin/helm
	rm -rf linux-amd64
	rm helm-$(HELM_VERSION).tgz
.PHONY: install/helm

install/go-getter:
	go get github.com/hashicorp/go-getter
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/go-getter github.com/hashicorp/go-getter/cmd/go-getter
.PHONY: install/go-getter

install/yarn:
	yarn install
.PHONY: install/yarn

install: install/istio install/kubectl install/helm install/go-getter install/yarn
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
	rm -r bin/ || true
	rm -r public || true
	rm development.sqlite || true
.PHONY: clean

postgres:
	docker run -e POSTGRES_DB=navigator --rm -it -p 5432:5432 postgres
.PHONY: postgres
