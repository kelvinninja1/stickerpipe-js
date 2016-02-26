<?php

$baseDir = __DIR__;
$storeDir = $baseDir . '/libs/store/stable';

$storeCssDir = $storeDir . '/css';
$storeJsDir = $storeDir . '/js';

$map = [];

$cssFiles = ['android', 'ios', 'js'];

foreach ($cssFiles as $file) {
    $map[$file] = md5_file($storeCssDir . '/' . $file . '.css');
}

$jsFiles = ['stickerPipeStore'];

foreach ($jsFiles as $file) {
    $map[$file] = md5_file($storeJsDir . '/' . $file . '.js');
}

$newFile = $baseDir . '/version.json';

$result = file_put_contents($newFile, json_encode($map));

if ($result === false) {
    exit(1);
}

exit(0);
