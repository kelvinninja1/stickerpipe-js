<!DOCTYPE html>
<html lang="en" data-ng-app="appStickerPipeStore" data-ng-controller="AppController as appController">
<head>
	<meta charset="UTF-8">

	<title>Storage</title>

	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">

	<link id="css" type="text/css" rel="stylesheet" />
</head>

<body>

<div data-base-page class="{{ appController.getResolutionType() }}"></div>

<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.2/angular.min.js"></script>

<script src="js/stickerPipeStore.min.js"></script>

<script>
	(function() {
		appStickerPipeStore.constant('Config', {
			apiKey: '<?=($_GET['apiKey'] ?: '1c0c4561cd005f6932f0de38934197ec');?>',
			platform: '<?=($_GET['platform'] ?: 'Android');?>',
			userId: '<?=($_GET['userId'] ?: '12345678901234567890123456789012');?>',
			resolutionType: '<?=($_GET['density?'] ?: 'xxhdpi');?>',
			lang: '<?=($_GET['lang'] ?: 'ru');?>'
		});
	})()
</script>

</body>
</html>