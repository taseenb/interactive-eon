define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var tpl = require( 'text!tpl/summary.html' );


  var View = Backbone.View.extend( {

    template: _.template( tpl ),

    initialize: function ( options ) {

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

    },

    render: function ( ) {

      this.html = this.template( {
        data: App.data,
        results: {
          items: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      } );

      this.$el.append( this.html );

      this.setupElements();
      this.setupEvents();

    },

    setupElements: function () {

      this.$restart = this.$('.restart');

    },

    setupEvents: function () {

      var click = App.isTouch ? 'touchstart' : 'click';
      this.$restart.on( click, this.restart.bind( this ) );

    },

    restart: function(e) {

      e.preventDefault();
      App.router.restart();

    },

    onResize: function ( e ) {

      // console.log(e.width, e.height);

    }

  } );

  return View;

} );