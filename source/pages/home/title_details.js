'use strict';
zuix.controller(function(cp) {
    let headerBar;
    let headerTitle;
    let currentOpacity = 0;
    cp.create = function() {
        headerBar = cp.view('header');
        headerTitle = headerBar.find('h1').hide();
        // register back button handler
        headerBar.find('button').on('click', hidePage);
        // load scroll helper
        zuix.load('@lib/controllers/scroll_helper', {
            view: cp.view('main'),
            on: { 'scroll:change': syncHeader }
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
    }
    function hidePage() {
        cp.view()
            .css('left', '100vw')
            .one('transitionend', function(){
                cp.view().hide();
            });
    }
    function syncHeader(e, data) {
        // synchronize header bar transparency
        const coverHeight = data.info.viewport.height*0.4;
        let headerOpacity = -data.info.viewport.y / coverHeight;
        if (headerOpacity > 1) headerOpacity = 1;
        if (headerOpacity !== currentOpacity) {
            currentOpacity = headerOpacity;
            headerBar.css('background-color', 'rgba(33,33,33,' + headerOpacity + ')');
        }
        if (-data.info.viewport.y > coverHeight && headerTitle.display() === 'none') {
            headerTitle.show();
        } else if (-data.info.viewport.y < coverHeight && headerTitle.display() !== 'none') {
            headerTitle.hide();
        }
    }
});
