<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Username");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getConnection() {
    // AVANT : valeurs hardcodées
    // APRÈS : variables d'environnement avec valeurs par défaut
    $host = getenv('DB_HOST') ?: 'localhost';
    $db   = getenv('DB_NAME') ?: 'versement_db';
    $user = getenv('DB_USER') ?: 'manatsoa_user';
    $pass = getenv('DB_PASS') ?: 'manatsoa123';
    $port = getenv('DB_PORT') ?: '5432';

    try {
        $pdo = new PDO(
            "pgsql:host=$host;dbname=$db;port=$port",
            $user,
            $pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Connexion échouée : " . $e->getMessage()]);
        exit();
    }
}