define( function ( require ) {

  'use strict';


  var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var contentTpl = require( 'text!tpl/content.html' );

  // Views
  var QuestionView = require( 'views/questionView.js' );
  var SummaryView = require( 'views/summaryView.js' );


  var View = Backbone.View.extend( {

    template: _.template( contentTpl ),

    initialize: function () {

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

      this.questionsViews = [];

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
      this.questionsViews[idx].render( this.onResize.bind( this ) );

      setTimeout( this.showQuestion.bind( this, idx ), 250 );

    },

    showQuestion: function ( idx ) {

      this.$questions.show();

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
      if ( this.notFirstTime && (App.isTouch || idx === 0) ) {
        //this.scrollToTop();
        this.scrollToIframeTop();
      }

      this.notFirstTime = true;

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
      //this.scrollToTop();
      this.scrollToIframeTop();

      // Display:none for the questions
      setTimeout( function () {
        this.$questions.hide();
      }.bind( this ), 500 );

      //console.log( App.user.answers );

    },

    setupEvents: function () {

      //var event = App.isTouch ? 'touchstart' : 'click';
      // this.$el.on( event, this.onClick.bind( this ) );

    },

    show: function ( view ) {

      if ( view instanceof Backbone.View ) {
        view.$el.removeClass( 'hidden' );
        this.currentViewType = view.type;
        this.onResize();
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

        //console.log( 'iframe position: ', obj.iframeTop );
        //console.log( 'scroll position: ', window.parent.scrollY );

        var y = Math.abs( obj.iframeTop ) - 20;
        iframeMessenger.scrollTo( 0, y );

      } );

    },

    resetAll: function () {

      if ( this.summaryView ) {
        this.summaryView.remove();
      }

      // Reset user state, question state, DOM state
      _.each( this.questionsViews, function ( view, i ) {

        view.reset();

      } );

    },

    onResize: function () {

      //console.log( 'resize fired on ', new Date() );

      setTimeout( function () {

        var height = 0;

        if ( this.currentViewType === 'summary' && this.summaryView ) {

          if ( this.$( '#graph' ) ) {
            this.summaryView.renderGraphNodes();
          }

          if ( App.width < App.mainBreakpoint ) {
            height = this.summaryView.$el.outerHeight( true );
          } else {
            height = App.maxSummaryHeight;
          }

        } else if ( this.currentViewType === 'question' && this.questionsViews.length ) {

          var firstQuestion = this.questionsViews[0];

          //console.log( firstQuestion ); //

          if ( App.width < App.mainBreakpoint ) {
            height = firstQuestion.$el.outerHeight( true );
          } else {
            height = firstQuestion.$( '.options-wrapper' ).eq( 1 ).outerHeight( true ) + 80; //this.$el.outerHeight( true );
          }

        }


        // Update iframe height
        if ( height && this.currentViewType ) {
          //console.log( 'iframe height (' + this.currentViewType + ') ', height );
          iframeMessenger.resize( height );
        }

      }.bind( this ), 0 );

    }

  } );


  return View;

} );