//可选资源(-附加产品信息)的脚本

;
! function(R, F, window, document, undefined) {
    define(["../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js", "../../public/utility/js/cruise.utitlty.js", "./data.js"], function(once, cruiseScroll, util, PFData) {
        var thisAttachProObj = thisAttachProObj || {};
        var $attchProBox = F.one(".unit-other");
        F.lang.extend(thisAttachProObj, {
            init: function() {
                this.draw();
                this.bindEvent();
            },
            bindEvent: function() {
                F.all(".other-pro-more").once("attchPro-thisObj", function() {
                    var $note = F.one(".other-pro-detail .note", F.one(this).parent(".other-pro-list"));
                    if ($note && F.trim($note.html()).length == 0) F.one(this).css("visibility:hidden;");
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $box = $this.parent(".other-pro-list"),
                            $more = F.one(".other-pro-detail", $box);
                        if ($more.hasClass("none")) {
                            $more.removeClass("none");
                            $this.html("收起");
                        } else {
                            $this.html("详情");
                            $more.addClass("none");
                        }
                        cruiseScroll.update();
                    });
                });
            },
            draw: function() {
                var data = this.DATA;
                if (!data) {
                    this.load();
                    return false;
                }
                var arr = [],
                    $box = F.one(".other-pro", $attchProBox),
                    temp = F.one("script.template", $box).html(),
                    str = "";
                for (var item in data) {
                    if (data.hasOwnProperty(item) && data[item]) {
                        arr = arr.concat(data[item]);
                    }
                }
                util.forEach(arr, function(index, item) {
                    str += temp.format(
                        item["PriceName"],
                        item["RetailPrice"] ? "&yen;" + item["RetailPrice"] : "免费",
                        item["PriceDes"]
                    );
                })
                if (str.length) {
                    $box.html("bottom", str);
                } else {
                    $attchProBox.addClass("none");
                }
                cruiseScroll.update();
                this.bindEvent();
            },
            load: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.ajaxObj = F.ajax({
                    url: "/youlun/cruisetours/tours.ashx?type=GetLineAdditionResource&LineId={0}&lineDate={1}".format(PFData.lineId, PFData.lineDate),
                    type: "json",
                    fn: function(data) {
                        if (data) {
                            that.DATA = data;
                            that.draw();
                        } else {
                            $attchProBox.addClass("none");
                            cruiseScroll.update();
                        }
                    }
                });
            }
        });


        F.ready(function() {
            thisAttachProObj.init();
        });
    });
}(requirejs, fish, window, document);
