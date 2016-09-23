//行程的脚本
;
! function(R, F, window, document, undefined) {
    define(["../../public/utility/js/cruise.utitlty.js", "../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js", "./data.js"], function(util, once, cruiseScroll, PFData) {
        var thisTripObj = thisTripObj || {};
        var $tripBox = F.one(".unit-trip");
        F.lang.extend(thisTripObj, {
            init: function() {

                this.draw();
                this.bindEvent();
            },
            bindEvent: function() {
                //天数定位
                cruiseScroll.add("trip-nav", function() {
                    var arr = [],
                        $box = F.one(".trip-views-content", $tripBox),
                        $navBox = F.one(".trip-vc-left", $box),
                        $nav = F.one(".trip-nav", $navBox),
                        $mainNav = F.one(".nav-box .nav-cont"),
                        mainNavHei = $mainNav.height() + 4,
                        $units = F.all(".trip-vc-right .trip-every", $box),
                        _arr = [],
                        bottomHei = $box.height() - $nav.height(),
                        bottomPos = bottomHei + $box.offset().top,
                        winTop = F.one(window).scrollTop(),
                        i = 0;
                    $units.each(function() {
                        arr.push(F.one(this).offset().top - mainNavHei);
                    });
                    arr[0] = $navBox.offset().top - mainNavHei;
                    _arr = arr.concat([winTop]);
                    _arr.sort(function(a, b) {
                        return a - b;
                    });
                    i = _arr.indexOf(winTop);
                    if (i < 1) {
                        $nav.css("position:absolute;top:0px;");
                        thisTripObj.navAutoScroll(0);
                    } else if (winTop >= bottomPos) {
                        $nav.css("position:absolute;top:" + bottomHei + "px;");
                        thisTripObj.navAutoScroll(i - 1);
                    } else {
                        $nav.css("position:fixed;top:" + mainNavHei + "px;");
                        thisTripObj.navAutoScroll(i - 1);
                    }
                    return function() {
                        winTop = F.one(window).scrollTop();
                        _arr = arr.concat([winTop]);
                        _arr.sort(function(a, b) {
                            return a - b;
                        });
                        i = _arr.indexOf(winTop);
                        if (i < 1) {
                            $nav.css("position:absolute;top:0px;");
                            thisTripObj.navAutoScroll(0);
                        } else if (winTop >= bottomPos) {
                            $nav.css("position:absolute;top:" + bottomHei + "px;");
                            thisTripObj.navAutoScroll(i - 1);
                        } else {
                            $nav.css("position:fixed;top:" + mainNavHei + "px;");
                            thisTripObj.navAutoScroll(i - 1);
                        }
                    }
                });
                F.all(".trip-every .trip-tour-list .trip-tour-cont a", $tripBox).once("trip-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $more = F.one(".trip-tour-more", $this.parent("li")),
                            $btn = F.one(".trip-tour-dropbtn", $this.parent(".trip-tour-cont"));
                        if ($more.hasClass("none")) {
                            $more.removeClass("none");
                            $btn.html("收起");
                        } else {
                            $more.addClass("none");
                            $btn.html("详情");
                        }
                        cruiseScroll.update();
                    });
                });
                F.all(".trip-nav a", $tripBox).once("trip-thisObj", function(elem, index) {
                    F.one(this).on("click", function() {
                        var $units = F.all(".trip-vc-right .trip-every", $tripBox),
                            mainNavHei = F.one(".nav-box .nav-cont").height();
                        window.scrollTo(0, F.one($units[index]).offset().top - mainNavHei);
                    });
                });
                F.all(".trip-tour-list .trip-tm-prev", $tripBox).once("trip-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $imgBox = F.all(".trip-tm-img", $this.parent(".trip-tm-left")),
                            $imgs = F.all("img", $imgBox),
                            i = parseInt($imgBox.attr("i-attr"), 10);
                        i = isNaN(i) ? 0 : i < 0 ? 0 : i;
                        if (i <= 0) {
                            $this.addClass("disabled");
                            return false;
                        }
                        if ($imgBox.hasClass("Animing") || $this.hasClass("disabled")) return false;
                        $imgBox.addClass("Animing");
                        i -= 1;
                        $imgBox.anim("left:-" + (260 * i) + "px;", 300, function() {
                            $imgBox.removeClass("Animing");
                            $imgBox.attr("i-attr", i);
                            if (i <= 0) {
                                $this.addClass("disabled");
                                return false;
                            }
                            F.one(".trip-tm-next", $this.parent()).removeClass("disabled");
                        });
                    });
                });
                F.all(".trip-tour-list .trip-tm-next", $tripBox).once("trip-thisObj", function() {
                    F.one(this).on("click", function() {

                        var $this = F.one(this),
                            $imgBox = F.all(".trip-tm-img", $this.parent(".trip-tm-left")),
                            $imgs = F.all("img", $imgBox),
                            i = parseInt($imgBox.attr("i-attr"), 10);
                        i = isNaN(i) ? 0 : i < 0 ? 0 : i;
                        if (i >= $imgs.length - 1) {
                            $this.addClass("disabled");
                            return false;
                        }
                        if ($imgBox.hasClass("Animing") || $this.hasClass("disabled")) return false;
                        $imgBox.addClass("Animing");
                        i += 1;
                        $imgBox.anim("left:-" + (260 * i) + "px;", 300, function() {
                            $imgBox.removeClass("Animing");
                            $imgBox.attr("i-attr", i);
                            if (i >= $imgs.length - 1) {
                                $this.addClass("disabled");
                                return false;
                            }
                            F.one(".trip-tm-prev", $this.parent()).removeClass("disabled");
                        });
                    });
                });
            },
            navAutoScroll: function(cIndex) {
                if (typeof cIndex !== "number") return false;
                var $nav = F.one(".trip-nav", $tripBox),
                    $navBtns = F.all("a", $nav),
                    $span = F.one("span", $nav),
                    index = parseInt($nav.attr("i-attr"), 10);
                index = isNaN(index) ? 0 : index < 0 ? 0 : index;
                $nav.attr("i-attr", cIndex);
                if (cIndex == index || cIndex < 0 || cIndex > $navBtns.length - 1) return false;
                $navBtns.removeClass("crt-at");
                F.one($navBtns[cIndex]).addClass("crt-at");
                if ($navBtns.length <= 8) return false;

                if (cIndex <= 3) {
                    F.dom($nav).scrollTop = 0;
                    $span.css("top:0px");
                    return false;
                }
                if (Math.abs(cIndex - $navBtns.length - 1) < 8) {
                    F.dom($nav).scrollTop = 40 * ($navBtns.length - 8);
                    $span.css("top:" + 40 * ($navBtns.length - 8) + "px");
                    return false;
                }
                F.dom($nav).scrollTop = 40 * (cIndex - 3);
                $span.css("top:" + 40 * (cIndex - 3) + "px");
            },
            draw: function() {
                var data = this.DATA,
                    $tripView = F.one(".trip-views", $tripBox),
                    getTravelDetailList, getTravelDetail;
                if (!data) {
                    this.load();
                    return false;
                }
                if (PFData.tourType == 0) {
                    $tripView.addClass("trip-domestic");
                }

                var tripStr = PFData.tourType == 0 ? this.getShortTripStr() : this.getLongTripStr();


                $tripView.html("bottom", tripStr);


                if (!F.dom(".trip-views-content", $tripBox)) {
                    F.all(".trip-obtain .btn", $tripBox).html("remove");
                }
                cruiseScroll.update();
                this.bindEvent();
                this.grabObj.init();
            },
            getShortTripStr: function() {
                var temp1 = F.one("script.template1", $tripBox).html(),
                    temp2 = F.one("script.template2", $tripBox).html(),
                    temp3 = F.one("script.template3.template-domestic", $tripBox).html(),
                    temp4 = F.one("script.template4.template-domestic", $tripBox).html(),
                    temp5 = F.one("script.template5", $tripBox).html(),
                    temp6 = F.one("script.template6", $tripBox).html(),
                    temp7 = F.one("script.template7", $tripBox).html(),
                    temp8 = F.one("script.template8", $tripBox).html(),
                    temp9 = F.one("script.template9", $tripBox).html(),
                    temp10 = F.one("script.template10", $tripBox).html(),
                    str = "",
                    data = this.DATA,
                    summayTravelStr = "",
                    travelDayStr = "",
                    travelDetailStr = "";
                //行程
                util.forEach(data["SummayTravel"]["CalendarTravelList"] || [], function(index, item) {
                    summayTravelStr += temp4.format(
                        index % 2 == 1 ? "even" : "",
                        "第{0}天（{1}月{2}日）".format(
                            item["Date"],
                            (F.parseDate(PFData.lineDate, { days: index }).getMonth() + 1),
                            F.parseDate(PFData.lineDate, { days: index }).getDate()
                        ),
                        (function() {
                            var __str = item["CountryOrSight"] + (PFData.tourType == 2 && PFData.productType == 23 ? "（" + item["CountryEn"] + "）" : "");
                            __str = __str.replace(/飞机/g, "<i class='icon icon-plane'></i>")
                                .replace(/动车/g, "<i class='icon icon-train'></i>")
                                .replace(/火车/g, "<i class='icon icon-train'></i>")
                                .replace(/汽车/g, "<i class='icon icon-bus'></i>")
                                .replace(/巴士/g, "<i class='icon icon-bus'></i>")
                                .replace(/邮轮/g, "<i class='icon icon-cruise'></i>")
                                .replace(/大巴/g, "<i class='icon icon-bus'></i>")
                                .replace(/轮船/g, "<i class='icon icon-cruise'></i>");
                            return __str;
                        }()),
                        item["TravelLive"] || "&nbsp;"
                    )
                });

                //行程详细
                //if (PFData.tourType != 2 && PFData.productType != 23 && PFData.dataSourceFrom == 0) {
                util.forEach(data["CruiseTravelAllModel"]["CruiseTravelDayModList"] || [], function(index, item) {
                    travelDayStr += "<a href='javascript:;' class='{0}'>第{1}天<i></i></a>".format(index == 0 ? "crt-at" : "", index + 1); //toFixChineseNum(index + 1));
                    travelDetailStr += temp5.format(
                        (function() {
                            var __str = "";
                            __str += "<span>第" + (index + 1) + "天</span>";
                            __str += "<span>" + ((item["LineCity"]||"").replace(/飞机/g, "<i class='icon icon-plane'></i>")
                                .replace(/动车/g, "<i class='icon icon-train'></i>")
                                .replace(/火车/g, "<i class='icon icon-train'></i>")
                                .replace(/汽车/g, "<i class='icon icon-bus'></i>")
                                .replace(/巴士/g, "<i class='icon icon-bus'></i>")
                                .replace(/邮轮/g, "<i class='icon icon-cruise'></i>")
                                .replace(/大巴/g, "<i class='icon icon-bus'></i>")
                                .replace(/轮船/g, "<i class='icon icon-cruise'></i>")) + "</span>";
                            if (item["ArrTime"].length) __str += "<span>抵达时间：" + item["ArrTime"] + "</span>";
                            if (item["SetUpTime"].length) __str += "<span>启航时间：" + item["SetUpTime"] + "</span>";
                            return __str;
                        }()),
                        (function() {
                            var __str = "";
                            util.forEach(item["EatModel"] || [], function(__index, __item) {
                                __str += "<span><i class='icon icon-food'></i>" + (__item["EatPlace"] || "").replace(/邮轮/g, "游轮") + (__item["EatName"] || "") + "：" + (__item["IsContain"] == "包含" ? "包含" : "自理") + "</span>";
                            });
                            if (item["TravelLive"].length) {
                                __str += "<span><i class='icon icon-house'></i>入住：" + item["TravelLive"] + "</span>"
                            };
                            return __str;
                        }()),
                        item["DayTimeQuantum"] && item["DayTimeQuantum"].length ? (function() {
                            var __str = "",
                                __imgStr = "";
                            util.forEach(item["DayTimeQuantum"] || [], function(__index, __item) {
                                __str += "<h5><span>{0}<i></i></span>{1}</h5>".format(
                                    __item["BeginTime"],
                                    (function() {
                                        var ___str = "",
                                            arr = ["用餐", "游览", "表演", "行驶", "其他"],
                                            _index = __item["TimeType"];
                                        _index = isNaN(_index) ? -1 : _index < 0 ? -1 : _index > arr.length - 1 ? -1 : _index;
                                        if (_index == -1) {
                                            ___str += "其他时间：" + __item["TimeUsed"];
                                        } else {
                                            ___str += arr[_index] + "时间：" + __item["TimeUsed"];
                                        }
                                        return ___str;
                                    }())
                                );
                                __str += "<p>" + (__item["TimeDescription"] || "") + "</p>";
                                util.forEach(__item["TimeQuantumImgList"] || [], function(__i, __t) {
                                    __imgStr += "<li><img src='{0}' alt='{1}'/><span>{1}</span></li>".format(__t["ImgUrl"], __t["Name"]);
                                });
                                if (__imgStr.length) __str += "<ul class='trip-descri-img'>" + __imgStr + "</ul>";
                                __imgStr = "";
                            });
                            return __str;

                        }()) : (function() {
                            var __str = "",
                                ___str = "";
                            __str += "<p>" + (item["Description"] || "") + "</p>";
                            util.forEach(item["SightCruiseTravelScenicImg"] || [], function(__index, __item) {
                                ___str += "<li><img src='{0}' alt='{1}'/><span>{1}</span></li>".format(__item["ImgUrl"], __item["Name"]);
                            });
                            if (___str.length) __str += "<ul class='trip-descri-img'>" + ___str + "<ul>";
                            return __str;
                        }()),
                        "" //暂定国内游 没有岸上观光
                    );
                });
                //}
                str += temp1.format(data["TripImage"] || "", "",
                    temp3,
                    summayTravelStr);
                if (travelDayStr.length) {
                    str += temp2.format(travelDayStr, travelDetailStr);
                }
                return str;
            },
            getLongTripStr: function() {
                var temp1 = F.one("script.template1", $tripBox).html(),
                    temp2 = F.one("script.template2", $tripBox).html(),
                    temp3 = F.one("script.template3.template-abroad", $tripBox).html(),
                    temp4 = F.one("script.template4.template-abroad", $tripBox).html(),
                    temp5 = F.one("script.template5", $tripBox).html(),
                    temp6 = F.one("script.template6", $tripBox).html(),
                    temp7 = F.one("script.template7", $tripBox).html(),
                    temp8 = F.one("script.template8", $tripBox).html(),
                    temp9 = F.one("script.template9", $tripBox).html(),
                    temp10 = F.one("script.template10", $tripBox).html(),
                    str = "",
                    data = this.DATA,
                    summayTravelStr = "",
                    travelDayStr = "",
                    travelDetailStr = "",
                    priceFlag = false,
                    pollPriceMsg = [];
                getTravelDetail = function(__data) { //长线游岸上观光详细
                    var _str = "";
                    util.forEach(__data, function(index, item) {
                        _str += temp9.format(
                            (function() {
                                var ___str = "",
                                    ___s = "";
                                if (index == 0) ___str += "<h5 class='trip-tm-tit'>费用信息:单人价格为{{__placeholder__pollPriceMsg__}}的岸上行程总价，只需支付一次即可享有所有港口的观光。</h5>";
                                if (item["ScenicImgList"].length) {
                                    util.forEach(item["ScenicImgList"], function(__index, __item) {
                                        ___s += "<img src='" + __item + "' alt=''>";
                                    });
                                    ___str += temp10.format(___s,
                                        item["ScenicImgList"].length > 1 ? "<a class='trip-tm-prev disabled' href='javscript:;'><i></i></a><a class='trip-tm-next' href='javscript:;'><i></i></a>" : "");
                                }
                                return ___str;
                            }()),
                            (function() {
                                var __str = "";
                                __str += "<h5>" + item["Name"] + "</h5>";
                                if (item["IncludeService"]) __str += "<p>所含服务：" + item["IncludeService"] + "</p>";
                                if (item["Description"].length) __str += "<p>" + item["Description"] + "</p>";
                                return __str;
                            }())
                        );
                    });
                    return _str;
                };
                getTravelDetailList = function(data) { //长线游岸上观光列表数据
                    var __str = "";
                    util.forEach(data || [], function(__index, __item) {
                        __str += temp7.format(
                            __item["TypeName"] || "",
                            (function() {
                                var __tempStr = "<span class={0}>{1}</span>";
                                if (priceFlag) return __tempStr.format("has-price", "参照【" + priceFlag + "】价格");
                                return __tempStr.format("", __item["Price"] > 0 ? "&yen;" + __item["Price"] : "免费")
                            }()),
                            /*__item["Price"] > 0 ? "&yen;" + __item["Price"] : "免费",*/
                            "详情",
                            (__item["VisitNameList"] || []).join("-"),
                            temp8.format(
                                (function() { //行程时长
                                    var __str = "",
                                        time = (__item["DetailExcursion"] && __item["DetailExcursion"]["CLTDETravelTime"]) || 0;
                                    if (Math.floor(time / 60) > 0) __str += Math.floor(time / 60) + "小时";
                                    if (Math.floor(time % 60) > 0) __str += Math.floor(time % 60) + "分钟";
                                    return __str.length ? "<span><i class='icon icon-time'></i>行程总时长：" + __str + "</span>" : "";
                                }()),
                                (function() { //是否包含餐食
                                    var obj = __item["DetailExcursion"],
                                        __str = "";
                                    if (obj) {
                                        if (obj["CLTDEIsIncludeBreakfast"] == 1) __str += "包含早餐";
                                        if (obj["CLTDEIsIncludeLunch"] == 1) __str += __str.length ? "、午餐" : "包含午餐";
                                        if (obj["CLTDEIsIncludeDinner"] == 1) __str += __str.length ? "、晚餐" : "包含晚餐";
                                        return __str.length ? __str : "不含餐食";
                                    } else return "不含餐食";
                                }()),
                                getTravelDetail(__item["CruiseTravelSightDetailModList"] || [])
                            )
                        );
                    });
                    return __str.length ? temp6.format(__str) : "";
                };
                util.forEach(data["SummayTravel"]["CalendarTravelList"] || [], function(index, item) {
                    summayTravelStr += temp4.format(
                        index % 2 == 1 ? "even" : "",
                        "第{0}天（{1}月{2}日）".format(
                            item["Date"],
                            (F.parseDate(PFData.lineDate, { days: index }).getMonth() + 1),
                            F.parseDate(PFData.lineDate, { days: index }).getDate()
                        ),
                        (function() {
                            var __str = item["CountryOrSight"] + (PFData.tourType == 2 && PFData.productType == 23 ? (item["CountryEn"] && item["CountryEn"].length ? "（" + item["CountryEn"] + "）" : "") : "");
                            __str = __str.replace(/飞机/g, "<i class='icon icon-plane'></i>")
                                .replace(/动车/g, "<i class='icon icon-train'></i>")
                                .replace(/火车/g, "<i class='icon icon-train'></i>")
                                .replace(/汽车/g, "<i class='icon icon-bus'></i>")
                                .replace(/巴士/g, "<i class='icon icon-bus'></i>")
                                .replace(/邮轮/g, "<i class='icon icon-cruise'></i>")
                                .replace(/大巴/g, "<i class='icon icon-bus'></i>")
                                .replace(/轮船/g, "<i class='icon icon-cruise'></i>");
                            return __str;
                        }()),
                        item["ArrTime"] || "&nbsp;",
                        item["SetUpTime"] || "&nbsp;"
                    )
                });

                //行程详情
                //if (PFData.tourType != 2 && PFData.productType != 23) {
                util.forEach(data["CruiseTravelAllModel"]["CruiseTravelDayModList"] || [], function(index, item) {
                    travelDayStr += "<a href='javascript:;' class='{0}'>第{1}天<i></i></a>".format(index == 0 ? "crt-at" : "", index + 1); // toFixChineseNum(index + 1));
                    travelDetailStr += temp5.format(
                        (function() {
                            var __str = "";
                            __str += "<span>第" + (index + 1) + "天</span>";
                            __str += "<span>" + ((item["LineCity"]||"").replace(/飞机/g, "<i class='icon icon-plane'></i>")
                                .replace(/动车/g, "<i class='icon icon-train'></i>")
                                .replace(/火车/g, "<i class='icon icon-train'></i>")
                                .replace(/汽车/g, "<i class='icon icon-bus'></i>")
                                .replace(/巴士/g, "<i class='icon icon-bus'></i>")
                                .replace(/邮轮/g, "<i class='icon icon-cruise'></i>")
                                .replace(/大巴/g, "<i class='icon icon-bus'></i>")
                                .replace(/轮船/g, "<i class='icon icon-cruise'></i>")) + "</span>";
                            if (item["ArrTime"].length) __str += "<span>抵达时间：" + item["ArrTime"] + "</span>";
                            if (item["SetUpTime"].length) __str += "<span>启航时间：" + item["SetUpTime"] + "</span>";
                            return __str;
                        }()),
                        (function() {
                            var __str = "";
                            util.forEach(item["EatModel"] || [], function(__index, __item) {
                                __str += "<span><i class='icon icon-food'></i>" + (__item["IsContain"] == "包含" ? (__item["EatPlace"] || "") : "") + (__item["EatName"] || "") + "：" + (__item["IsContain"] == "包含" ? "包含" : "自理") + "</span>";
                            });
                            if (item["TravelLive"].length) {
                                __str += "<span><i class='icon icon-house'></i>入住：" + item["TravelLive"] + "</span>"
                            };
                            return __str;
                        }()),
                        item["Description"],
                        item["CruiseTravelDetailMod"].length ? (function() {
                            var __str = getTravelDetailList(item["CruiseTravelDetailMod"]);
                            if (!priceFlag) priceFlag = item["LineCity"];
                            pollPriceMsg.push(item["LineCity"]);
                            return __str;
                        }()) : ""
                    );
                });
                //}
                str += temp1.format(data["TripImage"] || "", "",
                    temp3,
                    summayTravelStr);
                if (travelDayStr.length) {
                    str += temp2.format(travelDayStr, travelDetailStr);
                }
                str = str.replace(/\{\{\_\_placeholder\_\_pollPriceMsg\_\_\}\}/g, pollPriceMsg.join("、"));
                return str;
            },
            load: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.ajaxObj = F.ajax({
                    url: "/youlun/AjaxCall_Cruise.aspx?Type=TravelTripFinal&lineid={0}&saildate={1}".format(PFData.lineId, PFData.lineDate),
                    type: "json",
                    fn: function(data) {
                        if (data) {
                            that.DATA = data;
                            that.draw();
                        }
                    }
                })
            },
            grabObj: { //有关行程的打印和和发邮件
                init: function() {
                    this.bindEvent();
                    this.draw();
                },
                bindEvent: function() {
                    function checkOfemailprint() {
                        var flag = false;
                        if (F.one('#uname').hasClass('err_input') || F.one('#uemail').hasClass('err_input')) {
                            flag = true;
                        }
                        var namev = F.trim(F.one('#uname').val()),
                            emailv = F.trim(F.one('#uemail').val());
                        var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        if (namev == '') {
                            F.one('#uname').addClass('err_input').html('after', '<span><em></em>请输入姓名</span>');
                            flag = true;
                        }
                        if (namev != '' && !isName(namev)) {
                            F.one('#uname').addClass('err_input').html('after', '<span><em></em>姓名格式错误</span>');
                            flag = true;
                        }
                        if (emailv == '') {
                            F.one('#uemail').addClass('err_input').html('after', '<span><em></em>请输入Email</span>');
                            flag = true;
                        }
                        if (emailv != '' && !mailReg.test(emailv)) {
                            F.one('#uemail').addClass('err_input').html('after', '<span><em></em>邮箱格式错误</span>');
                            flag = true;
                        }
                        if (flag) {
                            F.one(".saveBt").addClass('busy')
                        } else {
                            F.one(".saveBt").removeClass('busy')
                        }
                    };
                    /*姓名验证*/
                    function isName(str) {
                        var regex = /^[a-zA-Z\s\u4e00-\u9fa5]+$/

                        // 英文合格
                        if (/^[a-zA-Z\s]+$/.test(str)) {
                            return true;
                        }

                        // 中文、大于1个汉字合格。
                        if (/^[\u4e00-\u9fa5]+$/.test(str) && str.length > 1) {
                            return true;
                        }

                        // 其他不合格
                        return false;
                    };
                    F.all(".trip-obtain .btn-email", $tripBox).once("trip-grabObj", function() {
                        F.one(this).on("click", function() {
                            F.all('#uname,#uemail').val('').removeClass('err_input').next().html('remove');
                            F.one('.email_form').removeClass('none');
                            F.one('.fail_tips').addClass('none');
                            F.mPop({
                                title: "&nbsp;",
                                content: F.one(".email_pop"),
                                dragable: false,
                                width: 405
                            });
                        })
                    });
                    F.all('#uname,#uemail').once("trip-grabObj", function() {
                        F.one(this).on('focus', function() {
                            F.one(this).removeClass('err_input').next().html('remove');
                        });
                    });

                    F.all('.cancelBt,.againBt').once("trip-grabObj", function() {
                        F.one(this).on('click', function() {
                            F.mPop.close();
                            F.one('.fail_tips').addClass('none');
                            F.one('.email_form').removeClass('none');
                        });
                    })
                    F.one('.saveBt').once("trip-grabObj", function() {
                        F.one(this).on('click', function() {
                            checkOfemailprint();
                            if (F.one(this).hasClass('busy')) {
                                return;
                            }
                            if (F.one('#uname').hasClass('err_input') || F.one('#uemail').hasClass('err_input')) {
                                return;
                            } else {
                                var ajaxUrl = "/youlun/CruiseTours/CruiseToursAjax.aspx?Type=GetEmailRoute&lineid={0}&email={1}&startTime={2}&addDays={3}";
                                ajaxUrl = ajaxUrl.format(PFData.lineId, F.one('#uemail').val(), PFData.lineDate, (function() {
                                    var len = F.all(".unit-trip .trip-nav a").length;
                                    return len <= 1 ? 1 : len - 1;
                                }()));
                                F.ajax({
                                    url: ajaxUrl, // 提交地址
                                    openType: "post", // 提交懂得格式
                                    type: "string", // 返回的数据格式
                                    fn: function(data) {
                                        F.one('.saveBt').removeClass('busy');
                                        if (data) {
                                            F.mPop.close();
                                        } else {
                                            F.one('.fail_tips').removeClass('none');
                                            F.one('.email_form').addClass('none');
                                        }
                                    }
                                });

                            }
                        });
                    });
                },
                draw: function() {
                    var urlStr = "/youlun/tour/GetourToMember.aspx?lineid={0}&startTime={1}&addDays={2}";
                    urlStr = urlStr.format(PFData.lineId, PFData.lineDate, (function() {
                        var len = F.all(".unit-trip .trip-nav a").length;
                        return len <= 1 ? 1 : len - 1;
                    }()));
                    F.all(".trip-obtain .btn-print", $tripBox).attr("href", urlStr).attr("target", "_blank");
                }
            }
        });
        F.ready(function() {
            thisTripObj.init();
        })
    });
}(requirejs, fish, window, document);
