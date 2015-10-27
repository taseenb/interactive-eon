define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var tpl = require( 'text!tpl/question.html' );

  // Svg
  var svgLetterA = require( 'text!letter-a' );
  var svgLetterB = require( 'text!letter-b' );
  var svgLetterC = require( 'text!letter-c' );
  var counterSvg = require( 'text!counterSvg' );


  var View = Backbone.View.extend( {

    template: _.template( tpl ),

    initialize: function ( options ) {

      this.idx = options.idx;
      this.$parent = $( options.parent );
      this.animationCode = options.animationCode;

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

    },

    render: function () {

      var ie9 = !App.supportTransitions;
      var imageFile = App.data.questions[this.idx].animationName + '.svg';

      if ( ie9 ) {
        imageFile = 'png/' + App.data.questions[this.idx].animationName + '.png';
      }

      this.html = this.template( {
        ie9: ie9,
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
        counterSvg: counterSvg,
        imgSrc: 'img/animations/' + imageFile

      } );

      this.$parent.append( this.html );

      this.setElement( this.$parent.find( '#question-' + this.idx ) );

      this.setupElements();
      this.setupEvents();

      this.onResize();

    },

    setupElements: function () {

      this.$inner = this.$( '.inner' );
      this.$answers = this.$( '.answer' );

    },

    setupEvents: function () {

      //var click = App.isTouch ? 'touchstart' : 'click';
      this.$answers.on( 'click', this.selectAnswer.bind( this ) );

    },

    selectAnswer: function ( e ) {

      if ( !this.done ) {

        this.done = true;

        // Update DOM element
        var $answer = $( e.currentTarget );
        $answer.addClass( 'selected' );

        // Get values
        var value = $answer.data( 'value' );
        var idx = $answer.data( 'idx' );

        //console.log( 'user value: ', value );

        // Record user state
        App.user.answers[this.idx].chosenAnswer = idx;
        App.user.answers[this.idx].value = value;

        App.router.next();

      }

    },

    reset: function () {

      this.done = false;
      this.$answers.removeClass( 'selected' );
      App.user.answers[this.idx].chosenAnswer = null;
      App.user.answers[this.idx].value = null;

    },

    show: function () {
      this.$el.show();
    },

    onResize: function ( e ) {

      var height = this.$el.outerHeight( true );
      iframeMessenger.resize( height );

      console.log('question height', height);


      // console.log(e.width, e.height);

      //console.log( 'question resize' );

      //if ( App.width < 980 ) {
      //
      //  if ( this.$el.outerHeight( true ) <= App.height ) {
      //    this.el.style.height = App.height + 'px';
      //    this.$inner.addClass( 'abs-vertical-center' );
      //  } else {
      //    this.el.style.height = '';
      //    this.$inner.removeClass( 'abs-vertical-center' );
      //  }
      //
      //} else {
      //
      //  this.el.style.height = '';
      //  this.$inner.removeClass( 'abs-vertical-center' );
      //
      //}

    }

  } );

  return View;

} );