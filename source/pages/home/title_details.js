'use strict';
zuix.controller(function(cp) {
    let headerBar;
    let coverTitle;
    let headerTitle;
    let scrollHelper;
    cp.create = function() {
        headerBar = cp.view('header');
        coverTitle = cp.view('main').find('h1');
        headerTitle = headerBar.find('h1');
        // register back button handler
        headerBar.find('button').on('click', hidePage);
        // load scroll helper used for the cross-fading title/header effect
        zuix.load('@lib/controllers/scroll_helper', {
            view: cp.view('main'),
            on: {
                'scroll:change': function(e, data) {
                    // make header transparent on top of page and cover title visible
                    switch (data.event) {
                        case 'hit-top':
                            headerBar.css('background-color', 'rgba(33,33,33,0)');
                            headerTitle.css('opacity', 0);
                            coverTitle.css('opacity', 1);
                            cp.field('cover')
                                .css('background-position-y', 0);
                            break;
                        case 'scroll':
                            const viewport = data.info.viewport;
                            if (viewport.y > -viewport.height / 2.5) {
                                cp.field('cover')
                                    .css('background-position-y', -(viewport.y/5)+'px');
                            }
                            break;
                    }
                }
            },
            ready: function() {
                scrollHelper = this;
                // watch elements with .watchable class (the title)
                this.watch('.watchable', function(el, data) {
                    // synchronize header opacity with cover title position
                    const opacity = (data.frame.dy/0.3);
                    if (data.frame.dy < 0.3) {
                        if (data.frame.dy > -0.3) {
                            coverTitle.css('opacity', opacity+0.5);
                        }
                        if (-opacity >= 0) {
                            headerBar.css('background-color', 'rgba(33,33,33,' + (-opacity) + ')');
                        }
                    }
                    if (data.frame.dy < 0.125) {
                        headerTitle.css('opacity', -opacity);
                    }
                });
            }
        });
        // hide on startup
        cp.view().hide();
        // expose public methods
        cp.expose('show', showPage);
        cp.expose('hide', hidePage);
    };
    function showPage(item) {
        // update location href
        window.location.href = "#details";
        // show details page
        cp.view().show();
        // go to top of page
        scrollHelper.scrollStart();
        // this is a work-around otherwise animation would not start
        // any suggestion for a better solution is welcome =)
        setTimeout(function(){
            cp.view().css('left', 0);
        }, 10);
        const backdropUrl = 'url("'+item.backdrop_path+'")';
        cp.field('cover')
            .css('background-image', backdropUrl);
        cp.field('title').html(item.title || item.original_name);
        cp.field('overview').html(item.overview);
        cp.field('vote').html(item.vote_average);
        cp.trigger('page:show');
    }
    function hidePage() {
        cp.view()
            .css('left', '100vw')
            .one('transitionend', function(){
                cp.view().hide();
            });
        // fire 'hide' event
        cp.trigger('page:hide');
    }
});
