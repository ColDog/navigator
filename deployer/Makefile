ISTIO_VERSION := 1.0.1
K8S_VERSION := v1.11.2
HELM_VERSION := v2.9.1

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

install/scripts:
	cp nav-deploy bin/
	cp nav-mock-deploy bin/
.PHONY: install/scripts

install: install/istio install/kubectl install/helm install/go-getter install/scripts
.PHONY: install

clean:
	rm -r bin/ || true
.PHONY: clean
