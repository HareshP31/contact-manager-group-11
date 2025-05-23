<?php
        // REMOVE AFTER TESTING
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
    //  Get incoming JSON data
    $inData = getRequestInfo();

    $userID = $inData["id"];

    //  Trim whitespace from fields and treat empty strings as null (no search criteria)
    $firstName = (isset($inData["firstName"]) && trim($inData["firstName"]) !== '') ? trim($inData["firstName"]) : null;
    $lastName  = (isset($inData["lastName"])  && trim($inData["lastName"])  !== '') ? trim($inData["lastName"])  : null;
    $phone     = (isset($inData["phone"])     && trim($inData["phone"])     !== '') ? trim($inData["phone"])     : null;
    $email     = (isset($inData["email"])     && trim($inData["email"])     !== '') ? trim($inData["email"])     : null;

    //  Establish mysql connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error, 500);
        exit();
    }

    //  Build query dynamically based on which search fields are provided
    $sql = "SELECT FirstName, LastName, Phone, Email, ID FROM Contacts WHERE UserID = ?";
    $params = [$userID];
    $types = "i";

    if ($firstName !== null)
    {
        $sql .= " AND FirstName LIKE ?";
        $params[] = "%$firstName%";
        $types .= "s";
    }
    if ($lastName !== null)
    {
        $sql .= " AND LastName LIKE ?";
        $params[] = "%$lastName%";
        $types .= "s";
    }
    if ($phone !== null)
    {
        $sql .= " AND Phone LIKE ?";
        $params[] = "%$phone%";
        $types .= "s";
    }
    if ($email !== null)
    {
        $sql .= " AND Email LIKE ?";
        $params[] = "%$email%";
        $types .= "s";
    }

    //  Execute search
    $stmt = $conn->prepare($sql);
    if ($stmt === false)
    {
        returnWithError("Database query error: " . $conn->error, 500);
        $conn->close();
        exit();
    }
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute())
    {
        returnWithError("Execute failed: " . $stmt->error, 500);
        $stmt->close();
        $conn->close();
        exit();
    }

    //  Retrieve matching contacts
    $result = $stmt->get_result();

    $contacts = [];
    while ($row = $result->fetch_assoc())
    {
        $contacts[] = $row;
    }

    //  Close mysql connection
    $stmt->close();
    $conn->close();

    if (count($contacts) === 0)
    {
        //  204 (No Content) when no matches found
        returnWithInfo(null, 204);
    }
    else
    {
        //  Return matches with 200 (OK)
        returnWithInfo($contacts, 200);
    }


    // --- Helper functions ---
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err, $statusCode = 400)
    {
        http_response_code($statusCode);
        $retValue = ['error' => $err];
        sendResultInfoAsJson(json_encode($retValue));
    }

    //  Unlike other endpoints -- Takes in PHP data
    function returnWithInfo($data = null, $statusCode = 200)
    {
        http_response_code($statusCode);
        if ($statusCode === 204) {
            // No Content: no response body
            return;
        }

        // If $data is null or empty string, send empty message JSON
        if ($data === null || (is_string($data) && $data === '')) {
            $retValue = ['message' => '', 'error' => ''];
        } else {
            $retValue = $data;
        }

        sendResultInfoAsJson(json_encode($retValue));
    }
?>
