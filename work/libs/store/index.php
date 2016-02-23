<!DOCTYPE html>
<html lang="en" data-ng-app="appStickerPipeStore" data-ng-controller="AppController as appController">
<head>
	<meta charset="UTF-8">

	<title>Storage</title>

	<!-- Bootstrap -->
<!--	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">-->
<!--	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">-->

	<link id="css" type="text/css" rel="stylesheet" href="css/<?=($_GET['style'] ?: 'js');?>" />
</head>

<body>

<div data-base-page></div>

<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.2/angular.min.js"></script>

<script src="js/stickerPipeStore.js?v=1456239503651"></script>

<script>
	(function() {
		function valueOrNull(value) {
			return (value && value != 'null') ? value : null;
		}

		appStickerPipeStore.constant('Config', {
			apiKey: '<?=($_GET['apiKey'] ?: '1c0c4561cd005f6932f0de38934197ec');?>',
			platform: '<?=($_GET['platform'] ?: 'Android');?>',
			userId: '<?=($_GET['userId'] ?: '12345678901234567890123456789012');?>',
			resolutionType: '<?=($_GET['density'] ?: 'xxhdpi');?>',
			lang: '<?=($_GET['localization'] ?: 'ru');?>',
			clientDomain: '<?=($_SERVER['HTTP_HOST'] ?: 'localhost');?>',
			priceB: valueOrNull('<?=($_GET['priceB'] ?: 'null');?>'),
			priceC: valueOrNull('<?=($_GET['priceC'] ?: 'null');?>'),
			isSubscriber: ('<?=($_GET['is_subscriber'] ?: '0');?>' == '1'),
			style: '<?=($_GET['style'] ?: 'js');?>',
			primaryColor: '<?=($_GET['primaryColor'] ?: '');?>'
		});
	})();
</script>

</body>
</html>