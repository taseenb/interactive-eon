define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );


  var Model = Backbone.Model.extend( {

    initialize: function () {

      this.answers = this.resetValues();

      this.values = {};

    },


    // Create user data
    resetValues: function () {

      // Reset all user values
      this.values = {};

      // Collect user answers
      var userAnswers = [];

      App.data.questions.forEach( function ( el, i ) {

        var userData = {
          idx: i,
          chosenAnswer: null,
          value: null
        };

        userAnswers[i] = userData;

      } );

      return userAnswers;

    },

    getMaxPossibleTotal: function () {

      var total = 0;

      _.each( App.data.questions, function ( question ) {

        var max = _.max( question.answers, function ( answer ) {
          return answer.value;
        } );

        total += max.value;

      } );

      return total;

    },

    getMinPossibleTotal: function () {

      var total = 0;

      _.each( App.data.questions, function ( question ) {

        var min = _.min( question.answers, function ( answer ) {
          return answer.value;
        } );

        total += min.value;

      } );

      return total;

    },

    calculateTotals: function () {

      this.values.maxPossibleTotal = this.getMaxPossibleTotal();
      this.values.minPossibleTotal = this.getMinPossibleTotal();

    },

    getTotalValue: function () {

      this.calculateTotals();

      var userTotalValue = 0;

      App.user.answers.forEach( function ( answer, i ) {

        userTotalValue += answer.value;

      } );

      return userTotalValue;

    },

    getPercent: function () {

      var basedUserValue = this.values.total - this.values.minPossibleTotal;
      var basedMaxValue = this.values.maxPossibleTotal - this.values.minPossibleTotal;

      var percent = Math.round( (basedUserValue * 100) / basedMaxValue );

      return percent;

    },

    getValue: function () {

      var values = ["bad", "medium", "good"];
      var valueIdx = 0;
      var unit = 100 / 3;

      if ( this.values.percent > unit * 2 ) {
        valueIdx = 2;
      } else if ( this.values.percent > unit ) {
        valueIdx = 1;
      }

      return values[valueIdx];

    },

    /**
     * Calculate user values, based on answers.
     */
    calculateResults: function () {

      this.values.total = this.getTotalValue(); // number

      this.values.percent = this.getPercent(); // number

      this.values.title = this.getValue(); // string (bad, medium or good)

      //console.log( 'user value: ', this.values.title);
      //console.log( 'user total value: ', this.values.total );
      //console.log( 'user % value: ', this.values.percent  );
      //console.log( 'user minPossibleTotal: ', this.values.minPossibleTotal );
      //console.log( 'user maxPossibleTotal: ', this.values.maxPossibleTotal );

    }

  } );


  return Model;

} );
