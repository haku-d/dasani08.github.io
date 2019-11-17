var App = function(fb) {
    this._fb = fb;
    this._isLogin = false;
    this.data = {};
}

App.prototype.isLogin = function() {
    return this._isLogin;
}

App.prototype.init = function() {
    var d = $.Deferred();
    this._fb.getLoginStatus(function(response){
        if(response.status === 'connected') {
            this._isLogin = true;
        }

        d.resolve();
    });
    return d;
}

App.prototype.doLogin = function(cb) {
    this._fb.login(cb, {scope: 'public_profile,user_friends,user_photos'});
}

App.prototype.loginCallback = function(response) {
    if(response.status === 'connected') {
        window.location.href = "index-loading.html";
    }
}

App.prototype.getUserProfile = function() {
    var dd = jQuery.Deferred();
    var _this = this;

    this._fb.api('/me?fields=name,cover,picture', function(rs){
        _this.data.profile = {
            id: rs.id,
            name: rs.name,
            cover: rs.cover.source,
            picture: rs.picture.data.url
        };

        console.log(rs);

        _this._fb.api('/'+rs.cover.id+'?fields=images', function(rs){
            _this.data.profile.cover = rs.images[0].source;
            dd.resolve();
        });

        // dd.resolve();
    });

    return dd;
}

App.prototype.getUserPhotos = function() {
    var dd = jQuery.Deferred();
    var _this = this;

    // Get list photo node
    /*
    this._fb.api('/me/photos?type=uploaded', function(rs){

        var nodes = rs.data.slice(0,9);
        var dds = [];

        var getPhoto = function(n) {
            var d = jQuery.Deferred();
            _this._fb.api('/'+n.id+'?fields=images', function(rs){
                d.resolve(rs.images.pop());
            });
            return d;
        }

        $.each(nodes, function(node){
            dds.push(getPhoto(this));
        });
        
        $.when.apply(this, dds).done(function(){
            _this.data.photos = arguments;
            dd.resolve();
        });
    });
    */
   
   _this.data.photos = [
        {
            source: "img/photos/1.jpg"
        },
        {
            source: "img/photos/2.jpg"
        },
        {
            source: "img/photos/3.jpg"
        },
        {
            source: "img/photos/4.jpg"
        },
        {
            source: "img/photos/ab1.jpg"
        },
        {
            source: "img/photos/ab2.jpg"
        },
        {
            source: "img/photos/ab3.jpg"
        },
        {
            source: "img/photos/ab4.jpg"
        },
        {
            source: "img/photos/ab5.jpg"
        }
   ];

   dd.resolve();

    return dd;
}

App.prototype.getUserFriends = function() {

}

App.prototype.getRandomOrder = function(min, max, number) {
    var count = 0;
    var rands = [];

    if (number === 1) return getRandomInt(min, max);

    do {

        var i = getRandomInt(min, max);

        if($.inArray(i, rands) === -1) {
            rands.push(i);
            count++;
        }

    } while(count < number);

    return rands;
}

App.prototype.getProfileData = function() {
    var dd = jQuery.Deferred(),
        _this = this;

    $.getJSON('post.json', function(rs){
        _this.data.model = _this._getRandomModel(rs.profiles);
        // first post & sencond is get from random list
        var randomPost = _this._getRandomPost(rs.posts.random, 2);
        var travelPost = _this._getRandomPost(rs.posts.travel, 1);
        var beautyPost = _this._getRandomPost(rs.posts.beauty, 1);
        var tfsPost = _this._getRandomPost(rs.posts.tfs, 1);

        _this.data.posts = randomPost.concat(travelPost).concat(beautyPost).concat(tfsPost);

        var timeAgo = [
            "3 days ago",
            "6 months ago",
            "February, 2018",
            "December, 2017",
            "February, 2017"
        ];

        $.each(_this.data.posts, function(key){
            this.timeAgo = timeAgo[key];
        });

        dd.resolve();
    });

    return dd;
}

App.prototype.renderTimeline = function() {
    console.log('Render timelime');
    console.log(arguments);
    var _this = this;

    $.when(
        this.getUserProfile(),
        this.getUserPhotos(),
        this.getProfileData()
    ).done(function(){
        $('link[href="css/style.css"]').attr('href','css/profile.css?t=' + Date.now());

        if(isMobile) {
            // $('meta[name="viewport"]').remove();
            $('link[href="css/mobile.css"]').remove();
        }

        $('body').render('timeline', _this.data);
    });
}

App.prototype._getRandomModel = function(models) {
    var rand = this.getRandomOrder(0, models.length - 1, 1);

    return models[rand];
}

App.prototype._getRandomPost = function(posts, number) {
    var rands = this.getRandomOrder(0, posts.length - 1, number);
    var _posts = [];

    if(typeof rands == 'number') {
        rands = [rands];
    }

    for(var i = 0; i < rands.length; i++) {
        _posts.push(posts[rands[i]]);
    }

    return _posts;
}