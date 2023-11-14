const videoContainer = document.querySelector(".video-container");
const playPauseBtn = document.querySelector(".play-pause-btn");
const videoControlsContainer = document.querySelector(".video-controls-container");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const video = document.querySelector("video");
const settingBtn = document.querySelector(".setting-btn");
const captionBtn = document.querySelector(".caption-btn");
const videoControlsOnVideo = document.querySelector(".video-controls-onVideo");
const videoTrackContainer = document.querySelector('.video-track-container');

document.addEventListener("keydown", e => {

    const tageName = document.activeElement.tagName.toLowerCase();

    if (tageName === "input") return;

    switch (e.key.toLowerCase()) {
        case " ":
            if (tageName === "button") return;
        case "k": togglePlay();
            videoControlsOnVideo.classList.remove("opacity-zero");
            break;
        case "f": toggleFullScreenMode();
            break;
    }
});

//  Play and Pause

videoControlsOnVideo.addEventListener("click", function () {
    togglePlay();
    videoControlsOnVideo.classList.remove("opacity-zero");
});
playPauseBtn.addEventListener("click", function () {
    togglePlay();
    videoControlsOnVideo.classList.add("opacity-zero");
});

function togglePlay() {
    video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused");
});

// FullScreen

let timeoutId;


fullScreenBtn.addEventListener("click", toggleFullScreenMode);

function toggleFullScreenMode() {

    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen();
        SetControlsInPlayFullMode();
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen");
    SetControlsInPlayFullMode();
});

function SetControlsInPlayFullMode() {
    let videoContainerFullScreen = videoContainer.classList.contains("full-screen");

    if (videoContainerFullScreen) {

        function fadeOut() {
            videoContainer.classList.add("opacity-zero");
            videoContainer.style.cursor = "none";
        }

        function resetOpcatiy() {
            videoContainer.classList.remove("opacity-zero");
            videoContainer.style.cursor = "default";
        }
        videoContainer.addEventListener('mousemove', function () {
            if (videoContainer.classList.contains("opacity-zero")) {
                clearTimeout(timeoutId);
                resetOpcatiy();
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(fadeOut, 4000);
            }
        });

    } else {
        videoContainer.classList.remove("opacity-zero");
        videoContainer.style.cursor = "default";
    }
}


// ASS Subtitle


(function (libjass) {
    'use strict';

    var vjs_ass = function (options) {
        var overlay = document.createElement('div'),
            clock = null,
            clockRate = options.rate || 1,
            delay = options.delay || 0,
            player = options.player,
            subCon = options.subCon,
            renderer = null,
            AssButton = null;

        if (!options.src) {
            return;
        }

        overlay.className = 'vjs-ass';

        subCon.insertBefore(overlay, subCon.firstChild.nextSibling);

        function getCurrentTime() {
            return player.currentTime - delay;
        }

        clock = new libjass.renderers.AutoClock(getCurrentTime, 500);

        player.addEventListener('play', function () {
            clock.play();
        });

        player.addEventListener('pause', function () {
            clock.pause();
        });

        player.addEventListener('seeking', function () {
            clock.seeking();
        });

        function updateClockRate() {
            clock.setRate(player.playbackRate * clockRate);
        }

        updateClockRate();
        player.addEventListener('ratechange', updateClockRate);

        function updateDisplayArea() {
            setTimeout(function () {
                renderer.resize(player.offsetWidth, player.offsetHeight);
            }, 100);
        }

        window.addEventListener('resize', updateDisplayArea);

        player.addEventListener('loadedmetadata', updateDisplayArea);
        player.addEventListener('resize', updateDisplayArea);
        player.addEventListener('fullscreenchange', updateDisplayArea);

        player.addEventListener('dispose', function () {
            clock.disable();
        });

        libjass.ASS.fromUrl(options.src, libjass.Format.ASS).then(
            function (ass) {
                var rendererSettings = new libjass.renderers.RendererSettings();
                if (options.hasOwnProperty('enableSvg')) {
                    rendererSettings.enableSvg = options.enableSvg;
                }
                if (options.hasOwnProperty('fontMap')) {
                    rendererSettings.fontMap = new libjass.Map(options.fontMap);
                } else if (options.hasOwnProperty('fontMapById')) {
                    rendererSettings.fontMap = libjass.renderers.RendererSettings
                        .makeFontMapFromStyleElement(document.getElementById(options.fontMapById));
                }

                renderer = new libjass.renderers.WebRenderer(ass, clock, overlay, rendererSettings);
            }
        );

        captionBtn.addEventListener('click', () => {
            if (videoContainer.classList.contains('inactive')) {
                videoContainer.classList.remove('inactive');
                overlay.style.display = "";
            } else {
                videoContainer.classList.add('inactive');
                overlay.style.display = "none";
            }
        })
    };

    window.libjass_ass = vjs_ass;
}(window.libjass));
