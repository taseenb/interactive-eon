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

    },

    setupEvents: function () {

      //this.$el.on( 'click', '.open-item', this.openItem.bind( this ) );

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