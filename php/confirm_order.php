<?php
// confirm_order.php
// Confirms a pending order and marks the vehicle unavailable

header('Content-Type: application/json; charset=utf-8');

// Database connection parameters
$host   = 'awseb-e-dnmdgtubzq-stack-awsebrdsdatabase-sy90q8foqnke.cshnl8rcnfod.us-east-1.rds.amazonaws.com';
$db     = 'carrental';
$user   = 'Guangzheng';
$pass   = '12345678';
$charset= 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'error'=>'db_connect_error']);
    exit;
}

// 1. Retrieve and validate order_id
$order_id = isset($_GET['order_id']) ? (int)$_GET['order_id'] : 0;
if ($order_id <= 0) {
    echo json_encode(['success'=>false, 'error'=>'invalid_order_id']);
    exit;
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    // 2. Update order status to 'confirmed'
    $upd = $pdo->prepare("UPDATE orders SET status = 'confirmed' WHERE id = ?");
    $upd->execute([$order_id]);

    // 3. Get VIN for that order
    $sel = $pdo->prepare("SELECT vin FROM orders WHERE id = ?");
    $sel->execute([$order_id]);
    $vin = $sel->fetchColumn();
    if (!$vin) {
        throw new Exception('order_not_found');
    }

    // 4. Mark car unavailable
    $upd2 = $pdo->prepare("UPDATE cars SET available = 0 WHERE vin = ?");
    $upd2->execute([$vin]);

    // Commit transaction
    $pdo->commit();

    // 5. Respond success
    echo json_encode(['success'=>true]);
    exit;

} catch (Exception $e) {
    // Roll back on error
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success'=>false,
        'error'  => $e->getMessage()
    ]);
    exit;
}
