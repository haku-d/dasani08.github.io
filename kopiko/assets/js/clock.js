(function ( $ ) {
 
    var Clock = function($container) {
        this.$container = $container;
        this.hands = {
            hours: this.$container.find('.hours'),
            minutes: this.$container.find('.minutes'),
            seconds: this.$container.find('.seconds')
        }; 
    }

    Clock.prototype.initClockDate = function(date) {
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();

        var hourAngle = (hours * 30) + (minutes / 2),
            minuteAngle = (minutes * 6),
            secondAngle = (seconds * 6);

        this.hands.hours[0].style.webkitTransform = 'rotateZ('+ hourAngle +'deg)';
        this.hands.hours[0].style.transform = 'rotateZ('+ hourAngle +'deg)';
        
        this.hands.minutes[0].style.webkitTransform = 'rotateZ('+ minuteAngle +'deg)';
        this.hands.minutes[0].style.transform = 'rotateZ('+ minuteAngle +'deg)';
        this.hands.minutes[0].parentNode.setAttribute('data-second-angle', secondAngle);

        this.hands.seconds[0].style.webkitTransform = 'rotateZ('+ secondAngle +'deg)';
        this.hands.seconds[0].style.transform = 'rotateZ('+ secondAngle +'deg)';
    }

    Clock.prototype.setUpMinuteHands = function() {
        // find out how far into he minute we are
        var minuteContainer = this.hands.minutes[0].parentNode;
        var secondAngle = minuteContainer.getAttribute("data-second-angle");

        if(secondAngle > 0) {
            // Set a timeout until the end of the current time 
            var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;

            setTimeout((function(){
                this.moveMinuteHands();
            }).bind(this), delay);
        }
    }

    Clock.prototype.moveMinuteHands = function() {
        var minuteContainer = this.hands.minutes[0].parentNode;
        minuteContainer.style.webkitTransform = 'rotateZ(6deg)';
        minuteContainer.style.transform = 'rotateZ(6deg)';

        // Then continue with a 60 second interval
        setInterval((function() {

            if(minuteContainer.angle === undefined) {
                minuteContainer.angle = 12;
            } else {
                minuteContainer.angle += 6;
            }

            minuteContainer.style.webkitTransform = 'rotateZ('+ minuteContainer.angle +'deg)';
            minuteContainer.style.transform = 'rotateZ('+ minuteContainer.angle +'deg)';

        }).bind(this), 60000);
    }
    
    Clock.prototype.moveSecondHands = function() {
        var secondContainer = this.hands.seconds[0].parentNode;
        
        setInterval(function(){
            if(secondContainer.angle === undefined) {
                secondContainer.angle = 6;
            } else {
                secondContainer.angle += 6;
            }
            
            secondContainer.style.webkitTransform = 'rotateZ('+ secondContainer.angle +'deg)';
            secondContainer.style.transform = 'rotateZ('+ secondContainer.angle +'deg)';
        }, 1000);
    }

    $.fn.clock = function(options) {
        
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            date: new Date
        }, options );

        if(this.data('js-clock-plugin')) {
            return this.data('js-clock-plugin');
        }

        var clock = new Clock(this);
            clock.initClockDate(settings.date);
            clock.setUpMinuteHands();
            clock.moveSecondHands();

        this.data('js-clock-plugin', clock);

        return clock;
    };
 
}( jQuery ));

(function($) {

    /**
     * Flip timer countdown for flip text
     */
    var FlipTimer = function() {
        return {
            update: function(el) {
                var $el = $(el);

                var val = el.data("val").toString().split("");

                if(val.length == 1) {
                    val.unshift(0);
                }

                // $el.find('.n1').text(val[0]);
                // $el.find('.n2').text(val[1]);
                var n1 = val[0],
                    n2 = val[1];

                this._updateN2($el, n2);
                this._updateN1($el, n1);
            },
            _updateN2: function($el, val) {
                if(val === $el.find('.nn2').data('val')) {
                    return false;
                }

                $el.find('._n2').text(val);
                $el.find('.nn2').addClass('transit');
                setTimeout(function(){
                    $el.find('.n2').text(val); 
                    $el.find('.nn2').data('val', val).removeClass('transit');
                },400);
            },
            _updateN1: function($el, val) {
                if(val === $el.find('.nn1').data('val')) {
                    return false;
                }

                $el.find('._n1').text(val);
                $el.find('.nn1').addClass('transit');
                setTimeout(function(){
                    $el.find('.n1').text(val);
                    $el.find('.nn1').data('val', val).removeClass('transit');
                },400);
            }
        }
    }

    /**
     * Proxy class
     * @param {[type]} type [description]
     */
    var Clockito = function(type) {
        var timer;

        switch(type) {
            case 'flip':
                timer = new FlipTimer();
                break;
        }

        this.timer = timer;
    }

    Clockito.prototype.update = function(el) {
        this.timer.update(el);
    }

    // Create the defaults once
    var pluginName = "clockitoCountdown",
        defaults = {
            daySelector: '.days',
            hourSelector: '.hours',
            minuteSelector: '.minutes',
            secondSelector: '.seconds',
            type: 'flip'
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {

        this.$element = $(element);

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        var type = this.$element.data('type') || this.settings.type;

        this._clockito = new Clockito(type);

        this.init();
        this.run();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function() {
            this._start = this.$element.data('start');
            this._end = this.$element.data('end');
            this._timer = this.getTimeRemaining();

            this.hourSelector = this.$element.find(this.settings.hourSelector);
            this.minuteSelector = this.$element.find(this.settings.minuteSelector);
            this.secondSelector = this.$element.find(this.settings.secondSelector);
        },

        run: function() {
            var self = this;

            if(this._end === undefined) {
                return false;
            }

            var interval = setInterval(function() {
                self._timer = self.getTimeRemaining();

                // Stop clockito
                if(self._timer.expired) {
                    return clearInterval(interval);
                }

                self.update();
            }, 1000);
        }, 

        update: function() {
            var timer = this._timer;

            this.hourSelector.data('val', timer.hours);
            this.minuteSelector.data('val', timer.minutes);
            this.secondSelector.data('val', timer.seconds);

            this._clockito.update(this.hourSelector);
            this._clockito.update(this.minuteSelector);
            this._clockito.update(this.secondSelector);
        },

        getTimeRemaining: function() {
            var start = Date.parse(this._start) / 1000;
            var end = Date.parse(this._end) / 1000;
            var now = Date.now() / 1000;

            var t = Math.floor((end - start) / 86400);
            var seconds = Math.floor((((end - now) % 86400) % 3600) % 60 );
            var minutes = Math.floor((((end - now) % 86400) % 3600) / 60);
            var hours = Math.floor(((end - now) % 86400) / 3600);
            var days = Math.floor((end - now) / 86400);
            var expired = end <= now ? true : false;

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds,
                'expired': expired
            };
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new Plugin( this, options ) );
            }
        } );
    };

})(jQuery);