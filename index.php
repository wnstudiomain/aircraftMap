<?php
session_start();

if ($_SESSION['admin']) {
	header("Location: sky.php");
	exit;
}

$admin = 'admin';
$pass = '8ce853570185ff22fe73c5f91ef2aa35';

if ($_POST['submit']) {
	if ($admin == $_POST['user'] and $pass == md5($_POST['pass'])) {
		$_SESSION['admin'] = $admin;
		header("Location: sky.php");
		exit;
	} else echo '<p>Логин или пароль неверны!</p>';
}
?>
<!doctype html>
<html lang="ru">

<head>
<meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<title>Вход в панель управления</title>
	<!--<link rel="stylesheet" href="style.css" />-->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
 
</head>

<body>
	<!--<p><a href="index.php">Главная</a> | <a href="sky.php">Панель с самолетами</a></p>-->
	<main class="main">
		<div class="form-signin">
		<form method="post">
			<img class="mb-4" src="/sky/images/Shit.png" alt="" width="56" height="85">
			<h1 class="h4 mt-2 mb-5">Войдите в свой аккаунт</h1>

			<div class="form-floating">
				<input type="test" name="user" class="form-control" placeholder="name@example.com">
				<label for="floatingInput">Логин</label>
			</div>
			<div class="form-floating mt-3">
				<input type="password" name="pass" class="form-control" placeholder="Password">
				<label for="floatingPassword">Пароль</label>
			</div>

			<input class="btn btn-lg btn-primary" type="submit" name="submit" value="Войти" />
		</form>
		</div>
	</main>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
</body>

</html>