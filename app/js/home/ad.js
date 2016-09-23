//页头广告脚本，这计划用内嵌样式来处理
;
! function(R, F, window, document, undefined) {
    define("pc_final_ad", ["../../public/fish/js/fish.scroll.js"], function(cruiseScroll) {
        var flag;
        F.ajax({
            url: "/youlun/CruiseTours/CruiseToursAjax.aspx",
            data: "Type=GetCruiseSliderPicList&num=1",
            type: "json",
            fn: function(data) {
                if (!flag) append(data[0]);
            }
        });

        function append(obj) {
            if (obj && obj["LineUrl"] && obj["ImgUrl"]) {
                F.one(".content").html("top", "<div class='ad-box'><a target='_blank' href='{0}'><img alt='' src='{1}'/></a></div>".format(obj["LineUrl"], obj["ImgUrl"]));

                flag = true;
                F.one(".ad-box", F.one(".content")).anim("height:90px", 500, function() {
                    cruiseScroll.update();
                });
            }
        }

        function appendByTimeZone(options) {
            var begin = F.parseDate(options["begin"]).getTime(),
                end = F.parseDate(options["end"]).getTime(),
                now = new Date().getTime();
            if (end <= begin) return false;
            if (now <= end && now > begin) {
                if (!flag) append(options["data"]);
            }
        }
        return {
            append: append,
            appendBTZ: appendByTimeZone
        }
    });
    R(["pc_final_ad"], function(ADObj) {

    });
}(requirejs, fish, window, document);
