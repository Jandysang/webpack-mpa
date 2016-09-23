//统计的脚本
;
! function(R, F, window, document, undefined) {
    define("pc_final_tj", ["../../public/utility/js/cruise.utitlty.js", "./data.js"], function(util, PFData) {
        var obj = {};
        if (util.getUrlParam("SearchCondition")) obj["searchCondition"] = util.getUrlParam("SearchCondition");
        if (util.getUrlParam("lid")) obj["lid"] = util.getUrlParam("lid");
        if (util.getUrlParam("Key")) {
            obj["Key"] = util.getUrlParam("Key");
        } else {
            F.ajax({
                url: "/youlun/AjaxCall_Cruise.aspx?Type=GenerateSpecialStatisticKey",
                sync: true,
                openType: "post",
                data: "LineIds={0}{1}".format(PFData.lineId, obj["lid"] ? "&Lid=" + obj["lid"] : ""),
                type: "json",
                fn: function(data) {
                    if (data && data.length && data[0].Key) {
                        obj["Key"] = data[0].Key;
                    }
                }
            })
        }

        //新版终页 lid和key写死 start
        //吴长江需求 2016-07-27 ----
        //390是夏阳的推荐lid
        //418是夏阳的搜索页聚合线路lid
        // obj["lid"] = "398";
        // if (util.getUrlParam("lid")) {
        //     if (["390", "418"].indexOf(F.trim(util.getUrlParam("lid"))) >= 0) {
        //         obj["lid"] = F.trim(util.getUrlParam("lid"));
        //     }
        // }
        // F.ajax({
        //     url: "/youlun/AjaxCall_Cruise.aspx?Type=GenerateSpecialStatisticKey",
        //     sync: true,
        //     openType: "post",
        //     data: "LineIds={0}{1}".format(PFData.lineId, obj["lid"] ? "&Lid=" + obj["lid"] : ""),
        //     type: "json",
        //     fn: function(data) {
        //         if (data && data.length && data[0].Key) {
        //             obj["Key"] = data[0].Key;
        //         }
        //     }
        // });
        //新版终页lid和key写死 end

        //当前页面次数统计
        F.ajax({
            url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseSpecialStatistic",
            openType: "post",
            data: (function() {
                var dataStr = "";
                if (obj['Key']) {
                    dataStr += "Key=" + obj['Key'];
                    if (obj["searchCondition"]) dataStr += "&SearchCondition=" + obj["searchCondition"];
                } else {
                    dataStr += "LineId=" + PFData.lineId;
                    dataStr += obj["lid"] ? "&Lid=" + obj["lid"] : "";
                }
                dataStr += "&PageType=DetailPage";
                dataStr += "&Url=" + encodeURIComponent(location.href);
                dataStr += "&Userid=" + (typeof(getMemberId) !== "undefined" && util.isFunction(getMemberId) ? getMemberId() : 0);
                dataStr += "&v=" + new Date().getTime();
                return dataStr;
            }())
        });


        function addKey(selector) {
            var selector = F.all(selector);
            util.forEach(Array.prototype.slice.call(selector), function(index, elem) {
                elem = F.one(elem);
                var urlStr = F.trim(elem.attr("href") || "");
                if (!urlStr.length) return true;
                if (util.getUrlParam("Key", urlStr)) return true;
                var urlObj = util.formatUrl(urlStr),
                    urlArr = [];
                F.lang.extend(urlObj, obj);
                for (var item in urlObj) {
                    if (urlObj.hasOwnProperty(item)) {
                        urlArr.push(item + "=" + urlObj[item]);
                    }
                }
                elem.attr("href", urlStr.split("?")[0] + "?" + urlArr.join("&"));
            })
        }



        return {
            obj: obj,
            add: addKey
        }
    });
}(requirejs, fish, window, document);
