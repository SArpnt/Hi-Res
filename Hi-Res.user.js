// ==UserScript==
// @name         Hi-Res
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      5.4.0
// @description  no more blocky blur
// @author       SArpnt
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://github.com/sarpnt/joinFunction/raw/master/script.js
// @require      https://github.com/sarpnt/EventHandler/raw/master/script.js
// @require      https://github.com/SArpnt/cardboard/raw/master/script.user.js
// ==/UserScript==

(function () {
	'use strict';
	cardboard.on('worldStageCreated', function () {
		let s = world.stage;
		s.hX = s.x;
		s.hY = s.y;
		s.hXPx = 0;
		s.hYPx = 0;

		s.hWidth = s.width;
		s.hHeight = s.height;
		s.hWidthPx = 0;
		s.hHeightPx = 0;

		s.hScale = 1;

		s.hCanvasWidth = s.width;
		s.hCanvasHeight = s.height;

		s.hiRes = true;
		s.hUpdate = function () {
			let canvas = s.canvas;

			canvas.height = s.hCanvasHeight;
			canvas.width = s.hCanvasWidth;

			let scale = canvas.offsetWidth * window.devicePixelRatio / canvas.width;
			s.hCanvasScale = scale;

			let temp = canvas.offsetWidth * window.devicePixelRatio;
			canvas.height = canvas.offsetHeight * window.devicePixelRatio;
			canvas.width = temp;

			s.x = s.hXPx + (s.hX * scale);
			s.y = s.hYPx + (s.hY * scale);
			s.width = s.hWidth + (s.hWidthPx / scale);
			s.height = s.hHeight + (s.hHeightPx / scale);
			s.scale = s.hScale * scale;

			if (s.bitmapCache)
				if (s.bitmapCache.hScale)
					s.bitmapCache.scale = s.bitmapCache.hScale * scale;
				else if (s.bitmapCache.hUpdate)
					s.bitmapCache.hUpdate();
		};
		cardboard.on('login', function () {
			s.cache = joinFunction(s.cache, function (_a, _b, _c, _d, _e, _f, h) {
				if (h) {
					if (typeof h == 'function') {
						s.bitmapCache.hUpdate = h;
						s.bitmapCache.hUpdate();
					}
				} else {
					s.bitmapCache.hScale = s.bitmapCache.scale;
					s.bitmapCache.scale = s.bitmapCache.hScale * s.hCanvasScale;
				}
			});
			window.addEventListener('resize', s.hUpdate);
			s.hUpdate();
			/*
			cardboard.on('runScriptShowGame', function () {
				showGame = joinFunction(showGame, function () {
					s.hXPx = $('#game').width();
					world.stage.hWidthPx = -world.stage.hXPx;
					world.stage.hUpdate();
					world.stage.room.focus();
				});
			});
			*/
		});
	});
})();
