# ============================================================
# main.tf
# Définit toute l'infrastructure GCP du projet BDA :
#   1. VPC + Subnet
#   2. Cluster GKE (zonal - zone unique)
#   3. Node Pool (2 nodes e2-medium On-Demand)
#   4. Artifact Registry (stockage des images Docker)
# ============================================================


# ============================================================
# 1. RÉSEAU — VPC et Subnet
# ============================================================

# VPC (Virtual Private Cloud) — réseau privé isolé
# On désactive auto_create_subnetworks pour contrôler
# manuellement les sous-réseaux (bonne pratique)
resource "google_compute_network" "vpc" {
  name                    = "bda-vpc"
  auto_create_subnetworks = false

  description = "VPC principal du projet BDA DevOps"
}

# Subnet — sous-réseau dans lequel vivront les nodes GKE
resource "google_compute_subnetwork" "subnet" {
  name          = "bda-subnet"
  ip_cidr_range = "10.0.0.0/20"    # 4094 IPs pour les nodes
  region        = var.region
  network       = google_compute_network.vpc.id

  # Plages secondaires pour les pods et services K8s
  # GKE en a besoin pour l'allocation d'IP interne
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"  # 65536 IPs pour les pods
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/20"  # 4094 IPs pour les services K8s
  }
}


# ============================================================
# 2. CLUSTER GKE — Kubernetes managé par Google
# ============================================================

resource "google_container_cluster" "main" {
  name = var.cluster_name

  # location = zone (pas region) → cluster ZONAL = 1 seule zone
  # Plus économique qu'un cluster régional (3 zones)
  # Pour un projet académique, c'est parfait
  location = var.zone

  # Réseau dans lequel le cluster est déployé
  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  # On supprime le node pool par défaut de GKE
  # pour créer le nôtre avec les bonnes options
  remove_default_node_pool = true
  initial_node_count       = 1

  # Configuration des IP internes (pods et services)
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  # Workload Identity — permet aux pods de s'authentifier
  # auprès des APIs GCP sans clé JSON (plus sécurisé)
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Désactive la protection pour pouvoir détruire facilement
  # avec terraform destroy (important pour économiser le crédit)
  deletion_protection = false

  # Logging et monitoring via Cloud Operations (gratuit en base)
  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"
}


# ============================================================
# 3. NODE POOL — Les machines qui font tourner vos pods
# ============================================================

resource "google_container_node_pool" "main" {
  name    = "bda-node-pool"
  cluster = google_container_cluster.main.id

  # 2 nodes : nécessaire pour démontrer la haute disponibilité
  # et le HPA lors de la présentation
  node_count = var.node_count

  node_config {
    # e2-medium : 2 vCPU, 4 GB RAM — suffisant pour toute la stack
    # On-Demand (pas Spot) = aucun risque d'interruption pendant la présentation
    machine_type = var.machine_type

    # Disque de 30 GB en mode standard (moins cher que SSD)
    disk_size_gb = var.disk_size_gb
    disk_type    = "pd-standard"

    # Accès à toutes les APIs GCP — nécessaire pour Workload Identity
    # et pour que les pods accèdent à Artifact Registry
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    # Labels pour identifier et filtrer les ressources
    labels = {
      project     = "bda-devops"
      environment = "production"
      managed-by  = "terraform"
    }

    # Tags réseau — peuvent être utilisés pour les règles firewall
    tags = ["bda-node", "gke-node"]
  }

  management {
    # Réparation automatique si un node devient unhealthy
    auto_repair = true

    # Mise à jour automatique de la version Kubernetes
    auto_upgrade = true
  }

  # Durée max pour mettre à jour un node
  upgrade_settings {
    max_surge       = 1   # Ajoute 1 node temporaire pendant la mise à jour
    max_unavailable = 0   # Jamais 0 node disponible (zero downtime)
  }
}


# ============================================================
# 4. ARTIFACT REGISTRY — Stockage des images Docker
# ============================================================

# Remplace l'ancien Container Registry (gcr.io)
# C'est ici que vos images frontend et backend seront stockées
# avant d'être déployées sur GKE
resource "google_artifact_registry_repository" "bda" {
  location      = var.region
  repository_id = "bda-images"
  format        = "DOCKER"
  description   = "Images Docker du projet BDA — frontend et backend"
}
