# K8s Test App

Aplicação Node.js simples para testar Kubernetes.

## Executar localmente

```bash
npm install
npm start
```

Acesse: http://localhost:3000

## Build da imagem Docker

```bash
docker build -t k8s-test-app:v1 .
```

## Executar o container

```bash
docker run -p 3000:3000 k8s-test-app:v1
```

## Endpoints

- `GET /` - Retorna mensagem com hostname e timestamp
- `GET /health` - Health check endpoint

## Deploy no Kubernetes

Exemplo de deployment básico:

```bash
# Criar deployment
kubectl create deployment k8s-test-app --image=k8s-test-app:v1

# Expor o serviço
kubectl expose deployment k8s-test-app --type=NodePort --port=3000

# Ver os pods
kubectl get pods

# Ver os services
kubectl get services
```

