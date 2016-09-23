//推荐相似产品脚本
;
! function(R, F, window, document, undefined) {
    define(["../../public/utility/js/cruise.utitlty.js", "../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js", "./tongji.js", "./data.js"], function(util, once, cruiseScroll, TJObj, PFData) {

        var $recommBox = F.one(".recommpro-box");
        var thisRecommObj = thisRecommObj || {};
        F.lang.extend(thisRecommObj, {
            init: function() {
                this.draw();
                this.bindEvent();
            },
            bindEvent: function() {
                F.one(".recommpro-more-btn", $recommBox).once("recomm-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $inner = F.one(".recommpro-inner", $recommBox),
                            isOpen, c;
                        if ($this.hasClass("Animing")) return false;
                        c = parseInt($inner.attr("c-attr"), 10);
                        c = isNaN(c) ? 0 : c < 0 ? 0 : c;
                        $this.addClass("Animing");
                        isOpen = $this.hasClass("open");
                        if (isOpen) {
                            $inner.anim("height:" + (57 * 3) + "px;", 800, function() {
                                $this.removeClass("open");
                                $this.removeClass("Animing");
                                $this.html("查看更多<i></i>");
                                cruiseScroll.update();
                            });
                        } else {
                            $inner.anim("height:" + (57 * c) + "px;", 800, function() {
                                $this.addClass("open");
                                $this.removeClass("Animing");
                                $this.html("收起<i></i>");
                                cruiseScroll.update();
                            });
                        }
                    });
                });
            },
            draw: function() {
                var data = this.DATA,
                    _str = "",
                    $box = F.one(".recommpro-list", $recommBox),
                    temp = F.one("script.template", $recommBox).html(),
                    $inner = F.one(".recommpro-inner", $box),
                    $btn = F.one(".recommpro-more-btn", $box),
                    len;

                if (!data) {
                    this.load();
                    return false;
                };
                len = data["ListCruiseRelatedLineInfo"] || [];
                util.forEach(len, function(index, item) {
                    _str += temp.format(
                        (function() {
                            var ___str = "{0}  {1}  {2}  {3}";

                            if (item["LineTourType"] != 1) {
                                ___str = ___str.format(F.parseTime(item["SailDate"] || PFData.lineDate) + "出发&nbsp;", item["MainTitle"] || "", "", "");
                            } else {
                                ___str = ___str.format("", item["MainTitle"] || "", "", "");
                            }
                            if (___str.length > 64) return ___str.slice(0, 64) + "...";
                            return ___str;
                        }()),
                        item["MinPrice"],
                        "/youlun/final-{0}_{1}.html?lid={2}".format(item["LineId"], F.parseTime(item["SailDate"] || PFData.lineDate), "390"),
                        "target='_blank'"
                    );
                });
                len = len.length;
                /*if (data["MainTitle"] && data["MainTitle"].length) {
                    var $title = F.one(".pro-box .pro-title");
                    $span = F.one("span", $title);
                    $title.html(data["MainTitle"] + ($span && $span[0] && $span.html().length ? "<span>" + $span.html() + "</span>" : ""));
                }*/
                if (len) {
                    $recommBox.removeClass("none");
                    $inner.html(_str);
                    $inner.attr("c-attr", len);
                    if (len > 3) {
                        $btn.removeClass("none");
                        $inner.css("height:" + (57 * 3) + "px");
                    } else {
                        $inner.css("height:" + (57 * len) + "px");
                    }
                } else {
                    $recommBox.addClass("none");
                }

                cruiseScroll.update();
            },
            load: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.ajaxObj = F.ajax({
                    url: "/youlun/AjaxCall_Cruise.aspx?Type=GetCruiseLineRelatedList&lineid={0}&saildate={1}&verison=1.1".format(PFData.lineId, PFData.lineDate),
                    type: "json",
                    fn: function(data) {
                        if (data) {
                            that.DATA = data;
                            that.draw();
                        } else {
                            $recommBox.addClass("none");
                        }
                    }
                });
            }
        });
        F.ready(function() {
            thisRecommObj.init();
        })
    });
}(requirejs, fish, window, document);
