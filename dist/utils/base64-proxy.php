<?php

header('Access-Control-Allow-Origin: *');

if(!$_FILES['input_file']) exit("");

$fileType = $_FILES['input_file']['type'];
$fileContent = "";

if($fileType != "") {
	$fileContent = base64_encode(file_get_contents($_FILES['input_file']['tmp_name']));
	$fileContent = "data:".$fileType.";base64,".$fileContent;
}

echo $fileContent;