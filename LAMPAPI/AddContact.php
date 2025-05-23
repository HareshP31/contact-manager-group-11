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
    //  Trim whitespace from user input
    $firstName = trim($inData["firstName"]);
    $lastName = trim($inData["lastName"]);
    $phone = trim($inData["phone"]);
    $email = trim($inData["email"]);

    //  Ensure required fields are not empty (firstName, lastName)
    if ($firstName === "" || $lastName === "")
    {
        returnWithError("Missing required field(s)");
        exit();
    }

    //  Establish connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError("Database connection failed: " . $conn->connect_error, 500);
        exit();
    }

    //  Insert new contact
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);

    if ($stmt->execute())
    {
        $newContactId = $stmt->insert_id;
        returnWithInfo(["id" => $newContactId]);
    }
    else
    {
        returnWithError("Error inserting contact: " . $stmt->error);
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
        http_response_code($statusCode); // default 400 for errors
        sendResultInfoAsJson(json_encode(["error" => $err]));
    }

    function returnWithInfo($data)
    {
        http_response_code(200); // 200 for success
        sendResultInfoAsJson(json_encode($data));
    }   
?>
