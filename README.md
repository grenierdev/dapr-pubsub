> Based on https://github.com/vfarcic/dapr-demo/tree/main

# 1. Install Rootless Docker

## Install
```sh
curl -o rootless-install.sh -fsSL https://get.docker.com/rootless
sh rootless-install.sh
export PATH=$HOME/bin:$PATH
sudo mkdir -p /etc/systemd/system/user@.service.d
cat <<EOF | sudo tee /etc/systemd/system/user@.service.d/delegate.conf
[Service]
Delegate=cpu cpuset io memory pids
EOF
sudo systemctl daemon-reload
docker context use rootless
export DOCKER_HOST=unix:///run/user/1000/docker.sock
```

## Service
```sh
systemctl --user start docker
systemctl --user stop docker
systemctl --user status docker

```

# 2. Install Minikube (Kubernetes)

## Install
```sh
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start --driver=docker --container-runtime=containerd
```

## Dashboard
```sh
minikube dashboard
```

# 3. Install Helm

## Install
```sh
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## Install Helm repos
```sh
helm repo add dapr https://dapr.github.io/helm-charts
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

# 4. Install Dapr with Redis backend

## Install
```sh
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
kubectl create namespace dapr-test
helm upgrade --install dapr dapr/dapr --namespace dapr-test --wait
helm upgrade --install dapr-dashboard dapr/dapr-dashboard --namespace dapr-test --wait
helm upgrade --install redis bitnami/redis --namespace dapr-test --wait
kubectl --namespace dapr-test apply --filename redis-dapr.yaml
```

## Dashboard
```sh
dapr dashboard -k -n dapr-test
```

# 5. Deploy Services
```sh
kubectl create namespace dapr-apps
docker build ./publisher -t dapr-deno-publisher
docker build ./worker -t dapr-deno-worker
minikube image load dapr-deno-publisher
minikube image load dapr-deno-worker
kubectl --namespace dapr-apps apply --filename apps.yaml
kubectl --namespace dapr-apps rollout status deployment publisher
```