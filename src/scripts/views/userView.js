define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );


  var View = Backbone.View.extend( {

    initialize: function () {

      this.data = this.resetUserData( App.data.questions );

      console.log( this.data );

    },


    // Create user data
    resetUserData: function ( questions ) {

      var data = {
        questions: []
      };

      questions.forEach( function ( el, i ) {

        data.questions[i] = {};
        data.questions[i].idx = i;
        data.questions[i].chosenAnswer = null;

      } );

      return data;

    }

  } );


  return View;

} );
