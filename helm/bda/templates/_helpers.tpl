{{- define "bda.name" -}}
{{- .Chart.Name }}
{{- end }}

{{- define "bda.labels" -}}
app.kubernetes.io/name: {{ include "bda.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
