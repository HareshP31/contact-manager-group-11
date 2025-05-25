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
    //  Trim user input
    $firstName = trim($inData["firstName"]);
    $lastName = trim($inData["lastName"]);
    $phone = trim($inData["phone"]);
    $email = trim($inData["email"]);

    //  Ensure required fields are not empty (firstName, lastName)
    if ($firstName === "" || $lastName === "" || $phone === "" || $email === "")
    {
        returnWithError("Missing required field(s)");
        exit();
    }

    //  Establish mysql connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError("Database connection failed: " . $conn->connect_error, 500);
        exit();
    }

    //  Prepare statement
    $stmt = $conn->prepare(
        "UPDATE Contacts 
         SET FirstName = ?, LastName = ?, Phone = ?, Email = ?
         WHERE ID = ? AND UserID = ?"
    );
    $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactID, $userID);

    //  Update contact
    if (!$stmt->execute())
    {
        returnWithError("Error updating contact: " . $stmt->error, 500);
    }
    elseif ($stmt->affected_rows === 0)
    {
        returnWithError("Contact not found or no changes made.", 404);
    }
    else
    {
        returnWithInfo(["message" => "Contact updated successfully."]);
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
