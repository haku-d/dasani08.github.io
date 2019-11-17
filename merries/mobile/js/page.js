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
        top: 300,
        width: 640,
        height: 1136
    });

    $('.card').bind('click', function(){
        var url = $(this).data('href');
        window.location.href = url;
    });
});