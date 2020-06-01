// ==UserScript==
// @name         Hi-Res
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      5.1.3
// @description  no more blocky blur
// @author       SArpnt
// @match        https://play.boxcritters.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/gh/sarpnt/joinFunction/script.min.js
// @require      https://cdn.jsdelivr.net/gh/sarpnt/EventHandler/script.min.js
// @require      https://cdn.jsdelivr.net/gh/boxcritters/cardboard/script.user.min.js
// ==/UserScript==

(function () {
	'use strict';
	cardboard.on('login', function () {
		var resUpdate = function () {
			let stage = world.stage;
			let canvas = stage.canvas;

			canvas.height = stage.hCanvasHeight;
			canvas.width = stage.hCanvasWidth;

			let scale = canvas.offsetWidth / canvas.width;
			stage.hCanvasScale = scale;

			canvas.height = canvas.offsetHeight;
			canvas.width = canvas.offsetWidth;

			stage.x = stage.hXPx + (stage.hX * scale);
			stage.y = stage.hYPx + (stage.hY * scale);
			stage.width = stage.hWidth + (stage.hWidthPx / scale);
			stage.height = stage.hHeight + (stage.hHeightPx / scale);
			stage.scale = stage.hScale * scale;

			if (stage.bitmapCache) stage.bitmapCache.scale = stage.hScale;
		};
		let old2 = world.stage.cache;
		world.stage.cache = function (...i) {
			old2.call(world.stage, ...i);
			resUpdate();
		};
		showGame = joinFunction(showGame, function () {
			world.stage.hXPx = $('#game').width();
			world.stage.hWidthPx = -world.stage.hXPx;
			resUpdate();
			world.stage.room.focus();
		});
		window.addEventListener('resize', resUpdate);
		world.stage.hUpdate = resUpdate;
		resUpdate();
	})

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
	})
})();