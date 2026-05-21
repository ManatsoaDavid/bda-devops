# ============================================================
# outputs.tf
# Affiche les informations importantes après terraform apply.
# Ces valeurs sont utilisées dans les phases suivantes
# (Ansible, kubectl, docker push...)
# ============================================================

output "cluster_name" {
  description = "Nom du cluster GKE créé"
  value       = google_container_cluster.main.name
}

output "cluster_zone" {
  description = "Zone où tourne le cluster"
  value       = google_container_cluster.main.location
}

output "cluster_endpoint" {
  description = "Endpoint de l'API server Kubernetes"
  value       = google_container_cluster.main.endpoint
  sensitive   = true  # Masqué dans les logs CI/CD
}

# ─── Commande prête à copier-coller ───────────────────────
output "kubectl_config_command" {
  description = "Commande pour configurer kubectl sur votre machine"
  value       = "gcloud container clusters get-credentials ${google_container_cluster.main.name} --zone ${var.zone} --project ${var.project_id}"
}

# ─── URL de l'Artifact Registry ───────────────────────────
output "artifact_registry_url" {
  description = "URL de base pour pousser vos images Docker"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/bda-images"
}

output "frontend_image_url" {
  description = "URL complète pour l'image frontend"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/bda-images/bda-frontend:v1.0"
}

output "backend_image_url" {
  description = "URL complète pour l'image backend"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/bda-images/bda-backend:v1.0"
}

# ─── Commandes docker push prêtes à copier ────────────────
output "docker_auth_command" {
  description = "Commande pour authentifier Docker avec Artifact Registry"
  value       = "gcloud auth configure-docker ${var.region}-docker.pkg.dev"
}

output "vpc_name" {
  description = "Nom du VPC créé"
  value       = google_compute_network.vpc.name
}

output "subnet_name" {
  description = "Nom du subnet créé"
  value       = google_compute_subnetwork.subnet.name
}
