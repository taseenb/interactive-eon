define( function ( require ) {

  var _ = require( 'underscore' );
  var $win = $( window );


  var Event = function () {
    //this.initialize();
  };

  Event.prototype = {

    initialize: function () {
      this.callback = _.debounce( this.onResize, 100 ).bind( this );

      window.addEventListener( 'resize', this.callback );

      this.onResize();
    },

    onResize: function () {

      App.width = $win.width();
      App.height = $win.height();

      App.mediator.publish( 'resize', {
        width: App.width,
        height: App.height
      } );

    }

  };

  return new Event();

} );