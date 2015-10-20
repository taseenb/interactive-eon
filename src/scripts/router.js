define( function ( require ) {

  'use strict';

  var Backbone = require( 'backbone' );

  // Views
  var MainView = require( 'views/mainView' );

  return Backbone.Router.extend( {

    routes: {

      '': 'question',
      ':idx': 'question'

    },

    initialize: function () {

      console.log( App.data );
      //console.log( App.width, App.height );

      this.questionsCount = App.data.questions.length;

      this.mainView = new MainView( {el: '#main'} );
      this.mainView.render();

    },

    question: function ( idx ) {

      idx = this.validate( idx );

      console.log( 'question idx: ' + idx );

      this.mainView.openQuestion( idx );

    },

    validate: function ( idx ) {

      var validIdx = parseInt( idx );

      if ( _.isNaN( validIdx ) || validIdx >= this.questionsCount ) {
        validIdx = 0;
      }

      return validIdx;

    }

  } );

} );