<?php
require_once 'config/database.php';
$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // GET : récupérer tous les clients
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM client ORDER BY ncompte");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    // POST : créer un client
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare(
            "INSERT INTO client (nomclient, solde) VALUES (:nom, :solde) RETURNING *"
        );
        $stmt->execute([
            ':nom'   => $data['nomclient'],
            ':solde' => $data['solde'] ?? 0
        ]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;

    // DELETE : supprimer un client
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(["error" => "ID manquant"]);
            break;
        }
        $stmt = $pdo->prepare("DELETE FROM client WHERE ncompte = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Client supprimé"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée"]);
}
