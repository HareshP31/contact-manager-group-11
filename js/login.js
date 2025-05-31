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
	
	document.getElementById("loginResult").innerHTML = "";

	if(login === "" || password === "")
	{
		document.getElementById("loginResult").innerHTML = "ERROR: Please fill in both fields.";
		return;
	}

	const spinner = document.getElementById("spinner");
	spinner.style.display = "block";

 	let tmp = {login:login,password:password};
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
					document.getElementById("loginResult").innerHTML = jsonObject.error || "ERROR: Login failed.";
					spinner.style.display = "none";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				spinner.style.display = "none";
	
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
		document.getElementById("userName").innerHTML = "Welcome " + firstName + " " + lastName + "!";
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
		document.getElementById("registerResult").innerHTML = "ERROR: Please fill in all fields.";
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

function togglePasswordLogin () 
{
	const passwordField = document.getElementById("loginPassword");
	const toggleButton = document.getElementById("togglePasswordButtonLogin");

	if(passwordField.type === "password")
	{
		passwordField.type = "text";
		toggleButton.textContent = "Hide";
	}
	else
	{
		passwordField.type = "password";
		toggleButton.textContent = "Show";
	}
}

function togglePasswordRegister () 
{
	const passwordField = document.getElementById("registerPassword");
	const toggleButton = document.getElementById("togglePasswordButtonRegister");

	if(passwordField.type === "password")
	{
		passwordField.type = "text";
		toggleButton.textContent = "Hide";
	}
	else
	{
		passwordField.type = "password";
		toggleButton.textContent = "Show";
	}
}

function createHeart(e)
{
	const heart = document.createElement('div');
	heart.classList.add('heart');

	const rect = e.currentTarget.getBoundingClientRect();
	heart.style.left = (e.clientX - rect.left) + 'px';
	heart.style.top = (e.clientY - rect.top) + 'px';

	e.currentTarget.appendChild(heart);

	setTimeout(() => {
		heart.remove();
	}, 1500);
}

window.onload = function () 
{
	showForm('login');
};