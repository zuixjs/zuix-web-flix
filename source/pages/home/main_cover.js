'use strict';
zuix.controller(function(cp) {
    let cover;
    let isPortrait = false;
    let portraitImage;
    let landscapeImage;

    cp.create = function() {
        cover = cp.view('.cover');
        // detect orientation change
        const orientation = window.matchMedia('(orientation: portrait)');
        if (orientation.matches) isPortrait = true;
        orientation.addListener(orientationChange);
        // public method to set portrait and landscape images
        cp.expose('pictures', setPictures);
        // expose translate method for parallax effect
        cp.expose('translate', setOffsetY);
    };
    cp.destroy = function() {
        window.matchMedia('(orientation: portrait)').removeListener(orientationChange);
    };

    function setPictures(imageP, imageL) {
        portraitImage = imageP;
        landscapeImage = imageL;
        refresh();
        return cp.context;
    }

    function setOffsetY(scrollInfo) {
        const offsetY = -scrollInfo.viewport.y / 6;
        cover.css('transform', 'translateY('+offsetY+'px)');
        //const factor = (.08 / (scrollInfo.viewport.height / -scrollInfo.viewport.y));
        //const magnify = 1 + factor;
        //cover.css('transform', 'translateY('+offsetY+'px) scale('+magnify+')');
        // TODO: blur is too slow on mobile devices.. =/
        // TODO: uncomment the following line if you want to try it out
        //cover.css('filter', 'blur('+(3*factor)+'rem)');
        return cp.context;
    }

    function orientationChange(mediaEvent) {
        isPortrait = mediaEvent.matches;
        refresh();
    }

    function refresh() {
        if (isPortrait) {
            if (portraitImage) {
                cover.css('background-image', 'url("'+portraitImage+'")');
            }
        } else if (landscapeImage) {
            cover.css('background-image', 'url("'+landscapeImage+'")');
        }
    }
});
