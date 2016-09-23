//fish.once.js
//让事件只绑定一次
;
! function(F, window, document, undefined) {
    define(["../../utility/js/cruise.utitlty.js"], function(util) {
        var uuid = 0,
            cache = {};

        function once(id, fn) {
            var name = "",
                elements = []
            if (typeof id !== "string") {
                if (!cache[id]) {
                    cache[id] = ++uuid;
                }
                if (!fn) fn = id;
                id = "fish-once-" + cache[id];
            }
            name = id + "-processed";
            F.all(this).each(function() {
                if (!F.one(this).hasClass(name)) {
                    F.one(this).addClass(name);
                    elements.push(F.dom(this));
                }
            });
            elements = F.all(elements);
            return util.isFunction(fn) ? elements.each(fn) : elements;
        }
        F.extend({ once: once });
        return once;
    });
}(fish, window, window.document);
