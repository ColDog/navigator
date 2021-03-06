VERSION := $(shell cat version)

export CI = true

install:
	make -C api install
	make -C app install
	make -C navctl install
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

package/build:
	rm -r .build || true

	mkdir -p .build
	mkdir -p .build/bin
	mkdir -p .build/charts

	cp Dockerfile .build/

	cp api/package.json api/yarn.lock .build/
	cp -r api/bin/* .build/bin/
	cp -r api/scripts/* .build/bin/
	cp -r api/migrations .build/
	cp -r api/dist/* .build/

	cp -r app/build .build/public

	cp -r charts/* .build/charts/

	cp navctl/bin/navctl-$(VERSION)-linux-amd64 .build/bin/navctl

	docker build -t coldog/navigator:$(VERSION) .build
	docker tag coldog/navigator:$(VERSION) coldog/navigator:latest
.PHONY: package/build

package/dist:
	rm -r .dist || true
	mkdir .dist
	cp -r navctl/bin/* .dist/
	helm package --version $(VERSION) ./charts/navigator -d .dist
	helm package --version $(VERSION) ./charts/service -d .dist
	(cd .dist; shasum -a 256 ./* > $(VERSION)-SHA256SUM)
.PHONY: package/dist

package: package/build package/dist
.PHONY: package

run:
	docker run \
		-e AUTH_DISABLED=true \
		-p 4000:4000 \
		--rm -it \
		coldog/navigator:$(VERSION)
.PHONY: run

shell:
	docker run \
		-e AUTH_DISABLED=true \
		-p 4000:4000 \
		--rm -it \
		--entrypoint=bash \
		coldog/navigator:$(VERSION)
.PHONY: shell

prerelease:
	docker push coldog/navigator:$(VERSION)
	ghr -prerelease $(VERSION) .dist/
.PHONY: release

release:
	docker push coldog/navigator:$(VERSION)
	docker push coldog/navigator:latest
	ghr $(VERSION) .dist/
.PHONY: release

clean:
	make -C api clean
	make -C app clean
	make -C navctl clean
	rm -r .build || true
	rm -r .dist || true
.PHONY: clean

ci: install lint test build package
.PHONY: ci
