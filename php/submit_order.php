<?php
// submit_order.php
// Handles initial reservation: checks availability, inserts pending order, returns JSON

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
    // Create PDO instance
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Respond with error if connection fails
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'db_connect_error'
    ]);
    exit;
}

// 1. Retrieve POST data (basic sanitization)
$vin            = $_POST['vin']            ?? '';
$name           = $_POST['name']           ?? '';
$phone          = $_POST['phone']          ?? '';
$email          = $_POST['email']          ?? '';
$license_number = $_POST['license_number'] ?? '';
$start_date     = $_POST['start_date']     ?? '';
$rental_days    = isset($_POST['rental_days']) ? (int)$_POST['rental_days'] : 0;

// 2. VIN must be provided
if (!$vin) {
    echo json_encode(['success' => false, 'error' => 'missing_vin']);
    exit;
}

// 3. Check availability and get price
$stmt = $pdo->prepare("SELECT available, price_per_day FROM cars WHERE vin = ?");
$stmt->execute([$vin]);
$car = $stmt->fetch();

if (!$car) {
    echo json_encode(['success' => false, 'error' => 'not_found']);
    exit;
}
if ((int)$car['available'] === 0) {
    echo json_encode(['success' => false, 'error' => 'unavailable']);
    exit;
}

// 4. Calculate total price
$price_per_day = (float)$car['price_per_day'];
$total_price   = $price_per_day * $rental_days;

// 5. Insert order as pending
$insert = $pdo->prepare("
  INSERT INTO orders
    (vin, name, phone, email, license_number, start_date, rental_days, total_price, status)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
");
$insert->execute([
    $vin,
    $name,
    $phone,
    $email,
    $license_number,
    $start_date,
    $rental_days,
    $total_price
]);

$order_id = $pdo->lastInsertId();

// 6. Respond success
echo json_encode([
    'success'  => true,
    'order_id' => $order_id
]);
exit;
