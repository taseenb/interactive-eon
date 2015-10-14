define( function ( require ) {

  'use strict';

  $( function () {


    // Create App global
    window.App = window.App || {};


    // Mediator - pub/sub
    var Mediator = require( 'mediator-js' );
    App.mediator = new Mediator();


    // Resize event (published by mediator on every window resize)
    var resizeEvent = require( 'resize' );
    resizeEvent.initialize();

    // Support
    App.supportTransitions = $( 'html' ).hasClass( 'csstransitions' );
    App.isTouch = $( 'html' ).hasClass( 'touch' );
    App.isPhone = App.isTouch && (App.width < 481 || App.height < 481);


    // Disable console.log on IE 9
    if ( !App.supportTransitions ) {
      window.console = {
        log: $.noop()
      };
    }


    // Import Swiper
    App.swiper = require( 'swiper' );


    // Get data and start main view
    $.ajax( {
      url: 'data/data.js',
      dataType: 'jsonp',
      jsonpCallback: 'callback',
      cache: false,
      type: 'GET',
      success: function ( data ) {
        App.data = data;

        console.log( data );
        //console.log( App.width, App.height );

        // Main view
        var MainView = require( 'views/mainView.js' );
        App.mainView = new MainView( '#main' );
        App.mainView.render();
      }
    } );


  } );


} );