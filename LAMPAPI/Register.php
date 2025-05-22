<?php
	// FOR LOGIN TESTING ONLY REMOVE AFTER
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		http_response_code(204);
		exit;
	}

	$inData = getRequestInfo();

	//	Establish connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
		exit();
	}

	//	Check if login already exists
	$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
	$stmt->bind_param("s", $inData["login"]);
	$stmt->execute();

	$result = $stmt->get_result();
	if ($result->fetch_assoc())
	{
		$stmt->close();
		$conn->close();
		returnWithError("Login already in use.");
		exit();
	}
	$stmt->close();

	//	Insert new user
	$stmt = $conn->prepare("INSERT INTO Users (Login, Password, FirstName, LastName) VALUES (?, ?, ?, ?)");
	$stmt->bind_param("ssss", $inData["login"], $inData["password"], $inData["firstName"], $inData["lastName"]);

	if ($stmt->execute())
	{
		returnWithInfo("User registered successfully");
	}
	else
	{
		returnWithError("Error registering user: " . $stmt->error);
	}
	$stmt->close();
	$conn->close();



	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		http_response_code(400);	// 400 for errors
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($msg)
	{
		http_response_code(200);	// 200 for success
		$retValue = '{"message":"' . $msg . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
?>