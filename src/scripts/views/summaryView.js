define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Swiper = require( 'swiper' );
  var Chartist = require( 'chartist' );
  require( 'chartist.plugins.tooltips' );

  var tpl = require( 'text!tpl/summary.html' );


  var View = Backbone.View.extend( {

    template: _.template( tpl ),

    initialize: function () {

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

    },

    render: function () {

      this.html = this.template( {
        data: App.data,
        questions: App.data.questions,
        copy: App.data.copy,
        userAnswers: App.user.answers,
        userValues: App.user.values
      } );

      this.$el.append( this.html );

      //if ( !App.isPhone ) {
        this.renderGraph();
      //}

      this.renderSwiper();

      this.setupElements();
      this.setupEvents();

    },

    renderGraph: function () {

      var labels = _.map( App.data.questions, function ( question ) {
        return question.title;
      } );

      var values = _.map( App.user.answers, function ( answer ) {
        return answer.value;
      } );

      //console.log( labels, values );

      var chartistData = {
        labels: labels,
        series: [values]
      };

      var chartistOptions = {
        fullWidth: true,

        width: '100%',
        height: '100%',

        high: 6,
        low: 0,

        axisX: {
          showLabel: false,
          showGrid: false,
          offset: 0,
          position: 'start'
        },

        axisY: {
          offset: 0,
          showLabel: false,
          showGrid: false,
          position: 'start'
        },

        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };

      new Chartist.Line( this.$( '#graph' )[0], chartistData, chartistOptions );

    },

    renderSwiper: function () {

      this.swiper = new Swiper( '.swiper-container', {

        spaceBetween: 50,
        roundLengths: true,
        effect: App.isTouch ? 'slide' : 'fade',
        simulateTouch: false,
        shortSwipes: App.isTouch,
        longSwipes: App.isTouch,
        fade: {
          crossFade: true
        },
        nextButton: '.text-box .next', //.swiper-button-next',
        prevButton: '.text-box .prev'//'.swiper-button-prev'

      } );

    },

    setupElements: function () {

      this.$restart = this.$( '.restart' );

    },

    setupEvents: function () {

      var click = App.isTouch ? 'touchstart' : 'click';
      this.$restart.on( click, this.restart.bind( this ) );

    },

    restart: function ( e ) {

      e.preventDefault();
      App.router.restart();

    },

    onResize: function ( e ) {

      // console.log(e.width, e.height);

    }

  } );

  return View;

} );