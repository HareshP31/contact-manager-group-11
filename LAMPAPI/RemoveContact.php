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
    $userID    = $inData["id"];
    $contactID = $inData["contactID"];

    //  Establish mysql connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError("Database connection failed: " . $conn->connect_error, 500);
        exit();
    }

    //  Prepare and execute DELETE
    $stmt = $conn->prepare(
        "DELETE FROM Contacts 
         WHERE ID = ? 
           AND UserID = ?"
    );
    $stmt->bind_param("ii", $contactID, $userID);
    if (!$stmt->execute())
    {
        //  Database error
        returnWithError("Error deleting contact: " . $stmt->error, 500);
        $stmt->close();
        $conn->close();
        exit();
    }

    //  Check how many rows were affected
    if ($stmt->affected_rows === 0)
    {
        //  No match found
        returnWithError("Contact not found.", 404);
    }
    else
    {
        //  Successful deletion
        returnWithInfo(["message" => "Contact removed successfully."]);
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
        header('Content-Type: application/json');
        echo ($obj);
    }

    function returnWithError($err, $statusCode = 400)
    {
        http_response_code($statusCode);
        sendResultInfoAsJson(json_encode(["error" => $err]));
    }

    function returnWithInfo($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        sendResultInfoAsJson(json_encode($data));
    }
?>
