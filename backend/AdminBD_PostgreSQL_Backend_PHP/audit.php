<?php
require_once 'config/database.php';
$pdo = getConnection();

// GET : récupérer tout l'audit + statistiques
$stmt = $pdo->query("
    SELECT * FROM audit_versement
    ORDER BY date_operation DESC
");
$audits = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Statistiques
$stats = $pdo->query("
    SELECT
        COUNT(*) FILTER (WHERE type_action = 'INSERT') AS nb_insertions,
        COUNT(*) FILTER (WHERE type_action = 'UPDATE') AS nb_modifications,
        COUNT(*) FILTER (WHERE type_action = 'DELETE') AS nb_suppressions
    FROM audit_versement
")->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "audits" => $audits,
    "stats"  => $stats
]);
