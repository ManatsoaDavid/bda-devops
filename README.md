# BDA DevOps — Gestion et Audit des Versements Bancaires

## Architecture
Application 3-tiers déployée sur Google Kubernetes Engine (GKE)
- Frontend : React 18 + Nginx
- Backend  : PHP 8.3 + Apache
- Database : PostgreSQL 16

## Stack DevOps
| Outil      | Rôle                                    |
|------------|-----------------------------------------|
| Terraform  | Provisionnement infrastructure GCP      |
| Ansible    | Configuration du cluster Kubernetes     |
| ArgoCD     | Déploiement GitOps automatique          |
| Helm       | Packaging de l'application K8s          |
| HPA        | Autoscaling horizontal des pods         |
| VPA        | Recommandations de rightsizing          |
| GitHub Actions | Pipeline CI/CD automatisé          |

## Accès application
http://bda.34.53.243.100.nip.io
Login : Manatsoa / password

## Structure du repo
- terraform/   → Infrastructure GCP (VPC, GKE, Artifact Registry)
- ansible/     → Configuration cluster (ArgoCD, Nginx Ingress)
- helm/bda/    → Helm chart de l'application
- gitops/      → Application ArgoCD (GitOps)
- .github/     → Pipelines CI/CD GitHub Actions

## Déploiement
1. terraform apply     → Crée l'infrastructure GCP
2. ansible-playbook    → Configure le cluster
3. kubectl apply       → Lance ArgoCD qui déploie l'app
