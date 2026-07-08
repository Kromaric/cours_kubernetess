# Cree le cluster k3d dedie au projet restaurant.
# Ports choisis pour ne pas entrer en conflit avec le TP jurassik
# (registre 5001, loadbalancer 8080, Gitea 3000).

k3d cluster create restaurant-cluster `
    --registry-create restaurant-registry:0.0.0.0:5002 `
    --port "8082:80@loadbalancer"

kubectl config use-context k3d-restaurant-cluster
kubectl cluster-info
kubectl get nodes
