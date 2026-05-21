<?php
require_once 'config/database.php';
$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents("php://input"), true);

// Récupérer l'utilisateur connecté depuis le header
$username = $_SERVER['HTTP_X_USERNAME'] ?? 'inconnu';

// Définir l'utilisateur courant pour PostgreSQL
$pdo->exec("SET app.username = " . $pdo->quote($username));

switch ($method) {

    case 'GET':
        $stmt = $pdo->query("
            SELECT v.*, c.nomclient
            FROM versement v
            JOIN client c ON v.ncompte = c.ncompte
            ORDER BY v.nversement DESC
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $stmt = $pdo->prepare("
            INSERT INTO versement (ncheque, ncompte, montant)
            VALUES (:ncheque, :ncompte, :montant)
            RETURNING *
        ");
        $stmt->execute([
            ':ncheque' => $data['ncheque'],
            ':ncompte' => $data['ncompte'],
            ':montant' => $data['montant']
        ]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;

    case 'PUT':
        $stmt = $pdo->prepare("
            UPDATE versement
            SET ncheque = :ncheque, montant = :montant
            WHERE nversement = :id
            RETURNING *
        ");
        $stmt->execute([
            ':ncheque' => $data['ncheque'],
            ':montant' => $data['montant'],
            ':id'      => $data['nversement']
        ]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { echo json_encode(["error" => "ID manquant"]); break; }
        $pdo->prepare("DELETE FROM versement WHERE nversement = :id")
            ->execute([':id' => $id]);
        echo json_encode(["message" => "Versement supprimé"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée"]);
}