<?php
require_once 'config/database.php';
$pdo  = getConnection();
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit();
}

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Username et password requis"]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    // Générer un token simple
    $token = bin2hex(random_bytes(32));

    // Stocker le token en base
    $pdo->prepare("UPDATE utilisateurs SET password = :pass WHERE id = :id")
        ->execute([':pass' => $user['password'], ':id' => $user['id']]);

    echo json_encode([
        "success"  => true,
        "token"    => $token,
        "username" => $user['username'],
        "role"     => $user['role']
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Identifiants incorrects"]);
}