// ==UserScript==
// @name         Hi-Res
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @version      5.0.0
// @description  no more blocky blur
// @author       SArpnt
// @match        https://boxcritters.com/play/*
// @match        https://play.boxcritters.com/
// @grant        none
// @require      https://raw.githubusercontent.com/SArpnt/joinFunction/master/script.js
// ==/UserScript==

(function () {
	'use strict';
	function onLogin() {
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
	}
	function onWorld() {
		let e = world.stage;
		e.hX = world.stage.y;
		e.hY = world.stage.x;
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

		world.socket.on('connect', onLogin);
	}

	if (typeof world == 'undefined') {
		console.warn('hi-res --- no world!');
	} else onWorld();
})();