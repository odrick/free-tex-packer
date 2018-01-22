<?php

set_time_limit(60 * 5);

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain; charset=utf-8");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

require_once("lib/Tinify/Exception.php");
require_once("lib/Tinify/ResultMeta.php");
require_once("lib/Tinify/Result.php");
require_once("lib/Tinify/Source.php");
require_once("lib/Tinify/Client.php");
require_once("lib/Tinify.php");

$key = $_POST["key"];
$data = $_POST["data"];

try {
	\Tinify\setKey($key);
	$source = \Tinify\fromBuffer(base64_decode($data));
	$res = base64_encode($source->toBuffer());
	echo '{"data": "'.$res.'"}';
}
catch(Exception $e) {
	echo '{"error": "'.$e->getMessage().'"}';
}