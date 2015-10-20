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
        data: App.data
      } );

      this.$el.append( this.html );

      this.setupElements();
      this.setupEvents();

    },

    setupElements: function () {

    },

    setupEvents: function () {

      //this.$el.on( 'click', '.open-item', this.openItem.bind( this ) );

    },

    onResize: function ( e ) {

      // console.log(e.width, e.height);

    }

  } );

  return View;

} );