

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("manuelstofer-each/index.js", function(exports, require, module){
"use strict";

var nativeForEach = [].forEach;

// Underscore's each function
module.exports = function (obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
    } else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (iterator.call(context, obj[key], key, obj) === {}) return;
            }
        }
    }
};

});
require.register("threepointone-times/index.js", function(exports, require, module){
var has = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var isArray = Array.isArray ||
function(obj) {
    return toString.call(obj) == '[object Array]';
};

module.exports = function(n, fn) {
    var args = arguments;
    // combination forloop / map. 
    // compatible with regular _.times
    // WARNING - fn is called with (index, value), not the other (regular) way around
    var times = isArray(n) ? n.length : n;
    var arr = isArray(n) ? n : [];
    var ret = [];

    // check if .invoke 
    if('string' === typeof fn){
        fn = (function(f){
            return function(i, el){
                return el[f].apply(el, Array.prototype.slice.call(args, 2));
            };
        }(fn));
    }
    // default iterator
    fn = fn || function(i, el){ return el; };

    for(var i = 0; i < times; i++) {
        ret.push(fn(i, arr[i]));
    }
    return ret;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-bind/index.js", function(exports, require, module){

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = [].slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});
require.register("threepointone-twain/index.js", function(exports, require, module){
//tween.js
var animloop = require('animloop'),
    emitter = require('emitter'),
    each = require('each'),
    bind = require('bind'),
    invoke = require('times');


// some helper functions
var isArray = Array.isArray ||
function(obj) {
    return toString.call(obj) == '[object Array]';
};

function extend(obj) {
    each(Array.prototype.slice.call(arguments, 1), function(source) {
        for(var prop in source) {
            obj[prop] = source[prop];
        }
    });
    return obj;
}

function isValue(v) {
    return v != null; // matches undefined and null
}

function map(o, f) {
    f = f ||
    function(i) {
        return i
    };

    var arr = [];
    each(o, function(v) {
        arr.push(f(v));
    });
    return arr;
}


// defaults
var defaults = {
    threshold: 0.2,
    // used for snapping, since the default algo doesn't
    multiplier: 0.15 / 16,
    // fraction to moveby per frame * fps
    acceleration: -2.5 / 1000,
    // rate of deceleration (used for inertia calculations)
    maxDisplacement: 500 // upper limit on inertial movement
};


// meat and potatoes

function Tween(obj) {
    if(!(this instanceof Tween)) return new Tween(obj);

    obj = obj || {};

    var t = this;

    each(defaults, function(val, key) {
        t[key] = isValue(obj[key]) ? obj[key] : val;
    });


    t.step = bind(t, t.step);

    //tracking vars
    this.running = false;
    this.velocity = 0;
}

emitter(Tween.prototype);


extend(Tween.prototype, {
    from: function(from) {
        this._from = this._curr = from;
    },
    to: function(to) {
        if(!this._from) {
            this.from(to);
        }
        this._to = to;
    },
    step: function() {
        var now = new Date().getTime();
        var period = now - this.time;
        var fraction = Math.min(this.multiplier * period, 1);
        var delta = fraction * (this._to - this._curr);
        var value = this._curr + delta;

        if(Math.abs(this._to - value) < this.threshold) {
            delta = this._to - this._curr;
            this._curr = value = this._to;
            fraction = 1;
            this.emit('bullseye')

        } else {
            this._curr = value;
        }

        this.velocity = delta / period;
        this.time = now;

        this.emit('step', {
            time: this.time,
            period: period,
            fraction: fraction,
            delta: delta,
            value: value
        });

        return this;

    },
    start: function() {
        if(!this.running) {
            this.running = true;
            this.startTime = this.time = new Date().getTime();
            animloop.on('beforedraw', this.step);

            if(!animloop.running) {
                animloop.start();
            }

            this.emit('start');
        }
        return this;
    },
    stop: function() {
        this.running = false;
        animloop.off(this.step);
        this.emit('stop');
        return this;
    },

    // convenience function to calculate inertial target at a given point
    // todo - calculate rolling average, instead of this._curr directly
    inertialTarget: function(acceleration, maxDisplacement) {
        var displacement = Math.min(Math.pow(this.velocity, 2) / (-2 * (acceleration || this.acceleration)), maxDisplacement || this.maxDisplacement);
        return(this._curr + (displacement * (this.velocity > 0 ? 1 : -1)));
    }

});


// Twain.js

function Twain(obj) {
    if(!(this instanceof Twain)) return new Twain(obj);
    this.config = obj;
    this.tweens = {};

    this.running = true; // this is not dependable
}

emitter(Twain.prototype);

extend(Twain.prototype, {
    // convenience to get a tween for a prop
    $t: function(prop, opts) {
        var t = this;
        if(this.tweens[prop]) {
            return this.tweens[prop];
        }

        var tween = this.tweens[prop] = Tween(opts || this.config);
        tween.on('step', function(step) {
            t.emit('step', extend({}, step, {
                prop: prop
            }));
        });

        if(this.running) tween.start();

        return tween;
    },
    from: function(from) {
        var t = this;
        each(from, function(val, prop) {
            t.$t(prop).from(val);
        });
        return this;
    },

    to: function(to) {
        var t = this;
        each(to, function(val, prop) {
            t.$t(prop).to(val);
        });
        return this;
    },
    start: function(prop) {
        // convenience to start off all/one tweens
        this.running = true;
        invoke(prop ? [this.$t(prop)] : map(this.tweens), 'start');
        return this;

    },
    stop: function(prop) {
        // convenience to stop all/one tweens
        this.running = false;
        invoke(prop ? [this.$t(prop)] : map(this.tweens), 'stop');
        return this;

    }
});

Twain.Tween = Tween;

module.exports = Twain;
});
require.register("threepointone-raf/index.js", function(exports, require, module){
(function(){

    var root = this;
    module.exports = root.requestAnimationFrame || 
        root.webkitRequestAnimationFrame || 
        root.mozRequestAnimationFrame || 
        root.oRequestAnimationFrame || 
        root.msRequestAnimationFrame || 
        fallback;

var prev = new Date().getTime();

function fallback(fn) {
    var curr = new Date().getTime();
    var ms = Math.max(0, 16 - (curr - prev));
    setTimeout(fn, ms);
    prev = curr;
}    
}).call(this);



});
require.register("threepointone-animloop/index.js", function(exports, require, module){
var raf = require('raf'),
    emitter = require('emitter');

var running = false;

var EVT = 'beforedraw';

var AnimLoop = {
    start: function() {
        if(!running){
            running = true;
            runloop();
        }
    },
    stop: function(){
        running = false;
    }
};

emitter(AnimLoop);

module.exports = AnimLoop;

function runloop(){
    if(running){
        AnimLoop.emit(EVT);
        raf(runloop);
    }
}


});
require.register("cssforthesoul/public/javascripts/index.js", function(exports, require, module){
var feedback = require('./feedback.js');
feedback[0].fn();

feedback[1].fn();

feedback[2].fn();

feedback[3].fn();

// cis map

var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
    subDomains = ['otile1', 'otile2', 'otile3', 'otile4'],
    cloudmadeAttrib = '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, and <a href="http://www.openstreetmap.org/" target="_blank">OSM</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
//bounds = new L.LatLngBounds(new L.LatLng(11, 76), new L.LatLng(12, 77));
var cloudmade = new L.TileLayer(cloudmadeUrl, {
    maxZoom: 18,
    attribution: cloudmadeAttrib,
    subdomains: subDomains
});


var map = new L.Map('map', {
    //center: bounds.getCenter(),
    zoom: 15,
    layers: [cloudmade],
    //maxBounds: bounds
});

var venue = new L.LatLng(12.9647, 77.6375); // geographical point (longitude and latitude)
map.setView(venue, 15).addLayer(cloudmade);

var venue_marker = new L.Marker(venue);
map.addLayer(venue_marker);
venue_marker.bindPopup('The Center for Internet and Society').openPopup();


});
require.register("cssforthesoul/public/javascripts/feedback.js", function(exports, require, module){
var twain = require('twain'),
    animloop = require('animloop');

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
                        $('.hero .hasgeek-presents').addClass('needed-logo');
                        $('.hero .txt').animate({
                            'margin-left': -1000,
                            'margin-top': -20
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
        // return;
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
                        'border-radius': 0
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

                                    pic.css({
                                        'border-radius': 30
                                    });
                                });


                                wait(1400, function() {
                                    $(comments[3]).css({
                                        opacity: 0
                                    }).show().animate({
                                        opacity: 1
                                    }, 300, function() { // ROUNDER
                                        pic.removeClass('avatar-3d');
                                        wait(200, function() {
                                            pic.css({
                                                'border-radius': 90
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


        var stretcher = $('.everywhere .stretcher').get(0);

        (function() {
            var t = twain({
                multiplier: 0.08 / 16
            });
            var toggle = true;
            t.on('step', function(step) {
                stretcher.style.width = step.value + '%';
            });

            setInterval(function() {
                if(toggle == true) {
                    toggle = false;
                    t.to({
                        width: 30
                    })
                    return;
                }
                toggle = true;
                t.to({
                    width: 100
                })

            }, 2000);

        })();

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

        $('.bar-graph .bar').each(function(i, el) {
            var tween = twain();
            tween.on('step', function(step) {
                el.style.width = step.value + 'px';
            });
            setInterval(function() {
                tween.to({
                    width: Math.random() * 100
                });
            }, 300 + Math.random() * 500)
        });


    }

}, {
    trigger: null,
    fn: function(done) {
        var hole = $('.hole-cnt');
        var width = hole.width();
        var height = hole.height();
        var nucleus = $('.hole-cnt .nucleus');
        var electrons = nucleus.find('.electron');


        animloop.on('beforedraw', function() {
            var time = new Date().getTime();

            electrons.each(function(i, el) {
                $(el).css({
                    transform: 'rotate(' + (i * 30) + 'deg) translate(0, ' + (20 * Math.sin((time + i * 20) / 100)) + 'px)'
                });
            });
        });

        var user = function(e) {
            var _left = e.pageX - hole.offset().left;
            var _top = e.pageY - hole.offset().top;
            nucleus.css({
                top: _top,
                left: _left
            });
        };

        try {
            window.addEventListener("touchstart", user);
        } catch(e) {
            // touch probably not supported
        }


        $(document.body).on('mousemove', user);

    }
}];
});
require.alias("threepointone-twain/index.js", "cssforthesoul/deps/twain/index.js");
require.alias("threepointone-animloop/index.js", "threepointone-twain/deps/animloop/index.js");
require.alias("threepointone-raf/index.js", "threepointone-animloop/deps/raf/index.js");

require.alias("component-emitter/index.js", "threepointone-animloop/deps/emitter/index.js");

require.alias("manuelstofer-each/index.js", "threepointone-twain/deps/each/index.js");

require.alias("threepointone-times/index.js", "threepointone-twain/deps/times/index.js");

require.alias("component-emitter/index.js", "threepointone-twain/deps/emitter/index.js");

require.alias("component-bind/index.js", "threepointone-twain/deps/bind/index.js");

require.alias("threepointone-animloop/index.js", "cssforthesoul/deps/animloop/index.js");
require.alias("threepointone-raf/index.js", "threepointone-animloop/deps/raf/index.js");

require.alias("component-emitter/index.js", "threepointone-animloop/deps/emitter/index.js");

require.alias("cssforthesoul/public/javascripts/index.js", "cssforthesoul/index.js");

