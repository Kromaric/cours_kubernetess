# Infra dédiée — Restaurant App

Architecture identique au TP `kube_cicd` (Jurassik), mais totalement isolée :

| Composant | Valeur (dédiée) | TP Jurassik (pour mémoire) |
|-----------|-----------------|----------------------------|
| Cluster k3d | `restaurant-cluster` | `jurassik-cluster` |
| Registre | `restaurant-registry` (hôte : `localhost:5002`, interne : `restaurant-registry:5000`) | `jurassik-registry` / 5001 |
| Load balancer | http://localhost:8081 | 8080 |
| Gitea | http://localhost:3100 (SSH : 223) | 3000 / 222 |
| Grafana (port-forward) | 3002 | 3001 |

## Démarrage (dans l'ordre)

### 1. Créer le cluster

```powershell
.\infra\setup-k3d.ps1
```

### 2. Démarrer Gitea + runner

```powershell
cd infra
docker-compose up -d
```

Puis sur http://localhost:3100 :
1. Créer le compte admin.
2. Créer un dépôt `restaurant-app`.
3. Générer le token du runner :
   ```powershell
   docker exec -u git gitea-restaurant gitea actions generate-runner-token
   ```
4. Coller le token dans `GITEA_RUNNER_REGISTRATION_TOKEN` (docker-compose.yml), puis :
   ```powershell
   docker-compose up -d --force-recreate runner
   ```

### 3. Secret KUBECONFIG

Le `~/.kube/config` contient tous les clusters de la machine (minikube, etc.) :
on extrait **uniquement** le contexte du cluster restaurant, certificats inclus,
et on le copie dans le presse-papier :

```powershell
kubectl config view --minify --flatten --context=k3d-restaurant-cluster | Set-Clipboard
```

Coller le contenu dans un secret Gitea nommé `KUBECONFIG`
(dépôt → Paramètres → Actions → Secrets).

### 4. Appliquer la config sensible (une seule fois)

`01-config.yaml` (Secret + ConfigMap) est hors du dépôt (.gitignore) :

```powershell
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-config.yaml
```

### 5. Pousser le code

```powershell
git remote add gitea http://localhost:3100/<admin>/restaurant-app.git
git push gitea main
```

Le pipeline `.gitea/workflows/cicd.yaml` build les deux images, les pousse
sur `localhost:5002` et déploie les manifestes. L'app est ensuite sur
**http://localhost:8081** (front) et **http://localhost:8081/api** (API).

## Points d'attention

- **Registre : deux noms pour la même chose.** Le pipeline pousse sur
  `localhost:5002` (port publié sur l'hôte), les manifestes tirent depuis
  `restaurant-registry:5000` (nom + port internes au réseau Docker).
- **L'ingress utilise Traefik** (fourni par k3s), pas nginx : la réécriture
  `/api/*` → `/*` passe par un Middleware `StripPrefix` (voir `06-ingress.yaml`).
- **Le réseau `k3d-restaurant-cluster` doit exister avant `docker-compose up`**
  → toujours créer le cluster (étape 1) en premier.
- **Conflits de ports avec le TP** : les deux infras peuvent tourner en même
  temps, mais c'est lourd. Arrêter celle qui ne sert pas :
  `k3d cluster stop jurassik-cluster` / `k3d cluster stop restaurant-cluster`.

## Monitoring — requis pour le livrable

```powershell
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack --namespace monitoring

# Grafana sur http://localhost:3002 (admin / mot de passe ci-dessous)
kubectl --namespace monitoring port-forward svc/kube-prometheus-stack-grafana 3002:80
kubectl --namespace monitoring get secrets kube-prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
```

### Observer le CPU / RAM des composants (exigence du livrable)

Aucune modification du code n'est nécessaire : **cAdvisor** (intégré à la stack)
collecte le CPU/RAM de tous les conteneurs du cluster.

Dans Grafana : **Dashboards** → **Kubernetes / Compute Resources / Namespace (Pods)**
→ sélectionner le namespace **`restaurant`**. On y voit la consommation CPU et
mémoire des pods `backend`, `frontend` et `postgres`.

Vérification rapide en CLI :
```powershell
kubectl top pods -n restaurant
```

Requêtes PromQL équivalentes (Grafana Explore ou Prometheus) :
```promql
# CPU du backend
rate(container_cpu_usage_seconds_total{namespace="restaurant", pod=~"backend.*", container!=""}[5m])

# RAM du backend
container_memory_working_set_bytes{namespace="restaurant", pod=~"backend.*", container!=""}
```

### Bonus (au-delà du minimum demandé)

Métriques applicatives NestJS (latence HTTP, event loop…) : package
`@willsoto/nestjs-prometheus`, puis un ServiceMonitor avec
`namespaceSelector.matchNames: [restaurant]` et
`selector.matchLabels.app: backend` (le label est déjà posé sur `backend-svc`).
Loki/Promtail pour les logs : voir l'étape 4 du TP jurassik.

## Checklist du livrable (notation)

| Exigence | Où c'est réalisé |
|----------|------------------|
| Push git → mise à jour du composant | `.gitea/workflows/cicd.yaml`, déclenché sur `push` vers `main` |
| Build du composant | Steps « Build backend/frontend component » (stage `builder` des Dockerfiles : `nest build` / `react-scripts build`) |
| Build de l'image dans sa nouvelle version | Steps « Build image » — chaque commit produit un tag unique `:<sha>` |
| Push dans le registry | Step « Push images » vers le registre k3d `localhost:5002` |
| Rollout du composant | `kubectl set image … :<sha>` + `kubectl rollout status` (rolling update) |
| Métriques CPU/RAM observables | Grafana → dashboard *Kubernetes / Compute Resources / Namespace (Pods)*, namespace `restaurant` (via kube-prometheus-stack/cAdvisor) |
