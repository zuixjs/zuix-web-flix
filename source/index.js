'use strict';

let currentPage;
let mainPage;
let detailsPage;

zuix.using('script', './service-worker.js');
zuix.using('style', '//zuixjs.github.io/zkit/css/flex-layout-attribute.min.css');
zuix.using('style', './index.css');

window.options = {
    mainPage: {
        lazyLoad: false,
        ready: function() {
            mainPage = this.cover({
                "vote_average":7.2,
                "title":"Total Recall",
                "poster_path":"images\/total_recall_portrait.jpg",
                "backdrop_path":"images\/total_recall_landscape.jpg",
                "overview":"Welcome to Rekall, the company that can turn your dreams into real memories. For a factory worker named Douglas Quaid, even though he's got a beautiful wife who he loves, the mind-trip sounds like the perfect vacation from his frustrating life - real memories of life as a super-spy might be just what he needs. But when the procedure goes horribly wrong, Quaid becomes a hunted man. Finding himself on the run from the police - controlled by Chancellor Cohaagen, the leader of the free world - Quaid teams up with a rebel fighter to find the head of the underground resistance and stop Cohaagen. The line between fantasy and reality gets blurred and the fate of his world hangs in the balance as Quaid discovers his true identity, his true love, and his true fate.",
                "release_date":"2012-08-02",
                "trailer": "https://youtube.com/watch?v=GljhR5rk5eY"
            });
            showPage(0);
        }
    },
    detailsPage: {
        lazyLoad: false,
        on: {
            'page:show': function() { bodyScrollEnable(false); },
            'page:hide': function() { bodyScrollEnable(true); }
        },
        ready: function() {
            detailsPage = this;
        }
    },
    footerBar: {
        ready: function(){
            const view = zuix.$(this.view());
            const buttons = view.find('button');
            buttons.each(function(i, el) {
                this.on('click', function() {
                    buttons.removeClass('active');
                    this.addClass('active');
                    window.location.href = '#'+this.attr('ref');
                });
            });
        }
    },
    pageScroll: {
        on: {
            'scroll:change': function(e, data) {
                // synchronize/animate main cover with scroll
                if (currentPage == 0 && mainPage) {
                    mainPage.sync(data);
                }
            }
        }
    },
    content_no_css: {
        css: false
    }
};

// site navigation
window.onhashchange = function() {
    if (window.location.hash.length > 0) {
        switch (window.location.hash) {
            case '#home':
                showPage(0);
                break;
            case '#search':
                showPage(1);
                break;
            case '#notifications':
                showPage(2);
                break;
            case '#about':
                showPage(3);
                break;
        }
    } else showPage(0);
};

function showPage(i) {
    currentPage = i;
    // sync header bar transparency
    if (currentPage == 0) {
        mainPage.sync();
    } else {
        zuix.field('header-bar')
            .css('background-color', 'rgba(33,33,33,1)');
    }
    // hide details page if open
    if (detailsPage && detailsPage.view().style['display'] !== 'none') {
        detailsPage.hide();
    } else {
        // show page
        zuix.field('pages')
            .children().hide()
            .eq(i).show();
    }
}

function bodyScrollEnable(enable) {
    const body = zuix.$(document.body);
    if (enable === false) body.addClass('noscroll');
    else body.removeClass('noscroll');
}

// increase lazy-load hit area up to
// 300px off the viewport boundaries
// (circa 3 movie items ahead)
//zuix.lazyLoad(true, -500);

// Turn off debug output
window.zuixNoConsoleOutput = true;
