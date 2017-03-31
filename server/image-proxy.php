<?php

header('Access-Control-Allow-Origin: *');

if(!$_FILES['image']) exit("");

$fileType = $_FILES['image']['type'];
$fileContent = "";

if($fileType != "") {
	$fileContent = base64_encode(file_get_contents($_FILES['image']['tmp_name']));
	$fileContent = "data:".$fileType.";base64,".$fileContent;
}

echo $fileContent;