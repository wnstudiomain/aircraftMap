<?php
session_start();

if($_SESSION['admin']){
	header("Location: sky.php");
	exit;
}

$admin = 'admin';
$pass = '8ce853570185ff22fe73c5f91ef2aa35';

if($_POST['submit']){
	if($admin == $_POST['user'] AND $pass == md5($_POST['pass'])){
		$_SESSION['admin'] = $admin;
		header("Location: sky.php");
		exit;
	}else echo '<p>Логин или пароль неверны!</p>';
}
?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title></title>
  <!--<link rel="stylesheet" href="style.css" />-->
</head>
<body>
 <p><a href="index.php">Главная</a> | <a href="sky.php">Панель с самолетами</a></p>
<hr />
Это страница авторизации. Тестовая.
<br />
<form method="post">
	Логин: <input type="text" name="user" /><br />
	Пароль: <input type="password" name="pass" /><br />
	<input type="submit" name="submit" value="Войти" />
</form>   
</body>
</html>