var app = angular.module('js-app', ['partials', 'ngAudio']);
(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/directives/miniPlayer/view',
    '<div class="player">\n' +
    '	<div class="progress" data-ng-show="progress">\n' +
    '		<div class="bounce1"></div>\n' +
    '		<div class="bounce2"></div>\n' +
    '		<div class="bounce3"></div>\n' +
    '	</div>\n' +
    '	<div class="play" data-ng-show="!progress"></div>\n' +
    '</div>');
}]);
})();


app.controller('SoundStickersController', function($scope, ngAudio) {

	function loadAudio(name) {
		return 'mp3/audio-stickers/' + name + '.mp3';
	}

	angular.extend($scope, {
		stickers: [
			{
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger1') },
			{
				img: 'auto.png',
				audio: loadAudio('Pixels/car') },
			{
				img: 'bathe.png',
				audio: loadAudio('BobAndBary/chiken_bath') },
			{
				img: 'bathes.png',
				audio: loadAudio('FirstDating/shower') },
			{
				img: 'call_eng.png',
				audio: loadAudio('Sweetie/phone') },
			{
				img: 'filth.png',
				audio: loadAudio('BobAndBary/panda_aaa') },
			{
				img: 'flowers.png',
				audio: loadAudio('BobAndBary/for_you') },
			{
				img: 'go_go_go.png',
				audio: loadAudio('BobAndBary/go_go_go') },
			{
				img: 'music.png',
				audio: loadAudio('Gorilla/drum1') },
			{
				img: 'goat.png',
				audio: loadAudio('Sweetie/koza1') },
			{
				img: 'good_morning.png',
				audio: loadAudio('BobAndBary/good_morning') },
			{
				img: 'love.png',
				audio: loadAudio('Pixels/heart') },
			{
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger2') },
			{
				img: 'love_2.png',
				audio: loadAudio('FirstDating/girl_heart') },
			{
				img: 'love_man.png',
				audio: loadAudio('FirstDating/boy_heart') },
			{
				img: 'sofa.png',
				audio: loadAudio('FirstDating/hot_girl') },
			{
				img: 'upset.png',
				audio: loadAudio('FirstDating/iron') },
			{
				img: 'goat.png',
				audio: loadAudio('Sweetie/koza2') },
			{
				img: 'music.png',
				audio: loadAudio('Gorilla/drum2') },
			{
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger3') }
		]
	});
});

app.directive('miniPlayer', function() {

	return {
		restrict: 'A',
		scope: {
			audioUrl: '@'
		},
		templateUrl: '/directives/miniPlayer/view',
		link: function ($scope, $el, attrs) {

			var audio = new Audio();

			$scope.progress = false;

			audio.addEventListener('loadeddata', function() {
				$scope.progress = false;
			}, false);

			$el.find('.play')[0].addEventListener('click', function() {
				if (!audio.src) {
					audio.src = $scope.audioUrl;
					$scope.progress = true;
				}

				audio.play();
			});
		}
	};

});