<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation</title>
    <link rel="stylesheet" href="/views/assets/css/alert.css">
    <link rel="stylesheet" href="/views/assets/css/install.css">
</head>
<body>
<div class="alert-box red"></div>
<div class="container">
  <div class="title">Installation</div>
  <div data-install="error"></div>
  <form action="#">
    <div class="user__details">
      <div class="input__box">
        <span class="details">Database User</span>
        <input type="text" data-db="user" placeholder="E.g: root" required>
      </div>
      <div class="input__box">
        <span class="details">Database Host</span>
        <input type="text" data-db="host" placeholder="E.g: localost" required>
      </div>
      <div class="input__box">
        <span class="details">Database Password</span>
        <input type="text" data-db="pass" placeholder="********" required>
      </div>
      <div class="input__box">
        <span class="details">Database Name</span>
        <input type="text" data-db="name" placeholder="E.g: test" required>
      </div>

    </div>
    <div class="gender__details">
      <span class="gender__title">User</span>
      <div class="user__details">
      <div class="input__box">
        <span class="details">Full Name</span>
        <input type="text" data-user="name" placeholder="E.g: root" required>
      </div>
      <div class="input__box">
        <span class="details">Email</span>
        <input type="email" data-user="email" placeholder="johnsmith@hotmail.com" required>
      </div>

      <div class="input__box">
        <span class="details">Password</span>
        <input type="password" data-user="pass" placeholder="********" required>
      </div>
      <div class="input__box">
        <span class="details">Confirm Password</span>
        <input type="password" data-user="conpass" placeholder="********" required>
      </div>

    </div>
    <div class="gender__details">
      <span class="gender__title">settings</span>
      <div class="user__details">
      <div class="input__box">
        <span class="details">Website Name</span>
        <input type="text" data-site="name" placeholder="E.g: ABC" required>
    </div>
    <div class="input__box">
        <span class="details">Website Logo</span>
        <input type="file" data-site="logo" accept=".png, .jpg, .jpeg" required>
        <img data-site="img-preview" style="width: 150px; margin-top: 10px;" src="" alt="" >
      </div>

    </div>
    </div>
    <div class="button">
      <input type="submit" data-install="btn" value="Install">
    </div>
  </form>
</div>

<script src="/views/assets/js/alert.js"></script>
<script src="/views/assets/js/install.js"></script>
</body>
</html>