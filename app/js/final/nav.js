    //主导航
    ;
    ! function(R, F, window, document, undefined) {

        define(["../../public/utility/js/cruise.utitlty.js", "../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js","./data.js","./buried_point.js"], function(util, once, scroll,PFData,cbPoint) {
            scroll.add("main-nav", function() {
                var arr = [],
                    $box = F.one(".nav-box"),
                    $nav = F.one(".nav-cont", $box),
                    $units = F.all(".detail-unit"),
                    _arr = [],
                    winTop = F.one(window).scrollTop(),
                    i = 0;
                $units.each(function() {
                    if (!F.one(this).hasClass("unit-other")) { //可选资源 不用定位
                        arr.push(F.one(this).offset().top - $nav.height());
                    }
                });
                arr[0] = $box.offset().top;
                _arr = arr.concat([winTop]);
                _arr.sort(function(a, b) {
                    return a - b;
                });
                i = _arr.indexOf(winTop);
                if (i < 1) {
                    $nav.removeClass("fixed");
                    F.all("a", $nav).removeClass("crt-at");
                    F.one("a", $nav).addClass("crt-at");
                    F.one(".nav-book-info", $nav).removeClass("open");
                } else {
                    $nav.addClass("fixed");
                    F.all("a", $nav).removeClass("crt-at");
                    F.one(F.all("a", $nav)[i - 1]).addClass("crt-at");
                    F.one(".nav-book-info", $nav).addClass("open");
                }
                return function() {
                    winTop = F.one(window).scrollTop();
                    _arr = arr.concat([winTop]);
                    _arr.sort(function(a, b) {
                        return a - b;
                    });
                    i = _arr.indexOf(winTop);
                    if (i < 1) {
                        $nav.removeClass("fixed");
                        F.all("a", $nav).removeClass("crt-at");
                        F.one("a", $nav).addClass("crt-at");
                        F.one(".nav-book-info", $nav).removeClass("open");
                    } else {
                        $nav.addClass("fixed");
                        F.all("a", $nav).removeClass("crt-at");
                        F.one(F.all("a", $nav)[i - 1]).addClass("crt-at");
                        F.one(".nav-book-info", $nav).addClass("open");
                        //滚动点评标签埋点
                        if(F.one(F.all("a", $nav)[i - 1]).html().indexOf('用户点评')>-1){
                            cbPoint.dpFnTrackEvent("Scendet_dpclick", "^youlun^" +PFData.cruiseId + "^1^^");
                        }
                    }
                }
            });



            F.ready(function() {
                //绑定定位事件
                F.all(".nav-box .nav-cont .nav-btns a").once("nav-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $units = F.all(".detail-unit"),
                            mainNavHei = F.one(".nav-box .nav-cont").height() - 4,
                            className = $this.attr("nav-attr");
                        if (!className || typeof className != "string" || className.length == 0) return false;
                        className = "." + F.trim(className);
                        //滚动点评标签埋点
                        if(F.one(this).html().indexOf('用户点评')>-1){
                            cbPoint.dpFnTrackEvent("Scendet_dpclick", "^youlun^" +PFData.cruiseId + "^1^^");
                        }
                        window.scrollTo(0, F.one(className).offset().top - mainNavHei);
                    })
                });
            });

        });
    }(requirejs, fish, window, document);
