# ============================================================
# providers.tf
# Configure le provider GCP et le backend distant (GCS)
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Backend GCS : le state Terraform est stocké dans votre
  # bucket GCS au lieu d'être en local.
  # Avantage : si vous changez de machine, l'état est préservé.
  backend "gcs" {
    bucket = "bda-devops-tfstate-919f0101"
    prefix = "terraform/state"
  }
}

# Provider Google Cloud Platform
provider "google" {
  project = var.project_id
  region  = var.region
}
