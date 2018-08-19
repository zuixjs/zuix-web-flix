'use strict';
zuix.controller(function(cp) {
    cp.create = function() {
        cp.expose('show', showPage);
        cp.expose('hide', hidePage);
        // register back button handler
        cp.field('cover').find('button').on('click', hidePage);
        // hide on startup
        cp.view().hide();
    };

    function showPage(item) {
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
});
