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

    },

    showQuestion: function ( idx ) {

      // Hide summary if necessary
      if ( this.summaryView ) {
        this.hide( this.summaryView );
        this.show( this.$questions );
      }

      // Hide all question views
      _.each( this.questionsViews, function ( view, i ) {

        console.log(i, idx);

        if ( parseInt(i) !== parseInt(idx) ) {
          this.hide( view );
        } else {
          this.show( view );
        }

      }.bind( this ) );

    },

    renderSummary: function () {

      this.summaryView = new SummaryView( {el: '#summary'} );
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

      //if ( App.transitionend ) {
      //  $(document).on( App.transitionend, '.content-element', function ( e ) {
      //
      //    //e.stopPropagation(); //
      //
      //    var el = e.originalEvent.target;
      //
      //    //console.log( e.currentTarget.id );
      //    //if ( el.id === 'question-inner-' + this.idx ) {
      //    //  console.log( e.originalEvent );
      //    //  console.log( e.originalEvent.target.id );
      //    //  console.log( e.originalEvent.propertyName );
      //
      //      var $el = $( el );
      //
      //      if ( $el.hasClass( 'hidden' ) ) {
      //        $el.addClass('absolute-hidden');
      //      }
      //
      //    //}
      //  }.bind( this ) );
      //}

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

    resetAll: function () {

      // Reset user state, question state, DOM state
      _.each( this.questionsViews, function ( view, i ) {

        view.reset();

      } );

    },

    onResize: function () {

      iframeMessenger.resize( this.$el.outerHeight( true ) );

    }

  } );


  return View;

} );