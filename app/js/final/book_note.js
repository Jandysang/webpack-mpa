//预定须知的脚本
;
! function(R, F, window, document, undefined) {
    define(["../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js", "../../public/utility/js/cruise.utitlty.js", "./data.js"], function(once, cruiseScroll, util, PFData) {
        var thisBookNoteObj = thisBookNoteObj || {};
        var $bookNoteBox = F.one(".unit-booking");
        F.lang.extend(thisBookNoteObj, {
            init: function() {
                this.bindEvent();
                var data = this.DATA;
                if (data) {
                    var btns = F.all(".booking-pro-store .tabs li", $bookNoteBox);
                    util.forEach(Array.prototype.slice.call(btns), function(index, elem) {
                        elem = F.one(elem);
                        var t = elem.attr("_type");
                        if (t == data["Id"]) {
                            F.dom(elem).click();
                            return false;
                        }
                    });
                } else {
                    this.load();
                    return false;
                }

            },
            bindEvent: function() {
                cruiseScroll.add("booknote-nav", function() {
                    var $box = F.one(".booking-pro .booking-pro-counts", $bookNoteBox),
                        $navBox = F.one(".booking-pro-tabbox", $bookNoteBox),
                        $mainNav = F.one(".nav-box .nav-cont"),
                        mainNavHei = $mainNav.height() + 4,
                        $nav = F.one(".booking-pro-tabs", $bookNoteBox),
                        bookNoteTop = $box.offset().top - mainNavHei,
                        bookNoteBottom = bookNoteTop + $box.height() - $nav.height(),
                        winTop = F.one(window).scrollTop();
                    if (bookNoteBottom <= bookNoteTop) bookNoteBottom = bookNoteTop;
                    if (winTop > bookNoteTop && winTop < bookNoteBottom) {
                        $nav.css("position:fixed;top:" + mainNavHei + "px;");
                    } else if (winTop >= bookNoteBottom) {
                        $nav.css("position:absolute;top:" + (bookNoteBottom - bookNoteTop) + "px;");
                    } else {
                        $nav.css("position:absolute;top:0px;");
                    }
                    return function() {
                        winTop = F.one(window).scrollTop()
                        if (winTop > bookNoteTop && winTop < bookNoteBottom) {
                            $nav.css("position:fixed;top:" + mainNavHei + "px;");
                        } else if (winTop >= bookNoteBottom) {
                            $nav.css("position:absolute;top:" + (bookNoteBottom - bookNoteTop) + "px;");
                        } else {
                            $nav.css("position:absolute;top:0px;");
                        }
                    }
                });

                var $btns = F.all(".booking-pro-store .tabs li", $bookNoteBox),
                    $tabBtns = F.all(".booking-pro-tabs li", $bookNoteBox);
                $btns.once("bookNote-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $conts = F.all(".booking-pro-store .counts .count", $bookNoteBox),
                            $cont, $this = F.one(this),
                            t = $this.attr("_type");
                        if ($this.hasClass("at")) return false;
                        util.forEach(Array.prototype.slice.call($conts), function(index, elem) {
                            elem = F.one(elem);
                            if (t == elem.attr("_type")) {
                                $cont = elem;
                                return false;
                            }
                        });
                        $btns.removeClass("at");
                        $conts.addClass("none");
                        $this.addClass("at");
                        $cont && $cont.removeClass("none");
                        cruiseScroll.update();
                    });
                });
                $tabBtns.once("bookNote-thisObj", function(elem, index) {
                    F.one(this).on("click", function() {
                        var $conts = F.all(".booking-pro-counts .booking-pro-count", $bookNoteBox),
                            $this = F.one(this),
                            $cont = F.one($conts[index]);
                        if ($this.hasClass("at")) return false;
                        $conts.addClass("none");
                        $cont.removeClass("none");
                        $tabBtns.removeClass("at");
                        $this.addClass("at");
                        cruiseScroll.update();
                        window.scrollTo(0, $cont.offset().top - F.one(".nav-box .nav-cont").height() - 4);

                    });
                });
            },
            load: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.ajaxObj = F.ajax({
                    url: "/youlun/cruisetours/tours.ashx?type=GetAreaProvinceInfo",
                    type: "json",
                    fn: function(data) {
                        if (data) {
                            that.DATA = data;
                            that.init();
                        }
                    }
                });
            }
        });
        F.ready(function() {
            thisBookNoteObj.init();
        });
    });
}(requirejs, fish, window, document);
