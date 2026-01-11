<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Snake Caves - Sign In</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .login-box {
      background: #fff;
      border: 1px solid #ddd;
      padding: 30px;
      width: 300px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .login-box h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #111;
    }
    .login-box input {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .login-box button {
      width: 100%;
      padding: 10px;
      background: #f0c14b;
      border: 1px solid #a88734;
      border-radius: 3px;
      cursor: pointer;
      font-weight: bold;
    }
    .login-box button:hover {
      background: #ddb347;
    }
    .small-link {
      font-size: 12px;
      color: #0066c0;
      text-decoration: none;
    }
    #status {
      margin-top: 10px;
      color: #d00;
    }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>Sign-In</h1>
    <input id="username" type="text" placeholder="Email or username">
    <input id="password" type="password" placeholder="Password">
    <button onclick="login()">Sign In</button>
    <p><a href="#" class="small-link" onclick="register()">Create your Snake Caves account</a></p>
    <div id="status"></div>
  </div>

  <script>
    const API = "http://localhost:3000"; // change to Render URL later

    async function register() {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const res = await fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      document.getElementById("status").textContent = data.message || data.error;
    }

    async function login() {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        document.getElementById("status").style.color = "green";
        document.getElementById("status").textContent = "Welcome, " + username + "!";
        window.location.href = "game.html"; // redirect to Snake Caves
      } else {
        document.getElementById("status").textContent = data.error || "Login failed";
      }
    }
  </script>
</body>
</html>
