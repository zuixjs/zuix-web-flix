'use strict';
zuix.controller(function(cp) {
    // TODO: put your TMDB API key (http://themoviedb.org)
    const tmdbKey = '--put--your-tmdb-api-key-here--';
    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
    };
    cp.create = function(){
        const title = cp.view().attr('title');
        cp.view().css({
            'background-size': 'cover',
            'background-position-x': 'center'
        });
        if (title.length > 0) {
            zuix.$.ajax({
                url: 'https://api.themoviedb.org/3/search/multi?api_key=' + tmdbKey + '&query=' + title,
                success: function (json) {
                    const data = JSON.parse(json);
                    if (data.total_results > 0) {
                        const item = data.results[0];
                        const posterUrl = 'https://image.tmdb.org/t/p/w154' + item.poster_path;
                        cp.view().css('background-image', 'url("' + posterUrl + '")');
                        // add on click listener to open the details page
                        cp.view().on('click', function(){
                            if (detailsPage) detailsPage.show(item);
                        });
                    }
                }
            });
        }
    };
});
