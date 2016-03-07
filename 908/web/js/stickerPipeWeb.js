var app = angular.module('js-app', ['partials', 'ngAudio']);
(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/controllers/audio-stickers/view',
    '<div class="col-sm-3 col-xs-6 text-center">\n' +
    '	<div class="sound-sticker center-block">\n' +
    '		<img src="img/packs/1.png" alt="" class="pack-preview-sticker img-responsive center-block">\n' +
    '		<div class="player"></div>\n' +
    '	</div>\n' +
    '</div>\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/2.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/3.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/4.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/5.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/6.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/7.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<!--<div class="col-sm-3 col-xs-6 text-center">-->\n' +
    '	<!--<div class="sound-sticker center-block">-->\n' +
    '		<!--<img src="img/packs/8.png" alt="" class="pack-preview-sticker img-responsive center-block">-->\n' +
    '		<!--<div class="player"></div>-->\n' +
    '	<!--</div>-->\n' +
    '<!--</div>-->');
}]);
})();


app.controller('SoundStickersController', function($scope, ngAudio) {

	function loadAudio(name) {
		return ngAudio.load('mp3/audio-stickers/' + name + '.mp3');
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
				audio: loadAudio('gorilla/drum1') },
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
				audio: loadAudio('gorilla/drum2') },
			{
				img: 'attention.png',
				audio: loadAudio('Sweetie/finger3') }
		]
	});
});