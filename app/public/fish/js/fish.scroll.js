//window.onscroll滚动事件集合处理
//

;
! function(F, window, document, undefined) {
    define(["../../utility/js/cruise.utitlty.js"], function(util) {
        var uuid = 0,
            cache = {},
            Fns = {},
            _Fns = {};

        function add(id, fn) {
            var name;
            if (typeof id !== "string") {
                if (!cache[id]) {
                    cache[id] = ++uuid;
                }
                if (!fn) fn = id;
                id = "fish-scroll-" + cache[id];
            }
            name = id + "-processed";

            if (util.isFunction(fn)) {
                _Fns[name] = fn;
                if (util.isFunction(fn())) {
                    Fns[name] = fn();
                }
            }
        }

        function update() {
            for (var item in _Fns) {
                if (_Fns.hasOwnProperty(item)) {
                    if (util.isFunction((_Fns[item])())) {
                        Fns[item] = (_Fns[item])();
                        (Fns[item])();
                    }
                }
            }
        }

        function del(id) {
            var name;
            if (typeof(id) === "undefined") return false;
            name = id + "-processed";
            delete _Fns[name];
            delete Fns[name];
        }

        F.one(window).on("scroll", function() {
            for (var item in Fns) {
                if (Fns.hasOwnProperty(item)) {
                    (Fns[item])();
                }
            }
        });
        F.extend({
            scroll: {
                add: add,
                update: update,
                del: del
            }
        })
        return {
            add: add,
            update: update,
            del: del
        }
    });
}(fish, window, window.document);
