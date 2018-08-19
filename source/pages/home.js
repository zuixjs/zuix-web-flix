'use strict';
zuix.controller(function(cp) {
    let coverItem;
    let mainCover;
    let headerOpacity;

    cp.create = function() {
        // register button handlers
        cp.field('watch-btn').on('click', playVideo);
        cp.field('details-btn').on('click', function() {
            detailsPage.show(coverItem);
        });
        // hide on startup
        cp.view().hide();
        zuix.context(cp.field('main-cover'), function() {
            mainCover = this.pictures(
                'images/total_recall_portrait.jpg',
                'images/total_recall_landscape.jpg'
            );
        });
        cp.expose('cover', setCoverItem);
        cp.expose('sync', syncWithScroll);
    };

    function setCoverItem(item) {
        coverItem = item;
        return cp.context;
    }

    function playVideo() {
        if (coverItem.trailer) window.location.href = coverItem.trailer;
    }

    function syncWithScroll(data) {
        let opacity = 1;
        if (data.event === 'hit-top') {
            opacity = 0;
        } else if (-data.info.viewport.y < data.info.viewport.height / 1.5) {
            opacity = -data.info.viewport.y / (data.info.viewport.height / 1.5);
        }
        if (opacity !== headerOpacity) {
            zuix.field('header-bar')
                .css('background-color', 'rgba(33,33,33,' + opacity + ')');
            // cover parallax effect
            if (mainCover) mainCover.translate(data.info);
            headerOpacity = opacity;
        }
        return cp.context;
    }

});
