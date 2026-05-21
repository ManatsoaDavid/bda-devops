{{/*
_helpers.tpl — Fonctions réutilisables dans tous les templates
*/}}

{{/* Nom de base de l'application */}}
{{- define "bda.name" -}}
{{- .Chart.Name }}
{{- end }}

{{/* Labels communs appliqués à toutes les ressources */}}
{{- define "bda.labels" -}}
app.kubernetes.io/name: {{ include "bda.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
