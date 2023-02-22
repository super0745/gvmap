var $banner = ((function () {
    var creative = {};
    var $ = function (slt) {
        return document.querySelector(slt);
    }

    var timers = 0;
    var Tween;
    var endFrameOn = false;

    var HELPER = {
        isMute: true,
        "EVENTS": {
            "CLICK": (function () {
                if ('ontouchstart' in document.documentElement === true) { return 'touchstart'; } 
                else { return 'click'; }
            })(),
            "MOVE": (function () {
                if ('ontouchstart' in document.documentElement === true) { return 'touchmove'; } 
                else { return 'mousemove'; }
            })()
        }
    }

    function startAds() {
        loadScripts([
            'https://s0.2mdn.net/ads/studio/cached_libs/tweenmax_1.19.1_92cf05aba6ca4ea5cbc62b5a7cb924e3_min.js'
        ], loadAssets);
    }

    function loadAssets() {
        preloadImages([
            'poster.jpg',
            'endframe.jpg',
            'text.png'
        ], preInit);
    }

    function preInit() {
        setupDom();
        init();
    }

    function setupDom() {
        creative.dom = {};
        creative.dom.ad = $('#ad');
        creative.dom.banner = $('#banner');
        creative.dom.exit = $('#clickTag');
        creative.dom.video = {};
        creative.dom.video.vidContainer = $('#video-container');
        creative.dom.video.vid = $('#video');
        creative.dom.video.vidPlayBtn = $('#play-btn');
        creative.dom.video.vidPauseBtn = $('#pause-btn');
        // creative.dom.video.vidStopBtn = $('#stop-btn');
        creative.dom.video.vidReplayBtn = $('#replay-btn');
        creative.dom.video.vidUnmuteBtn = $('#unmute-btn');
        creative.dom.video.vidMuteBtn = $('#mute-btn');

    }

    function init() {
        Tween = new TimelineMax();

        creative.autoplay = true;
        
        addListeners();
        show();
        
    }

    function addListeners() {
        creative.dom.exit.addEventListener(HELPER.EVENTS.CLICK, exitClickHandler);
        creative.dom.video.vidPlayBtn.addEventListener(HELPER.EVENTS.CLICK, pausePlayHandler, false);
        creative.dom.video.vidPauseBtn.addEventListener(HELPER.EVENTS.CLICK, pausePlayHandler, false);
        creative.dom.video.vidMuteBtn.addEventListener(HELPER.EVENTS.CLICK, muteUnmuteHandler, false);
        creative.dom.video.vidUnmuteBtn.addEventListener(HELPER.EVENTS.CLICK, muteUnmuteHandler, false);
        creative.dom.video.vidReplayBtn.addEventListener(HELPER.EVENTS.CLICK, replayHandler, false);
        // creative.dom.video.vidStopBtn.addEventListener(HELPER.EVENTS.CLICK, stopHandler, false);

        creative.dom.video.vid.addEventListener('timeupdate', updateTimerDisplay, false);
        creative.dom.video.vid.addEventListener('ended', videoEndHandler, false);
        // creative.dom.exit.addEventListener('mouseover', muteUnmuteHandler, false);
        // creative.dom.exit.addEventListener('mouseout', muteUnmuteHandler, false);
    }

    function show() {
        creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
        creative.dom.video.vidUnmuteBtn.style.visibility = 'visible';
        creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
        creative.dom.video.vidPlayBtn.style.visibility = 'visible';
        if (creative.autoplay) {
            if (creative.dom.video.vid.readyState >= 2) {
                startMuted(null);
            } else {
                creative.dom.video.hasCanPlay = true;
                creative.dom.video.vid.addEventListener('canplay', startMuted, false);
            }
            // HACK: Safari experiences video rendering issues, fixed by forcing a viewport refresh
            // creative.dom.video.vidMuteBtn.style.visibility = 'visible';
            // setTimeout(function () {
            //     creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
            // }, 200);
        } else {
            creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
            creative.dom.video.vidUnmuteBtn.style.visibility = 'visible';
            creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
            creative.dom.video.vidPlayBtn.style.visibility = 'visible';
        }
    }

    function videoEndHandler(e) {
        // if (!endFrameOn) {
        //     creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
        //     creative.dom.video.vidUnmuteBtn.style.visibility = 'hidden';
        //     creative.dom.video.vidPlayBtn.style.visibility = 'hidden';
        //     creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
        //     EndAnim();
        // }
    }

    function startMuted(e) {
        // Leaving the listener can cause issues on Chrome / Firefox
        if (creative.dom.video.hasCanPlay) {
            creative.dom.video.vid.removeEventListener('canplay', startMuted);
            creative.dom.video.hasCanPlay = false;
        }


        // If paused then play
        creative.dom.video.vidPauseBtn.style.visibility = 'visible';
        creative.dom.video.vidPlayBtn.style.visibility = 'hidden';
        creative.dom.video.vidUnmuteBtn.style.visibility = 'visible';
        creative.dom.video.vid.muted = HELPER.isMute;
        // creative.dom.video.vid.currentTime = 0;
        creative.dom.video.vid.play();

        
    }

    function pausePlayHandler(e) {
        // Under IE10, a video is not 'paused' after it ends.
        if (creative.dom.video.vid.paused || creative.dom.video.vid.ended) {
            // If paused then play
            creative.dom.video.vid.play();
            creative.dom.video.vidPauseBtn.style.visibility = 'visible';
            creative.dom.video.vidPlayBtn.style.visibility = 'hidden';
        } else {
            creative.dom.video.vid.pause();
            creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
            creative.dom.video.vidPlayBtn.style.visibility = 'visible';
        }
    }

    function muteUnmuteHandler(e) {
        if (creative.dom.video.vid.muted == true) {
            HELPER.isMute = false;
            creative.dom.video.vid.muted = HELPER.isMute;
            creative.dom.video.vidMuteBtn.style.visibility = 'visible';
            creative.dom.video.vidUnmuteBtn.style.visibility = 'hidden';
        } else {
            HELPER.isMute = true;
            creative.dom.video.vid.muted = HELPER.isMute;
            creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
            creative.dom.video.vidUnmuteBtn.style.visibility = 'visible';
        }
    }

    function stopHandler(e) {
        creative.dom.video.vid.currentTime = 0;
        creative.dom.video.vid.pause();
        creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
        creative.dom.video.vidPlayBtn.style.visibility = 'visible';
    }

    function replayHandler(e) {
        endFrameOn = false;
        
        TweenMax.killAll();
        Tween.pause();
        Tween.seek(0);

        removeEndframe();
        
        creative.dom.video.vid.currentTime = 0;
        creative.dom.video.vid.play();
        creative.dom.video.vid.muted = true;
        creative.dom.video.vidPauseBtn.style.visibility = 'visible';
        creative.dom.video.vidPlayBtn.style.visibility = 'hidden';
        creative.dom.video.vidContainer.style.opacity = 1;

        creative.dom.video.vid.muted = HELPER.isMute;
        if (HELPER.isMute) {
            creative.dom.video.vidUnmuteBtn.style.visibility = 'visible';
            creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
        } else {
            creative.dom.video.vidUnmuteBtn.style.visibility = 'hidden';
            creative.dom.video.vidMuteBtn.style.visibility = 'visible';
        }

        
    }

    function videoTimeUpdateHandler(e) {
        var perc = creative.dom.video.vid.currentTime / creative.dom.video.vid.duration;
        creative.dom.video.vidProgressBar.style.width = Math.round(100 * perc) + '%';
    }

    function exitClickHandler() {
        window.open(window.clickTag);

        if (!endFrameOn) {
            TweenMax.to(".js-video-container", 0.01, { autoAlpha: 0, ease: Power0.easeNone, delay: 0 });
            EndAnim();
        }
        creative.dom.video.vid.pause();
        creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
        creative.dom.video.vidPlayBtn.style.visibility = 'hidden';

        creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
        creative.dom.video.vidUnmuteBtn.style.visibility = 'hidden';

    }

    // Banner Animation

    function updateTimerDisplay() {
        if (creative.dom.video.vid.currentTime >= creative.dom.video.vid.duration - 0.75) {

            if (!endFrameOn) {
                creative.dom.video.vidMuteBtn.style.visibility = 'hidden';
                creative.dom.video.vidUnmuteBtn.style.visibility = 'hidden';
                creative.dom.video.vidPlayBtn.style.visibility = 'hidden';
                creative.dom.video.vidPauseBtn.style.visibility = 'hidden';
                EndAnim();
            }
        }
    }

    function _onStart() {}

    function _onUpdate() {}

    function _onComplete() {}

    // Endframe Animation
    function EndAnim() {
        endFrameOn = true;
        console.info('Animation Starting ...!');
        timers = 0;
        Tween.play();

        Tween.add(TweenMax.to(".js-wrapper-endframe", 1.25, { autoAlpha: 1, ease: Power0.easeNone, onComplete: function () {
            creative.dom.video.vid.currentTime = 0;
            creative.dom.video.vid.pause();
            creative.dom.video.vidContainer.style.opacity = 0;
            TweenMax.to(creative.dom.video.vidReplayBtn, 0.25, { 'visibility': 'visible', autoAlpha: 1 });
        } }), timers);

    }

    function removeEndframe() {
        TweenMax.to(['.js-wrapper-endframe'], 0.01, { clearProps: 'all', delay: 0 });
        TweenMax.to(creative.dom.video.vidReplayBtn, 0.01, { clearProps: 'all', delay: 0 });
    }

    return startAds;

})());

window.addEventListener('load', $banner);