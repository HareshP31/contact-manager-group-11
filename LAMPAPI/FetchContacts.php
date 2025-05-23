<?php
    // REMOVE AFTER TESTING
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
    define("LIMIT", 10); //  Max. contacts to fetch
    
    //  Get incoming JSON data
    $inData = getRequestInfo();

    $userID = intval($inData["id"]);
    //  Ensure we don't attempt to fetch more contacts than the predefined limit
    $limit = isset($inData["limit"]) ? intval($inData["limit"]) : LIMIT;
    $limit = ($limit > LIMIT) ? LIMIT : $limit;

    //  Establish mysql connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error, 500);
        exit();
    }

    //  Prepare statement
    $stmt = $conn->prepare(
        "SELECT FirstName, LastName, Phone, Email, ID 
         FROM Contacts 
         WHERE UserID = ? 
         ORDER BY ID DESC 
         LIMIT ?"
    );
    $stmt->bind_param("ii", $userID, $limit);
    //  Execute fetch
    if (!$stmt->execute())
    {
        returnWithError("Query failed: " . $stmt->error, 500);
    }
    else
    {
        //  Retrieve contacts
        $result = $stmt->get_result();
        $contacts = [];

        while ($row = $result->fetch_assoc())
        {
            $contacts[] = $row;
        }

        if (empty($contacts))
        {
            returnWithInfo(null, 204);
        }
        else
        {
            returnWithInfo($contacts);
        }
    }

    //  Close mysql connection
    $stmt->close();
    $conn->close();


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

    //  Takes in PHP data
    function returnWithInfo($data = null, $statusCode = 200)
    {
        http_response_code($statusCode);
        if ($statusCode === 204) // No content - no response body
        {
            return;
        }

        //  If $data is null or empty string, send empty message JSON
        if ($data === null || (is_string($data) && $data === ''))
        {
            $retValue = ['message' => '', 'error' => ''];
        }
        else
        {
            $retValue = $data;
        }

        sendResultInfoAsJson(json_encode($retValue));
    }
?>
