define( function ( require ) {

  'use strict';

  //var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Swiper = require( 'swiper' );
  var Chartist = require( 'chartist' );
  require( 'chartist.plugins.tooltips' );

  var tpl = require( 'text!tpl/summary.html' );

  var nodeSvg = require( 'text!nodeSvg' );


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

      //console.log( 'rendering graph' );

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

      // Add points images
      setTimeout( function () {
        this.addGraphIcons();
      }.bind( this ), 0 );

    },

    addGraphIcons: function () {

      var $svg = this.$( '#graph' ).find( 'svg' );
      var $points = $svg.find( '[class~=ct-point]' );
      var nodeData = [];
      var imgHtml = '';

      // Remove existing images
      $svg.find( '[class~=graph-img]' ).off().remove();

      // Get node data + add basic svg
      $points.each( function ( i, el ) {

        var $el = $( el );

        var side = 24;
        var x = parseFloat( $el.attr( 'x1' ) ) - side / 2;
        var y = parseFloat( $el.attr( 'y1' ) ) - side / 2;

        var quality = App.data.questions[i].answers[App.user.answers[i].chosenAnswer].eval;

        nodeData.push( {
          x: x,
          y: y,
          side: side,
          quality: quality,
          style: Modernizr.prefixed( 'transform' ) + ': rotate(' + (~~(Math.random() * 20) - 10) + 'deg)'
        } );

        imgHtml += nodeSvg;

        $el.remove();

      }.bind( this ) );


      // Remove dots and add images
      $svg.find( '[class~=ct-series]' )[0].id = 'img-points';
      var imagesWrapper = document.getElementById( 'img-points' );
      $( imagesWrapper ).append( imgHtml );
      // Update svg with node data
      var $nodes = $svg.find( '[class~=node]' );


      // Add node attributes
      nodeData.forEach( function ( node, i ) {

        var $node = $nodes.eq( i );
        var done = '';

        // Set all done in IE9, otherwise only first node should be shown as 'done'
        if ( App.supportTransitions ) {
          done = i === 0 ? ' done  ' : '';
        } else {
          done = ' done ';
        }


        $node.attr( {
          'id': 'node-' + i,
          'x': node.x,
          'y': node.y,
          'width': node.side + 'px',
          'height': node.side + 'px',
          'class': 'node ' + node.quality + done
        } );

        // Add css style
        $node.find( '[class~=group-rotate]' ).attr( 'style', node.style );

      }.bind( this ) );

      // Set first node as 'current'
      setTimeout( function () {
        this.updateNodes();
      }.bind( this ), 250 );

      // Add event
      $nodes.on( 'click', function ( e ) {
        this.swiper.slideTo( $( e.currentTarget ).index() - 1 );
      }.bind( this ) );

    },

    renderSwiper: function () {

      this.swiper = new Swiper( '.swiper-container', {

        spaceBetween: 50,
        roundLengths: true,
        effect: App.supportTransitions ? (App.isTouch ? 'slide' : 'fade') : undefined,
        simulateTouch: false,
        shortSwipes: App.isTouch,
        longSwipes: App.isTouch,
        fade: {
          crossFade: true
        },
        nextButton: '.text-box .next',
        prevButton: '.text-box .prev',

        onSlideChangeEnd: App.supportTransitions ? this.updateNodes.bind( this ) : undefined

      } );

    },

    /**
     * Set as 'done' all the nodes before the active one (it will show a tick on the icon)
     * @param e
     */
    updateNodes: function ( e ) {

      var $svg = this.$( '#graph' ).find( 'svg' );
      var $nodes = $svg.find( '[class~=node]' );
      var index = e ? e.activeIndex : 0;

      $nodes.each( function ( i, node ) {

        var classNames = node.getAttribute( "class" );

        if ( i <= index && classNames.indexOf( 'done' ) < 0 ) {
          node.setAttribute( 'class', classNames + ' done ' );
        }

        // Remove 'current' class
        if ( classNames.indexOf( 'current' ) > -1 ) {
          var notCurrenClass = classNames.replace( 'current', '' );
          node.setAttribute( 'class', notCurrenClass );
        }

        // Add 'current' class to currently active node
        if ( i === index ) {
          classNames = node.getAttribute( "class" );
          node.setAttribute( 'class', classNames + ' current ' );
        }

      }.bind( this ) );

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

      this.addGraphIcons();

      // console.log(e.width, e.height);

    }

  } );

  return View;

} );