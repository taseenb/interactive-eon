define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Swiper = require( 'swiper' );

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

      this.renderSwiper();

      this.setupElements();
      this.setupEvents();

    },

    renderSwiper: function () {

      this.swiper = new Swiper( '.swiper-container', {

        spaceBetween: 50,

        effect: App.isTouch ? 'slide' : 'fade',

        fade: {
          crossFade: true
        },

        // Navigation arrows
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