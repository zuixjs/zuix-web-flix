/* global zuix */
'use strict';

let mainPage;
let detailsPage;

zuix.using('script', './service-worker.js');
zuix.using('style', '//genielabs.github.io/zkit/css/flex-layout-attribute.min.css');
zuix.using('style', './index.css');

zuix.$.find('.profile').on('click', function() {
    if (drawerLayout) drawerLayout.open();
});

window.options = {
    mainPage: {
        lazyLoad: false,
        ready: function() {
            mainPage = this.cover({
                "vote_average":7.2,
                "title":"Total Recall",
                "poster_path":"\/tWBo7aZk3I1dLxmMj7ZJcN8uke5.jpg",
                "backdrop_path":"\/orFQbyZ6g7kPFaJXmgty0M88wJ0.jpg",
                "overview":"Welcome to Rekall, the company that can turn your dreams into real memories. For a factory worker named Douglas Quaid, even though he's got a beautiful wife who he loves, the mind-trip sounds like the perfect vacation from his frustrating life - real memories of life as a super-spy might be just what he needs. But when the procedure goes horribly wrong, Quaid becomes a hunted man. Finding himself on the run from the police - controlled by Chancellor Cohaagen, the leader of the free world - Quaid teams up with a rebel fighter to find the head of the underground resistance and stop Cohaagen. The line between fantasy and reality gets blurred and the fate of his world hangs in the balance as Quaid discovers his true identity, his true love, and his true fate.",
                "release_date":"2012-08-02",
                "trailer": "https://youtube.com/watch?v=GljhR5rk5eY"
            });
            showPage(0);
        }
    },
    detailsPage: {
        lazyLoad: false,
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
                    showPage(i);
                });
            });
        }
    },
    pageScroll: {
        on: {
            'scroll:change': function(e, data) {
                // synchronize/animate main cover with scroll
                if (mainPage) mainPage.sync(data);
            }
        }
    },
    content: {
        css: false
    }
};

function showPage(i) {
    // show page
    zuix.field('pages')
        .children().hide()
        .eq(i).show();
}

// Turn off debug output
window.zuixNoConsoleOutput = true;
