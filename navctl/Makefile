VERSION := $(shell cat ../version)

clean:
	rm -r bin/ || true
.PHONY: clean

install:
.PHONY: install

define gobuild
	CGO_ENABLED=0 GOOS=$(1) GOARCH=$(2) go build \
		-ldflags='-X main.version=$(VERSION) -extldflags "-static"' \
		-o bin/navctl-$(VERSION)-$(1)-$(2) .
endef

build: clean
	$(call gobuild,darwin,386)
	$(call gobuild,darwin,amd64)
	$(call gobuild,linux,386)
	$(call gobuild,linux,amd64)
	$(call gobuild,linux,arm)
	$(call gobuild,linux,arm64)
	$(call gobuild,windows,386)
	$(call gobuild,windows,amd64)
.PHONY: build


test:
.PHONY: test
