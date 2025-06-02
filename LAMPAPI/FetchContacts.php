<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define("LIMIT", 10);

$inData = getRequestInfo();
$userID = intval($inData["id"]);
$limit = isset($inData["limit"]) ? min(intval($inData["limit"]), LIMIT) : LIMIT;
$offset = isset($inData["offset"]) ? intval($inData["offset"]) : 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error, 500);
    exit();
}

$stmt = $conn->prepare(
    "SELECT FirstName, LastName, Phone, Email, ID 
     FROM Contacts 
     WHERE UserID = ? 
     ORDER BY ID DESC 
     LIMIT ? OFFSET ?"
);
$stmt->bind_param("iii", $userID, $limit, $offset);

if (!$stmt->execute()) {
    returnWithError("Query failed: " . $stmt->error, 500);
} else {
    $result = $stmt->get_result();
    $contacts = [];

    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }

    if (empty($contacts)) {
        returnWithInfo(null, 204);
    } else {
        returnWithInfo($contacts);
    }
}

$stmt->close();
$conn->close();

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err, $statusCode = 400) {
    http_response_code($statusCode);
    sendResultInfoAsJson(['error' => $err]);
}

function returnWithInfo($data = null, $statusCode = 200) {
    http_response_code($statusCode);
    if ($statusCode === 204) return;
    if ($data === null) $data = ['message' => '', 'error' => ''];
    sendResultInfoAsJson($data);
}
?>
