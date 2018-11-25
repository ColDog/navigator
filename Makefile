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

	cp Dockerfile rootapp/

	cp api/package.json api/yarn.lock rootapp/
	cp -r api/bin/* rootapp/bin/
	cp -r api/migrations rootapp/
	cp -r api/dist/* rootapp/

	cp -r app/build rootapp/public

	cp -r deployer/src rootapp/deployer
	cp -r deployer/bin/* rootapp/bin

	docker build -t coldog/navigator:$(VERSION) rootapp
.PHONY: package

run:
	docker run \
		-e AUTH_DISABLED=true \
		-p 4000:4000 \
		--rm -it \
		coldog/navigator:$(VERSION)
.PHONY: run

release: build package
	docker push coldog/navigator:$(VERSION)
	ghr $(VERSION) bin/
.PHONY: release

clean:
	make -C api clean
	make -C app clean
	make -C navctl clean
	rm -r rootapp || true
.PHONY: clean

ci: clean install lint test build package
.PHONY: ci
