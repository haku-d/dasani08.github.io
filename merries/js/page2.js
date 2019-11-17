function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

$.fn.doResize = function(options) {
    var bgSize = {
        width: options.width,
        height: options.height
    };

    var bgScaleRatio = bgSize.height/bgSize.width;

    var $window = $(window);
    var $el = $(this);

    function resize() {
        // get bg size
        var _bgSize = getBgSize();
        var scale = 1;

        if(_bgSize.height > _bgSize.width) {
            scale = _bgSize.width / bgSize.width;
        } else {
            scale = _bgSize.height / bgSize.height;
        }

        var _top   = options.top * scale;
        var _left  = options.left * scale;

        if($window.width() < _bgSize.width) {
            _left -= (_bgSize.width - $window.width()) / 2;
        }

        if($window.height() < _bgSize.height) {
            _top -= (_bgSize.height - $window.height()) / 2;
        }

        $el.css({
            'transform': 'scale('+ scale +')',
            '-webkit-transform': 'scale('+ scale +')',
            '-moz-transform': 'scale('+ scale +')',
            'top': _top,
            'left': _left
        });
    }

    function getBgSize() {
        var winHeight = $window.height(),
            winWidth = $window.width();

        var winScaleRatio = winHeight/winWidth;

        var height, width;

        if(winScaleRatio > bgScaleRatio) {
            height = winHeight;
            width  = (winHeight / bgScaleRatio);
        } else {
            width  = winWidth;
            height = (winWidth * bgScaleRatio);
        }

        return {
            width: width,
            height: height
        }
    }

    $window.resize(resize).trigger('resize');
};

$(document).ready(function(){
    $('.slider').doResize({
        top: 70,
        width: 1915,
        height: 768
    });

    var page = getQueryVariable('page');
        page = page ? page : 0;

    $('.slider-wrap').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        draggable: false,
        initialSlide: parseInt(page),
        variableWidth: true,
        prevArrow: '<a class="btn-slide btn-slick-prev" href="#"><img src="img/arrow_left.png"/></a>',
        nextArrow: '<a class="btn-slide btn-slick-next" href="#"><img src="img/arrow_right.png"/></a>'
    });

    $('.btn-play-video').bind('click', function(){
        var video = $(this).parents('.frame-holder').find('video');
            video = video[0];
        var _this = $(this);

        _this.hide();
        $(video).data('state', 'isRunning')
        video.play();

        $(video).on('ended', function(){
            _this.show();
        });

        $(video).on('click', function(){
            var state = $(this).data('state');
            if(state === 'isRunning') {
                $(this).data('state', 'stop')
                this.pause();
            } else {
                $(this).data('state', 'isRunning')
                this.play();
            }
        });
    });
});