/* global zuix */
'use strict';

let mainCover;
let headerOpacity;
let detailsPage;

zuix.using('script', './service-worker.js');
zuix.using('style', '//genielabs.github.io/zkit/css/flex-layout-attribute.min.css');
zuix.using('style', './index.css');

zuix.$.find('.profile').on('click', function() {
    if (drawerLayout) drawerLayout.open();
});

window.options = {
    mainCover: {
        ready: function() {
            mainCover = this;
            mainCover.pictures(
                'https://pad.mymovies.it/filmclub/2011/01/018/locandinapg3.jpg',
                'https://i1.wp.com/www.heyuguys.com/images/2012/08/Total-Recall-UK-Quad-Poster.jpg?ssl=1'
            );
        }
    },
    footerBar: {
        ready: function(){
            const view = zuix.$(this.view());
            const buttons = view.find('button');
            buttons.each(function(i, el) {
                // TODO:
                this.on('click', function() {
                    buttons.removeClass('active');
                    this.addClass('active');
                    showPage(i);
                });
            });
            showPage(0);
        }
    },
    pageScroll: {
        on: {
            'scroll:change': function(e, data) {
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
                    if (mainCover) {
                        mainCover.translate(data.info);
                    }
                    headerOpacity = opacity;
                }
            }
        }
    },
    content: {
        css: false
    },
    detailsPage: {
        lazyLoad: false,
        ready: function() {
            detailsPage = this;
        }
    }
};

function showPage(i) {
    // show page
    zuix.field('pages')
        .children().hide()
        .eq(i).show();
}

// Turn off debug output
//window.zuixNoConsoleOutput = true;
