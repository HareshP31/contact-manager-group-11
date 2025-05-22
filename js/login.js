const urlBase = 'https://meowmanager4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	if(login === "" || password === "")
	{
		document.getElementById("loginResult").innerHTML = "Please fill in both fields.";
		return;
	}

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = jsonObject.error || "Login failed.";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	let expires = ";expires=" + date.toGMTString() + ";path=/";

	document.cookie = "firstName=" + firstName + expires;
	document.cookie = "lastName=" + lastName + expires;
	document.cookie = "userId=" + userId + expires;
}

function readCookie()
{
	userId = -1;
    firstName = "";
	lastName = "";

    let cookies = document.cookie.split(";");
	for(let i = 0; i < cookies.length; i++) 
	{
        let cookie = cookies[i].trim();
        let tokens = cookie.split("=");
        if (tokens.length !== 2) continue;

        switch (tokens[0])
        {
            case "firstName": firstName = tokens[1]; break;
            case "lastName": lastName = tokens[1]; break;
			case "userId": userId = parseInt(tokens[1]); break;
        }
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
        console.log(firstName);
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    userId = 0;
	firstName = "";
	lastName = "";
	window.location.href = "index.html";
}

window.onload = function () 
{
	showForm('login');
};

function showForm(form)
{
	const loginTab = document.getElementById("loginTab");
	const registerTab = document.getElementById("registerTab");
	const loginDiv = document.getElementById("loginDiv");
	const registerDiv = document.getElementById("registerDiv");

	if(form === "login")
	{
		loginTab.classList.add("active");
		registerTab.classList.remove("active");
		loginDiv.style.display = "block";
		registerDiv.style.display = "none";
	}
	else
	{
		registerTab.classList.add("active");
		loginTab.classList.remove("active");
		registerDiv.style.display = "block";
		loginDiv.style.display = "none";
	}
}

function doRegister()
{
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("registerName").value;
	let password = document.getElementById("registerPassword").value;

	if(firstName === "" || lastName === "" || login === "" || password === "")
	{
		document.getElementById("registerResult").innerHTML = "Please fill in all fields.";
		return;
	}

	let tmp = { firstName, lastName, login, password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function () 
		{
			if(this.readyState == 4 && this.status == 200)
			{
				let response = JSON.parse(xhr.responseText);
				if(response.error)
				{
					document.getElementById("registerResult").innerHTML = response.error;
				}
				else
				{
					document.getElementById("registerResult").innerHTML = "Registration successful! Please log in.";
					showForm("login");
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}