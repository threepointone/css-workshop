var twain = require('twain');

// assume jquery lives globally


function wait(time, callback) {
    setTimeout(callback, time);
};

module.exports = [{
    trigger: 0,
    fn: function(done) {
        setTimeout(function() {
            $('.fb-1 .arrow').css({
                opacity: 0
            }).show().animate({
                opacity: 1
            }, 300, function() {
                $('.fb-1 .needs-logo').css({
                    opacity: 0
                }).show().animate({
                    opacity: 1
                }, 300, function() {
                    wait(1000, function() {
                        $('.hero .hasgeek-logo').addClass('needed-logo');
                        $('.hero .txt').animate({
                            'margin-left': -108
                        }, 400, function() {
                            wait(500, function() {
                                $('.fb-2 .arrow').css({
                                    opacity: 0
                                }).show().animate({
                                    opacity: 1
                                }, 300, function() {
                                    $('.fb-2 .not-enough-pop').css({
                                        opacity: 0
                                    }).show().animate({
                                        opacity: 1
                                    }, 300, function() {
                                        wait(300, function() {
                                            $('.hero .title').addClass('pop');
                                            done && done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }, 1000);



    },

}, {
    trigger: 340,
    fn: function(done) {
        var pic = $('.speaker-pic img');
        var comments = $('.fb-3 .comment');
        wait(5000, function() {
            $(comments[0]).css({
                opacity: 0
            }).show().animate({
                opacity: 1
            }, 300, function() { // too pretentious
                wait(400, function() {
                    pic.css({
                        'border-radius': 0,
                        'border-width': 0
                    });
                });

                wait(1000, function() {
                    $(comments[1]).css({
                        opacity: 0
                    }).show().animate({
                        opacity: 1
                    }, 300, function() { // web 20
                        wait(400, function() {
                            pic.addClass('avatar-3d');
                        });

                        wait(1000, function() {
                            $(comments[2]).css({
                                opacity: 0
                            }).show().animate({
                                opacity: 1
                            }, 300, function() { // rounder
                                wait(400, function() {
                                    pic.removeClass('avatar-3d');
                                    pic.css({
                                        'border-radius': 5,
                                        'border-width': 0
                                    });
                                });


                                wait(1000, function() {
                                    $(comments[3]).css({
                                        opacity: 0
                                    }).show().animate({
                                        opacity: 1
                                    }, 300, function() { // ROUNDER
                                        wait(200, function() {
                                            pic.css({
                                                'border-radius': 90,
                                                'border-width': 5
                                            });
                                        });

                                        wait(800, function() {
                                            $(comments[4]).css({
                                                opacity: 0
                                            }).show().animate({
                                                opacity: 1
                                            }, 300, done); // dammit britta
                                        });
                                    });
                                });

                            });

                        });
                    });
                });
            });
        });

    }
}, {
    trigger: 700,
    fn: function(done) {
        // performance graph
        var graph = $('.performance .bar-graph');
        var colors = ['#2db548', '#c62db6', '#d6ad42', '#1b98d6', '#d6133d'];
        
        for(var i = 0; i < 5; i++) {
            var el = $('<div class="bar"/>');
            el.css({
                width: Math.random() * 100,
                top: i * 10
            });
            el.get(0).style.backgroundColor = colors[i];
            graph.append(el);
        }

        $('.bar-graph .bar').each(function(i, el){
            var tween = twain();
            tween.on('step', function(step){
                el.style.width = step.value + 'px';
            });
            setInterval(function(){
                tween.to({
                    width: Math.random()*100
                });
            }, 300 + Math.random()*500)
        });
        

    }

}];