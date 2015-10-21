define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );


  var View = Backbone.View.extend( {

    initialize: function () {

      this.questions = this.resetUserData();

      //console.log( this.data );

    },


    // Create user data
    resetUserData: function () {

      var questions = App.data.questions;

      var data = [];

      questions.forEach( function ( el, i ) {

        var userData = {
          idx: i,
          chosenAnswer: null,
          value: null
        };

        data[i] = userData;

      } );

      return data;

    }

  } );


  return View;

} );
