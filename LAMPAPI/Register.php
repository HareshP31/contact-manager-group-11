<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$inData = getRequestInfo();

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// Check if login already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
if (!$stmt) {
    returnWithError("Database prepare failed: " . $conn->error);
    exit();
}
$stmt->bind_param("s", $inData["login"]);
$stmt->execute();
$result = $stmt->get_result();
if ($result->fetch_assoc()) {
    $stmt->close();
    $conn->close();
    returnWithError("Login already in use.");
    exit();
}
$stmt->close();

// Hash password using MD5
$hashedPassword = md5($inData["password"]);

$stmt = $conn->prepare("INSERT INTO Users (Login, Password, FirstName, LastName) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    returnWithError("Database prepare failed: " . $conn->error);
    exit();
}
$stmt->bind_param("ssss", $inData["login"], $hashedPassword, $inData["firstName"], $inData["lastName"]);

if ($stmt->execute()) {
    // Use $conn->insert_id to get the new user's ID
    $newUserId = $conn->insert_id;
    returnWithInfo($inData["firstName"], $inData["lastName"], $newUserId);
} else {
    returnWithError("Error registering user: " . $stmt->error);
}

$stmt->close();
$conn->close();

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id) {
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
