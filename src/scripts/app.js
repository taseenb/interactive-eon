define( function ( require ) {

  'use strict';

  // Create App global
  window.App = window.App || {};

  // Backbone
  //var _ = require( 'backbone' );
  var Backbone = require( 'backbone' );
  var Router = require( 'router' );


  // Mediator - pub/sub
  var Mediator = require( 'mediator-js' );
  App.mediator = new Mediator();


  // Resize event (published by mediator on every window resize)
  var resizeEvent = require( 'resize' );
  resizeEvent.initialize();


  // Responsive
  App.mainBreakpoint = 940;
  App.maxSummaryHeight = 768;


  // Support
  var $html = $( 'html' );
  App.supportTransitions = $html.hasClass( 'csstransitions' ); // used to determine if we are on a modern browser (> IE9)
  App.isTouch = $html.hasClass( 'touch' );
  App.isPhone = App.isTouch && (App.width < 481 || App.height < 481);
  App.isIE = $html.hasClass( 'no-smil' ); // ie 9, 10, 11 + Edge //
  App.isFirefox = navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1; // Firefox does not support transform-origin on SVG elements, so we have to disable transform on the graph nodes
  App.isSafari = /Safari/.test( navigator.userAgent ) && /Apple Computer/.test( navigator.vendor );

  $html.addClass( (App.isFirefox ? '' : 'no-') + 'firefox' );

  // Hack for mobile safari
  // See: https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
  if ( App.isTouch ) {
    document.addEventListener( "touchstart", function () {
    }, true );
  }

  // Disable console.log on IE 9
  if ( !window.console ) {
    window.console = {};
  }
  if ( !console.log ) {
    console.log = function () {
    };
  }


  // Analytics
  require( 'analytics' );


  // Get data and start main view
  $.ajax( {
    url: 'data/data.js',
    dataType: 'jsonp',
    jsonpCallback: 'callback',
    cache: false,
    type: 'GET',
    success: function ( data ) {

      // Make data global
      App.data = data;

      // Create new user to track answers
      var UserModel = require( 'models/userModel' );
      App.user = new UserModel();

      // Start router
      App.router = new Router();
      Backbone.history.start();

    }
  } );

} );