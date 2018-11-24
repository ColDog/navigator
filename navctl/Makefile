VERSION := $(shell cat ../version)

install:
.PHONY: install

define gobuild
	CGO_ENABLED=0 GOOS=$(1) GOARCH=$(2) go build \
		-ldflags='-X main.version=$(VERSION) -extldflags "-static"' \
		-o bin/navctl-$(VERSION)-$(1)-$(2) .
endef

build:
	$(call gobuild,darwin,386)
	$(call gobuild,darwin,amd64)
	$(call gobuild,linux,386)
	$(call gobuild,linux,amd64)
	$(call gobuild,windows,386)
	$(call gobuild,windows,amd64)
	cd bin; shasum -a 256 ./* > $(VERSION)-SHA256SUM
.PHONY: build
