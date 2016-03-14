var app = angular.module('js-app', ['partials', 'ngAudio']);

document.addEventListener('DOMContentLoaded', function(event) {

	if(typeof window.ga === 'undefined') {

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	}

	ga('create', 'UA-1113296-81', 'auto', {'name': 'stickerTracker'});
});
(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/directives/audioSticker/view',
    '<div data-ng-class="{\'sound-sticker\': true, \'center-block\': true, \'not-played\': !played}">\n' +
    '	<img data-ng-src="img/audio-stickers/{{ audioSticker.img }}"\n' +
    '	     alt=""\n' +
    '	     class="pack-preview-sticker img-responsive center-block">\n' +
    '	<div class="player">\n' +
    '		<div class="progress" data-ng-show="showAudioProgress">\n' +
    '			<div class="bounce1"></div>\n' +
    '			<div class="bounce2"></div>\n' +
    '			<div class="bounce3"></div>\n' +
    '		</div>\n' +
    '		<div class="play" data-ng-show="!showAudioProgress"></div>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();


app.directive('audioSticker', function() {

	return {
		restrict: 'A',
		scope: {
			audioSticker: '='
		},
		templateUrl: '/directives/audioSticker/view',
		link: function ($scope, $el, attrs) {

			var audio = new Audio();
			audio.preload = 'none';

			$scope.showAudioProgress = false;
			$scope.played = false;
			$scope.loaded = false;

			function play() {
				$scope.played = true;
				audio.play();

				if (!$scope.$$phase) {
					$scope.$apply();
				}

				ga('stickerTracker.send', 'event', 'Sound sticker', 'play', $scope.audioSticker.name);
			}

			audio.onloadeddata = function() {
				$scope.showAudioProgress = false;
				$scope.loaded = true;
				play();
			};

			$el.find('.play')[0].onclick = function() {
				if (!audio.src) {
					audio.src = $scope.audioSticker.audio;
					$scope.showAudioProgress = true;
					audio.load();
				}

				if ($scope.loaded) {
					play();
				}

				if (!$scope.$$phase) {
					$scope.$apply();
				}
			};
		}
	};

});

app.controller('SoundStickersController', function($scope, ngAudio) {

	function loadAudio(name) {
		return 'mp3/audio-stickers/' + name + '.mp3';
	}

	angular.extend($scope, {
		stickers: [
			{
				name: 'Sweetie finger1',
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger1') },
			{
				name: 'Pixels car',
				img: 'auto.png',
				audio: loadAudio('Pixels/car') },
			{
				name: 'Bob&Bary chiken_bath',
				img: 'bathe.png',
				audio: loadAudio('BobAndBary/chiken_bath') },
			{
				name: 'FirstDating shower',
				img: 'bathes.png',
				audio: loadAudio('FirstDating/shower') },
			{
				name: 'Sweetie phone',
				img: 'call_eng.png',
				audio: loadAudio('Sweetie/phone') },
			{
				name: 'Bob&Bary panda_aaa',
				img: 'filth.png',
				audio: loadAudio('BobAndBary/panda_aaa') },
			{
				name: 'Bob&Bary for_you',
				img: 'flowers.png',
				audio: loadAudio('BobAndBary/for_you') },
			{
				name: 'Bob&Bary go_go_go',
				img: 'go_go_go.png',
				audio: loadAudio('BobAndBary/go_go_go') },
			{
				name: 'Gorilla drum1',
				img: 'music.png',
				audio: loadAudio('Gorilla/drum1') },
			{
				name: 'Sweetie koza1',
				img: 'goat.png',
				audio: loadAudio('Sweetie/koza1') },
			{
				name: 'Bob&Bary good_morning',
				img: 'good_morning.png',
				audio: loadAudio('BobAndBary/good_morning') },
			{
				name: 'Pixels heart',
				img: 'love.png',
				audio: loadAudio('Pixels/heart') },
			{
				name: 'Sweetie finger2',
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger2') },
			{
				name: 'FirstDating girl_heart',
				img: 'love_2.png',
				audio: loadAudio('FirstDating/girl_heart') },
			{
				name: 'FirstDating boy_heart',
				img: 'love_man.png',
				audio: loadAudio('FirstDating/boy_heart') },
			{
				name: 'FirstDating hot_girl',
				img: 'sofa.png',
				audio: loadAudio('FirstDating/hot_girl') },
			{
				name: 'FirstDating iron',
				img: 'upset.png',
				audio: loadAudio('FirstDating/iron') },
			{
				name: 'Sweetie koza2',
				img: 'goat.png',
				audio: loadAudio('Sweetie/koza2') },
			{
				name: 'Gorilla drum2',
				img: 'music.png',
				audio: loadAudio('Gorilla/drum2') },
			{
				name: 'Sweetie finger3',
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger3') }
		]
	});
});