define( function ( require ) {

  'use strict';


  var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var contentTpl = require( 'text!tpl/content.html' );

  // Views
  var QuestionView = require( 'views/questionView.js' );
  var SummaryView = require( 'views/summaryView.js' );

  // Google Analytics
  //var ga = require( 'analytics' );


  var View = Backbone.View.extend( {

    template: _.template( contentTpl ),

    initialize: function () {

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

      this.questionsViews = {};

    },

    render: function () {

      var html = this.template( {
        copy: App.data.copy
      } );
      this.$el.html( html );

      this.setupElements();
      this.setupEvents();

      // Update iframeMessenger with new iframe height
      this.onResize();
    },

    setupElements: function () {

      this.$questions = this.$el.find( '#questions' );

      this.$summary = this.$el.find( '#summary' );

    },

    openQuestion: function ( idx ) {

      if ( !this.questionsViews[idx] ) {

        this.renderQuestion( idx );

      } else {

        this.showQuestion( idx );

      }

    },

    renderQuestion: function ( idx ) {

      this.questionsViews[idx] = new QuestionView( {parent: '#questions'} );
      this.questionsViews[idx].render( idx );

      setTimeout( this.showQuestion.bind( this, idx ), 250 );

      // Load animation
      //$.ajax( {
      //  url: imgSrc,
      //  dataType: 'text',
      //  success: function ( code ) {
      //
      //    this.questionsViews[idx] = new QuestionView( {parent: '#questions', animationCode: code} );
      //    this.questionsViews[idx].render( idx );
      //
      //    setTimeout( this.showQuestion.bind( this, idx ), 250 );
      //
      //  }.bind( this ),
      //
      //  error: function ( a, b, c ) {
      //    console.log( a, b, c );
      //  }
      //} );

    },

    showQuestion: function ( idx ) {

      _.each( this.questionsViews, function ( view, i ) {
        this.hide( view );
      }.bind( this ) );

      this.show( this.questionsViews[idx] );

    },

    renderSummary: function () {

      this.summaryView = new SummaryView( '#summary' );
      this.summaryView.render();

    },

    updateSummary: function () {

    },

    showSummary: function () {

      if ( !this.summaryView ) {
        this.renderSummary();
      }

      this.hide( this.$questions );
      this.show( this.summaryView );

    },

    setupEvents: function () {

      //var event = App.isTouch ? 'touchstart' : 'click';
      // this.$el.on( event, this.onClick.bind( this ) );

    },

    show: function ( view ) {

      if ( view instanceof Backbone.View ) {
        view.$el.removeClass( 'hidden' );
      } else if ( view instanceof jQuery ) {
        view.removeClass( 'hidden' );
      }

    },

    hide: function ( view ) {

      if ( view instanceof Backbone.View ) {
        view.$el.addClass( 'hidden' );
      } else if ( view instanceof jQuery ) {
        view.addClass( 'hidden' );
      }

    },

    onResize: function () {

      iframeMessenger.resize( this.$el.outerHeight( true ) );

    }

  } );


  return View;

} );