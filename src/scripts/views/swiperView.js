define( function ( require ) {

  'use strict';

  var _ = require( 'underscore' );
  var swiperTpl = require( 'text!tpl/swiper.html' );

  var View = function ( el ) {

    this.$el = $( el );
    this.el = this.$el[0];

    // Support transitions (to detect IE9)
    this.transitionDuration = App.supportTransitions ? 300 : 0;

    this.initialize();

  };

  View.prototype = {

    initialize: function () {

      App.mediator.subscribe( 'resize', this.onResize.bind( this ) );

    },

    render: function () {

      // Render html
      var html = _.template( swiperTpl )( {
        lazyLoading: App.supportTransitions,
        copy: App.data.copy,
        items: App.data.items,
        optimizedFolder: App.isPhone ? 'opt/' : '' // load optimized gifs if this is a phone
      } );
      this.$el.html( html );


      // Get the right number of slides (the loop version adds 2 slides)
      App.slidesCount = this.$el.find( '.swiper-slide' ).length;


      this.setupElements();
      this.setupEvents();

    },

    goto: function ( id, speed ) {

      //console.log( 'showin item ' + id );

      if ( !this.swiper ) {

        this.renderSwiper( id );

      } else {

        $( 'body' ).scrollTop( 0 );
        var duration = speed || 0;
        this.swiper.slideTo( id, duration );

      }

    },

    renderSwiper: function ( id ) {

      //console.log( id - 1 );

      // Start the swiper
      this.swiper = new Swiper( this.$el.find( '.swiper-container' )[0], {
        // Optional parameters
        spaceBetween: 50,
        loop: App.swiperLoop,
        onlyExternal: App.supportTransitions ? false : true, // disable swipe on IE9
        initialSlide: App.swiperLoop ? id - 1 : id,

        // Disable preloading of all images
        preloadImages: App.supportTransitions ? false : true, // preload all on IE9
        // Enable lazy loading
        lazyLoading: App.supportTransitions ? true : false, // lazy load on all browsers but IE9

        // Navigation arrows
        nextButton: App.supportTransitions ? '.swiper-button-next' : undefined,
        prevButton: App.supportTransitions ? '.swiper-button-prev' : undefined,

        onSlideChangeEnd: App.supportTransitions ? function ( swiper ) {
          App.currentItem = swiper.activeIndex;
          //console.log( App.currentItem );
        } : undefined
      } );

      // set sizes
      setTimeout( function () {
        this.onResize();
        App.mainView.onResize();
      }.bind( this ), 0 );

    },

    setupElements: function () {

      this.$slides = this.$el.find( '.swiper-slide' );

      this.$mobileNav = this.$el.find( '.mobile-nav' );
      this.$prevNextArrows = this.$mobileNav.find( '.arrow' );

      this.$slideH1 = this.$slides.find( 'h1' ).first();
      this.$detailsWrapper = this.$slides.find( '.details-wrapper' );

      this.$anim = this.$detailsWrapper.find( '.anim' );

      this.$animImage = this.$detailsWrapper.find( '.anim-img' ).first();

    },

    setupEvents: function () {

      var event = App.isTouch ? 'touchstart' : 'click';
      this.$el.on( event, '.back-to-list', this.backToList.bind( this ) );

      // Update image size on load
      //this.$animImage.on( 'load', function ( e ) {
      //
      //  this.imagesLoaded = true;
      //
      //  //this.goto( this.requestedId, 0 );
      //
      //  this.onResize();
      //
      //  App.mainView.onResize();
      //
      //  //console.log( e );
      //
      //}.bind( this ) );


      // Arrows PREV / NEXT
      if ( !App.supportTransitions ) {

        this.$el.on( event, '.swiper-button-prev', function ( e ) {

          //console.log( e.target.className );
          //console.log( App.currentItem + ' / ' + App.slidesCount );

          var prevId = App.currentItem - 1;
          if ( prevId < (App.swiperLoop ? 1 : 0) ) {
            prevId = App.swiperLoop ? App.slidesCount : App.slidesCount - 1;
          }

          this.goto( prevId, this.transitionDuration );

          App.currentItem = prevId;

        }.bind( this ) );

        this.$el.on( event, '.swiper-button-next', function ( e ) {

          //console.log( e.target.className );
          //console.log( App.currentItem + ' / ' + App.slidesCount );

          var nextId = App.currentItem + 1 >= App.slidesCount ? 0 : App.currentItem + 1;
          if ( nextId === 0 && App.swiperLoop ) {
            nextId = 1;
          }

          this.goto( nextId, this.transitionDuration );

          App.currentItem = nextId;

        }.bind( this ) );

      }

    },

    backToList: function ( e ) {

      e.preventDefault();
      App.mainView.show( 'list' );

    },

    onShow: function () {

    },

    onHide: function () {

    },

    onResize: function ( e ) {

      //console.log( e.width, e.height );


      // Set image wrapper min height (to place the preloader)
      var animRatio = 558 / 634;
      var animWidth = this.$anim.width();
      var animHeight = ~~(animWidth * animRatio);
      this.$anim.css( 'min-height', animHeight + 'px' );


      //var animHeight = this.$animImage.outerHeight( true );
      var titleHeight = this.$slideH1.outerHeight( true );

      if ( animHeight > 0 ) {
        this.$prevNextArrows.removeClass( 'hidden' );
      }

      this.$mobileNav.css( 'top', titleHeight + ~~(animHeight / 2) + 'px' );

      // Update the swiper
      this.swiper.onResize();
      //this.swiper.resizeFix();

    }

  };

  return View;

} );