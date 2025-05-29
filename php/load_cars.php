<?php
header('Content-Type: application/json');

// Database connection settings
$host   = 'awseb-e-dnmdgtubzq-stack-awsebrdsdatabase-sy90q8foqnke.cshnl8rcnfod.us-east-1.rds.amazonaws.com';
$user   = 'Guangzheng';
$pass   = '12345678';
$dbname = 'carrental';

// Create MySQLi connection
$mysqli = new mysqli($host, $user, $pass, $dbname);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Base SQL: select all cars, regardless of availability
$sql = "
  SELECT vin, brand, model, type, year, mileage, fuel_type,
         price_per_day, available, description, image_path
    FROM cars
";

// Prepare parameters for optional filtering
$params = [];
$types  = '';

// If vin parameter is provided, fetch that specific record
if (!empty($_GET['vin'])) {
    $sql .= " WHERE vin = ?";
    $params[] = $_GET['vin'];
    $types   .= 's';
} else {
    // Otherwise, allow optional 'query' and 'type' filters

    // Always start WHERE clause to enable chaining
    $sql .= " WHERE 1=1";

    // Filter by keyword on brand or model if provided
    if (!empty($_GET['query'])) {
        $sql .= " AND (brand LIKE ? OR model LIKE ?)";
        $kw = '%' . $_GET['query'] . '%';
        $params[] = $kw;
        $params[] = $kw;
        $types   .= 'ss';
    }

    // Filter by exact type if provided
    if (!empty($_GET['type'])) {
        $sql .= " AND type = ?";
        $params[] = $_GET['type'];
        $types   .= 's';
    }
}

// Prepare the statement
$stmt = $mysqli->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare statement']);
    exit;
}

// Bind parameters dynamically if needed
if ($types) {
    $bind_names[] = $types;
    for ($i = 0; $i < count($params); $i++) {
        $bind_name = 'param' . $i;
        $$bind_name = $params[$i];
        $bind_names[] = &$$bind_name;
    }
    call_user_func_array([$stmt, 'bind_param'], $bind_names);
}

// Execute the query
$stmt->execute();

// Fetch results as associative array
$result = $stmt->get_result();
$cars   = $result->fetch_all(MYSQLI_ASSOC);

// Output JSON array including unavailable cars
echo json_encode($cars);

// Cleanup
$stmt->close();
$mysqli->close();
