define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var tpl = require( 'text!tpl/question.html' );

  // Svg
  var svgLetterA = require( 'text!letter-a' );
  var svgLetterB = require( 'text!letter-b' );
  var svgLetterC = require( 'text!letter-c' );


  var View = Backbone.View.extend( {

    template: _.template( tpl ),

    initialize: function ( options ) {

      this.$parent = $( options.parent );
      this.animationCode = options.animationCode;

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

    },

    render: function ( idx ) {

      this.idx = idx;

      var svg = App.data.questions[idx].animationName + '.svg';

      this.html = this.template( {
        idx: this.idx,
        question: App.data.questions[parseInt( this.idx )],
        animationCode: this.animationCode,
        questionsCount: App.data.questions.length,
        alphabet: [svgLetterA, svgLetterB, svgLetterC],
        questionColor: [
          '#e89cc1',
          '#f9a36a',
          '#f6f06b'
        ],
        imgSrc: 'img/animations/' + svg

      } );

      this.$parent.append( this.html );

      this.setElement( this.$parent.find( '#question-' + idx ) );

      this.setupElements();
      this.setupEvents();

    },

    setupElements: function () {

      this.$answers = this.$( '.answer' );

      this.$inner = this.$( '#question-inner-' + this.idx );

    },

    setupEvents: function () {

      var click = App.isTouch ? 'touchstart' : 'click';
      this.$answers.on( click, this.selectAnswer.bind( this ) );

    },

    selectAnswer: function ( e ) {

      console.log( e );

      if ( !this.done ) {

        this.done = true;

        // Update DOM element
        var $answer = $( e.currentTarget );
        $answer.addClass( 'selected' );

        // Get values
        var value = $answer.data( 'value' );
        var idx = $answer.data( 'idx' );

        // Record user state
        App.user.questions[this.idx].chosenAnswer = idx;
        App.user.questions[this.idx].value = value;

        App.router.next();

      }

    },

    reset: function () {

      this.done = false;
      this.$answers.removeClass( 'selected' );
      App.user.questions[this.idx].chosenAnswer = null;
      App.user.questions[this.idx].value = null;

    },

    show: function () {
      this.$el.show();
    },

    onResize: function ( e ) {

      // console.log(e.width, e.height);

    }

  } );

  return View;

} );