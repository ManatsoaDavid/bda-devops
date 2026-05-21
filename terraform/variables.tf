# ============================================================
# variables.tf
# Déclare toutes les variables utilisées dans le projet.
# Les valeurs réelles sont dans terraform.tfvars (jamais dans Git)
# ============================================================

variable "project_id" {
  type        = string
  description = "ID du projet GCP"
}

variable "region" {
  type        = string
  description = "Région GCP principale"
  default     = "europe-west1"
}

variable "zone" {
  type        = string
  description = "Zone unique pour le cluster (minimise le coût)"
  default     = "europe-west1-b"
}

variable "cluster_name" {
  type        = string
  description = "Nom du cluster GKE"
  default     = "bda-cluster"
}

variable "node_count" {
  type        = number
  description = "Nombre de nodes dans le pool"
  default     = 2
}

variable "machine_type" {
  type        = string
  description = "Type de machine GCP pour les nodes"
  default     = "e2-medium"
  # e2-medium = 2 vCPU, 4 GB RAM
  # ~$0.0335/heure par node (On-Demand, pas Spot)
  # 2 nodes = ~$1.61/jour = ~$48/mois
}

variable "disk_size_gb" {
  type        = number
  description = "Taille du disque de démarrage par node (GB)"
  default     = 30
  # 30 GB est suffisant pour le projet académique
  # Disk standard = moins cher que SSD
}
