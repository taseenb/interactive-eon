define( function ( require ) {

  'use strict';

  var Backbone = require( 'backbone' );

  // Views
  var MainView = require( 'views/mainView' );

  return Backbone.Router.extend( {

    routes: {

      '': 'question',
      //':idx': 'question'

    },

    initialize: function () {

      console.log( App.data );
      //console.log( App.width, App.height );

      this.questionsCount = App.data.questions.length;

      this.mainView = new MainView( {el: '#main'} );
      this.mainView.render();

      this.currentQuestion = 0;

    },

    question: function () {

      //var idx = this.validate( idx );

      console.log( 'question idx: ' + this.currentQuestion );

      if ( this.currentQuestion >= this.questionsCount ) {

        this.mainView.showSummary();

      } else {

        this.mainView.openQuestion( this.currentQuestion );

      }

    },

    //question: function ( idx ) {
    //
    //  idx = this.validate( idx );
    //
    //  console.log( 'question idx: ' + idx );
    //
    //  if (idx >= this.questionsCount) {
    //
    //    this.mainView.showSummary();
    //
    //  } else {
    //
    //    this.mainView.openQuestion( idx );
    //
    //  }
    //
    //},

    next: function () {

      this.currentQuestion += 1;

      this.question();

    },

    restart: function () {

      this.mainView.resetAll();

      this.currentQuestion = 0;

      this.question();

    },

    validate: function ( idx ) {

      var validIdx = parseInt( idx );

      if ( _.isNaN( validIdx ) || validIdx <= -1 ) {
        validIdx = 0;
      }

      return validIdx;

    }

  } );

} );