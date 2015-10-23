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

      this.$content = this.$el.find( '#content' );
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

      this.questionsViews[idx] = new QuestionView( {parent: '#questions', idx: idx} );
      this.questionsViews[idx].render();

      setTimeout( this.showQuestion.bind( this, idx ), 250 );

    },

    showQuestion: function ( idx ) {

      // Hide summary if necessary
      if ( this.summaryView ) {
        this.hide( this.summaryView );
        this.show( this.$questions );
      }

      // Hide all question views
      _.each( this.questionsViews, function ( view, i ) {

        if ( parseInt( i ) !== parseInt( idx ) ) {
          this.hide( view );
        } else {
          this.show( view );
        }

      }.bind( this ) );

      // Scroll
      this.scrollToTop();
      this.scrollToIframeTop();

    },

    renderSummary: function () {

      if ( !$( '#summary' ).length ) {
        this.$content.append( '<div id="summary" class="content-element hidden" />' );
      }

      this.summaryView = new SummaryView( {el: '#summary'} );
      this.summaryView.render();

    },

    showSummary: function () {

      // Calculate all values, based on user answers
      App.user.calculateResults();

      // Destroy the old summary
      if ( this.summaryView ) {
        this.summaryView.remove();
      }

      // Render a new summary
      this.renderSummary();

      // Show it
      this.hide( this.$questions );
      this.show( this.summaryView );

      // Scroll
      this.scrollToTop();
      this.scrollToIframeTop();

      //console.log( App.user.answers );

    },

    setupEvents: function () {

      //var event = App.isTouch ? 'touchstart' : 'click';
      // this.$el.on( event, this.onClick.bind( this ) );

    },

    show: function ( view ) {

      this.onResize();

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

    scrollToTop: function () {

      window.scrollTo( 0, 0 );

    },

    scrollToIframeTop: function () {

      iframeMessenger.scrollTo( 0, 0 );

      iframeMessenger.getPositionInformation( function ( obj ) {

        var y = Math.abs( obj.iframeTop );
        iframeMessenger.scrollTo( 0, y );

      } );

    },

    resetAll: function () {

      // Reset user state, question state, DOM state
      _.each( this.questionsViews, function ( view, i ) {

        view.reset();

      } );

    },

    onResize: function () {

      // Update iframe height
      var iframeHeight = Math.max( 768, this.$el.outerHeight( true ) );
      iframeMessenger.resize( iframeHeight );

      console.log( iframeHeight );


      // Fix questions height (use the highest question div for all questions)
      var $questions = this.$questions.find( '.question' );
      if ( $questions.length ) {
        var highestQuestion = _.max( $questions, function ( question ) {
          return $( question ).height();
        } );

        var height = $( highestQuestion ).height() + 'px';
        $questions.height( height );
        $( '#summary' ).height( height );
      }

    }

  } );


  return View;

} );