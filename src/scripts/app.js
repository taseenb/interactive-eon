define( function ( require ) {

  'use strict';

  var ieDebug = false; // disable all console.log in IE9 if false

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


  // Hack for mobile safari
  // See: https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
  if ( App.isTouch ) {
    document.addEventListener( "touchstart", function () {
    }, true );
  }

  // Disable console.log on IE 9
  if ( !App.supportTransitions && !ieDebug ) {
    window.console = {
      log: $.noop()
    };
  }

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