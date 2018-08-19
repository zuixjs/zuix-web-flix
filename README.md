# zuix-web-flix

A Progressive Web App template inspired by NetFlix mobile app.

This template is built on just HTML, JavaScript and CSS so that it can be eventually integrated with your favourite development enviroment and build tools.

## Features

- NetFlix app inspired design
- Component-based web development with zUIx.js
- In-Browser bundler to pack all resources in a single file and boost-up loading speed
- PWA LightHouse score 99/100

![LightHouse Report](https://genielabs.github.io/zuix-web-flix/images/lighthouse-report.png)

### Demo Website

https://genielabs.github.io/zuix-web-flix

# How to use this template

The **./source** folder contains the *development* version of the website, while the **./docs** folder the *production* bundled version.

## Basic usage

If you have *Node.js* installed, for a quick setup you can use the integrated web server which will serve files from the *./source* folder.
Install the develppment dependencies with `npm install` and then start the web server:

```
npm start
```

If you don't want to use *Node.js* and you already have a web server, create a new host with the root path pointing to the *./source* folder.


## Site structure in brief

The main file is the `index.html`. This file includes some layout bits that are stored in the `./layout` folder and the main application pages that are stored in the `./pages` folder.

```
./source/
  ./layout/
     footer.css
     footer.html
     header.css
     header.html
  ./pages/
     about.css
     about.html
     home/ (folder)
     home.css
     home.html
     home.js
     notifications.css
     notifications.html
     search.css
     search.html
```

A simple page is defined by the `.css` and `.html` files. A page may also require some bits of *JavaScript* in which case also a `.js` file with the same base name is present.

A complete example is the `./pages/home` page which has a `.js` file and also loads some sub-components that are located in the `./pages/home/` folder.

As you can see in the `index.html` file those pages and layout bits are loaded using some special tag attributes that are `data-ui-include` (to load simple content pages) and `data-ui-load` to load pages or components that also have a JavaScript controller.

Read the documentation linked at the end of this text for further information about component-based development with **zUIx.js**.

### Movie lists

The list of movies are located in the `./pages/home/` folder and consists of a static list of items to which is bound a *controller* that carry the duty of querying the [The Movie Database](https://www.themoviedb.org/) to fetch each title data and images.

Each *movie item* is defined as follow:
```
<div class="movie">
  <a title="Total recall" data-ui-load="controllers/movie_db" data-ui-lazyload="true" class="item"><!-- no-view --></a>
</div>
```
The `data-ui-load="controllers/movie_db"` will make *zUIx.js* load the `./controllers/movie_db.js` on the element. This contoller will read the `title` attribute of the item and fetch the movie data using *TMDB API*.

To make this work you must obtain an API key and put the value at the beginning of the `./controllers/movie_db.js` file:

```javascript
// TODO: get your free TMDB API key from https://themoviedb.org
const tmdbKey = '--put--your-tmdb-api-key-here--';
```

You can of course replace the static movie lists with server generated lists that renders the *movie items* as described above.

### Main page

The main page is formed by a cover, which collapses as the page is scrolled, and a *movie details page* which pop-ups when a movie item is tapped.

The main page is available throught the global object `mainPage` and exposes two method: `cover` and `sync`.
The first method is used to set which movie title to show as the main page cover, while the latter is used to synchronize the cover with the page scroll.

You can see how these methods are implemented in the `./pages/home.js` file and how these are used in the main `index.js` file.

The *details page* is available as the global object `detailsPage` and it has two methods: `show` and `hide`.
The first method requires the movie item data as argument. You can see how it is used in the `./controllers/movie_db.js` file to open a movie detail when the preview image is tapped.

### Further implementation details

If you have more questions about how to use this template do not esitate to [file an issue](https://github.com/genielabs/zuix-web-flix/issues).


## Debugging

To enable verbose debugging information comment in the last line in the `index.js` file:

``` javascript
// Turn off debug output
//window.zuixNoConsoleOutput = true;
```


## Bundling

Bundling is the process of collecting all resources used in a page and then compiling them into a single, optimized file.

This will drastically narrow down the number of network requests the browser will make to complete the page loading resulting in a faster startup.

There are actually two way of doing this:

- **In-Browser** bundler:
this method does not require any build tool nor plugins, it just works in the browser as-is.

- **Web-Starter** bundler:
is the [zuix-web-starter](https://github.com/genemars/zuix-web-starter) bare template, with a bunch of extra features and enhancements. It requires *Node.js* to be installed.

This template is already configured for **in-browser** bundling.

### In-Browser bundling

When the website is ready for production you can decide to bundle it in order to gain better performances. All of its components and resources will be crunched into a single file and loaded from memory rather than from network/localhost.

#### Step by step guide

Open the development website and generate the application bundle by typing in the **browser console** the command

```javascript
zuix.saveBundle()
```

This will create and save the **app.bundle.js** file to the *Downloads* folder.

Copy all files from the *source* folder to the **production** folder (*./docs*) with the exception of *./components*, *./controllers*, *./pages*, *./layout* and *./index.css*.

These folders contain *zuix* components and pages that are already packed in the *app.bundle.js* file.

Copy *app.bundle.js* to the *production* folder. Edit the `index.html` file in the *production* folder and in the `head` section replace the `js/zuix-bundler.min.js` script import with `app.bundle.js`.

```html
<script src="js/zuix.min.js"></script>
<script src="app.bundle.js"></script>
```

You can also remove all `js/zuix*.*` files from the *production* folder but keep the `zuix.min.js` one.

#### Remarks

When using *lazy-loading* only components loaded so far will be included in the bundle (incremental bundling).

To force inclusion of all components/resources used in the page, issue the following commands in the console:

```javascript
// disable lazy-loading
zuix.lazyLoad(false)
// force loading of all components
zuix.componentize()
// create the bundle
zuix.saveBundle()
```

Also external JavaScript libraries and CSS files can be included in the page bundle. In order to achieve this, remove the `<script src="..."></script>` or `<link rel="stylesheet">` and use the method `zuix.using(...)` instead to load the script/css.

```javascript
// Loading a .css style
const flaCss = 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css';
zuix.using('style', flaCss, function(res, styleObject) {
    console.log("Added Flex Layout Attributes CSS.", res, styleObject);
});
// Loading a .js script
const momentJs = 'https://momentjs.com/downloads/moment.js';
zuix.using('script', momentJs, function(res, scriptObject){
    console.log("Added Moment.js.", res, scriptObject);
});
```

Place the *using* commands preferably at the top of `index.js`. You can remove from the *production* folder all files imported with the *using* command.

# Further reading

- [zUIx.js](https://genielabs.github.io/zuix)
- [Progressive Web App](https://developers.google.com/web/progressive-web-apps)
- [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
