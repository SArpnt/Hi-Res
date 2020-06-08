// ==UserScript==
// @name         Hi-Res
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      5.3.1
// @description  no more blocky blur
// @author       SArpnt
// @match        https://play.boxcritters.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://github.com/sarpnt/joinFunction/raw/master/script.js
// @require      https://github.com/sarpnt/EventHandler/raw/master/script.js
// @require      https://github.com/SArpnt/cardboard/raw/master/script.user.js
// ==/UserScript==

(function () {
	'use strict';
	cardboard.on('login', function () {
		world.stage.cache = joinFunction(world.stage.cache, world.stage.hUpdate);
		window.addEventListener('resize', world.stage.hUpdate);
		world.stage.hUpdate();
	});
	cardboard.on('runScriptShowGame', function () {
		showGame = joinFunction(showGame, function () {
			world.stage.hXPx = $('#game').width();
			world.stage.hWidthPx = -world.stage.hXPx;
			world.stage.hUpdate();
			world.stage.room.focus();
		});
	});
	cardboard.on('worldStageCreated', function () {
		let e = world.stage;
		e.hX = e.x;
		e.hY = e.y;
		e.hXPx = 0;
		e.hYPx = 0;

		e.hWidth = e.width;
		e.hHeight = e.height;
		e.hWidthPx = 0;
		e.hHeightPx = 0;

		e.hScale = 1;

		e.hCanvasWidth = e.width;
		e.hCanvasHeight = e.height;

		e.hiRes = true;
		e.hUpdate = function () {
			let stage = world.stage;
			let canvas = stage.canvas;

			canvas.height = stage.hCanvasHeight;
			canvas.width = stage.hCanvasWidth;

			let scale = canvas.offsetWidth * window.devicePixelRatio / canvas.width;
			stage.hCanvasScale = scale;

			canvas.height = canvas.offsetHeight * window.devicePixelRatio;
			canvas.width = canvas.offsetWidth * window.devicePixelRatio;

			stage.x = stage.hXPx + (stage.hX * scale);
			stage.y = stage.hYPx + (stage.hY * scale);
			stage.width = stage.hWidth + (stage.hWidthPx / scale);
			stage.height = stage.hHeight + (stage.hHeightPx / scale);
			stage.scale = stage.hScale * scale;

			if (stage.bitmapCache) stage.bitmapCache.scale = stage.hScale;
		};
	});
})();
