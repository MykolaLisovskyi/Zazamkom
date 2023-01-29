<?php

/* https://api.telegram.org/bot971254816:AAFhWcDRVyCRVsygTr5Kjzf48TgIjmI0FX8/getUpdates,
где, XXXXXXXXXXXXXXXXXXXXXXX - токен вашего бота, полученный ранее */
$phone = trim(strip_tags($_POST['f']['telephone']));
$name = trim(strip_tags($_POST['f']['name']));
$type = trim(strip_tags($_POST['f']['type']));
$address = trim(strip_tags($_POST['f']['address']));
$install = trim(strip_tags($_POST['f']['install']));

$url						= "http://" . $_SERVER["HTTP_HOST"] . "" . $_SERVER["REQUEST_URI"] . "";
$token = "1787715841:AAFnSjrVx__UrO2d4nH8aCxx8YABL4sIvIw";
$chat_id = "-1001291540422";
$arr = array(
  'Имя: ' => $name,
  'Телефон: ' => $phone,
  'Тип замка: ' => $type,
  'Вид работ: ' => $install,
  'Куда ехать: ' => $address

);
foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};
$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

?>
