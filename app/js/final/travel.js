//游记脚本
;
! function(R, F, window, document, undefined) {
    define(["../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js","../../public/utility/js/cruise.utitlty.js", "./data.js"], function(once, cruiseScroll, util, PFData) {
        var $travelBox = F.one(".unit-travel");
        var thisTravelObj = thisTravelObj || {};
        F.lang.extend(thisTravelObj, {
            init: function() {
                this.draw();
            },
            draw: function() {
                var data = this.DATA;
                if (!data) {
                    this.load();
                    return false;
                }
                var $pro = F.one(".travel-pro", $travelBox),
                    temp = F.one("script.template", $pro).html(),
                    str = "";
                util.forEach((data || []).slice(0, 2), function(index, item) {
                    str += temp.format(
                        "http://go.ly.com/youji/" + item["RmId"] + ".html",
                        "target='_blank'",
                        item["RmImageList"].length ? item["RmImageList"][0] : "",
                        "",
                        item["RmTitle"] || "",
                        item["Contentxt"] || "",
                        "http://go.ly.com/user/" + item["AesRmMemberId"] + "/",
                        "target='_blank'",
                        item["RmUserName"],
                        item["ReviewCount"] + "\/" + item["ReRecommendCount"]
                    )
                });

                if (str.length) {
                    $pro.html("top", str);
                } else {
                    F.one(".travel-pro-nothing", $pro).removeClass("none");
                    F.one(".travel-pro-more", $pro).addClass("none");
                }
                cruiseScroll.update();
            },
            load: function() {
                var that = this,
                    $pro = F.one(".travel-pro", $travelBox);
                if (this.ajaxObj) this.ajaxObj.abort();
                this.ajaxObj = F.ajax({
                    url: "/youlun/CruiseShipTeam/CruiseShipTeamAjax.aspx?type=GetYouJiInfo&shipName={0}&length=158".format(encodeURIComponent(PFData.cruiseName)),
                    type: "json",
                    fn: function(data) {
                        if (data) {
                            that.DATA = data;
                            that.draw();
                        } else {

                            F.one(".travel-pro-nothing", $pro).removeClass("none");
                            F.one(".travel-pro-more", $pro).addClass("none");
                        }
                    }
                })
            }
        });

        F.ready(function() {
            thisTravelObj.init();
        });
    });
}(requirejs, fish, window, document);
