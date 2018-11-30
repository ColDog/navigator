VERSION := $(shell cat version)

export CI = true

install:
	make -C api install
	make -C app install
	make -C navctl install
	make -C deployer install
.PHONY: install

build:
	make -C api build
	make -C app build
	make -C navctl build
.PHONY: build

test:
	make -C api test
	make -C app test
	make -C navctl test
.PHONY: test

lint:
	make -C api lint
	make -C app lint
.PHONY: lint

package:
	rm -r rootapp || true

	mkdir -p rootapp
	mkdir -p rootapp/bin
	mkdir -p rootapp/charts

	cp Dockerfile rootapp/

	cp api/package.json api/yarn.lock rootapp/
	cp -r api/bin/* rootapp/bin/
	cp -r api/migrations rootapp/
	cp -r api/dist/* rootapp/

	cp -r app/build rootapp/public

	cp -r deployer/src rootapp/deployer
	cp -r deployer/bin/* rootapp/bin

	cp -r charts/* rootapp/charts/

	cp navctl/bin/navctl-$(VERSION)-linux-amd64 rootapp/bin/navctl

	docker build -t coldog/navigator:$(VERSION) rootapp
	docker tag coldog/navigator:$(VERSION) coldog/navigator:latest
.PHONY: package

run:
	docker run \
		-e AUTH_DISABLED=true \
		-p 4000:4000 \
		--rm -it \
		coldog/navigator:$(VERSION)
.PHONY: run

prerelease:
	docker push coldog/navigator:$(VERSION)
	ghr -prerelease $(VERSION) navctl/bin/
.PHONY: release

release:
	docker push coldog/navigator:$(VERSION)
	docker push coldog/navigator:latest
	ghr $(VERSION) navctl/bin/
.PHONY: release

clean:
	make -C api clean
	make -C app clean
	make -C navctl clean
	rm -r rootapp || true
.PHONY: clean

ci: install lint test build package
.PHONY: ci
