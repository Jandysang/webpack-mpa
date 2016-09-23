//页头部分
//这里的脚本关联了,邮轮介绍的relateJS，因为用同一个异步，不可以分次请求
;
! function(R, F, window, document, undefined) {
    define(["../../public/fish/js/fish.once.js", "../../public/fish/js/fish.calendar.js", "../../public/fish/js/fish.scroll.js", "../../public/fish/js/fish.spinner.js", "./tongji.js",
        "../../public/utility/js/cruise.utitlty.js", "./data.js", "./relate.js"
    ], function(once, cruiseCal, cruiseScroll, cruiseSpinner, TJObj, util, PFData, relateObj) {
        var $topBox = F.one(".pro-box");


        //当前私有对象，做成对象，便于代码阅读
        var thisTopObj = thisTopObj || {};

        F.lang.extend(thisTopObj, {
            init: function() {
                //头部所有
                this.bindEvent();
                //判断当前更多城市定位是否有更多的值
                var $local = F.one(".pro-f-local", $topBox),
                    $localMenu = F.one(".pro-f-menu", $local);
                if ($localMenu && $localMenu[0]) {
                    $local.removeClass("disabled");
                } else {
                    $local.addClass("disabled");
                }
                //收藏处理
                this.collectObj.init(); //收藏

                this.promotionObj.init(); //促销

                this.getMinPriceFn(); //获取产品最小价
                this.getTelephoneFn();

                this.cabinObj.init(); //获取舱房类型

                this.calObj.init();

            },
            bindEvent: function() {
                var that = this;
                //视频事件
                F.one(".pro-img-layer a", $topBox).once("top-thisObj", function() {
                    F.one(this).on("click", function() {
                        F.all(".dialog-video,.dialog-layer").css("display:block;");
                    });
                });
                F.all(".dialog-video .dialog-close-btn").once("top-thisObj", function() {
                    F.one(this).on("click", function() {
                        F.all(".dialog-video,.dialog-layer").css("display:none;");
                    });

                });
                F.all(".dialog-layer").once("top-thisObj", function() {
                    F.one(this).on("click", function() {
                        F.all(".dialog-video,.dialog-layer").css("display:none;");
                    });
                });
                F.one(".pro-tj a", $topBox).once("top-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $sPrice = fish.dom(".ylc-nav .ylc-special-price");
                        if ($sPrice) {
                            //$sPrice.click();
                            ylcNavObj.openTJDialog();
                            //下面是统计代码统计代码
                            fish.ajax({ url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseDetailPageWindowStatistic&value=FinalPageClick" });
                        }
                    });
                });


                F.all(".pro-recomm-box-recommend-txt").once("top-thisObj", function() {
                    var __html = F.one(this).html();
                    __html = that.escape2Html(__html);
                    F.one(this).html(__html);
                })
                F.all(".pro-recomm-box-recommend").once("top-thisObj", function() {
                    var $recommBox = F.one(this),
                        Hei = $recommBox.height();
                    $recommBox.attr("h-attr", Hei).css("height:40px;");
                    F.all("em,p", $recommBox).on("click", function() {
                        if ($recommBox.hasClass("show")) {
                            $recommBox.removeClass("show").anim("height:40px;", 500);
                            cruiseScroll.update();
                        } else {
                            $recommBox.addClass("show").anim("height:" + Hei + "px;", 500);
                            cruiseScroll.update();
                        }
                    })
                })
            },
            escape2Html: function(str) {
                var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
                return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
                    return arrEntities[t];
                });
            },
            //获取产品最小价
            getMinPriceFn: function() {
                //给邮轮公共导航条 --特价预约添加最低价格
                function setTJPrice(__p) {
                    var _$input = F.one(".ylc-modal .eve_yusuan input");
                    if (_$input && _$input[0] && parseInt(_$input.val(), 10) <= 0 && __p) {
                        _$input.val(__p);
                        _$input.attr("_placeholder", __p);
                    }
                }
                F.ajax({
                    url: "/youlun/AjaxCall_Cruise.aspx?Type=GetFinalPrice&lineid={0}&saildate={1}".format(PFData.lineId, PFData.lineDate),
                    type: "json",
                    fn: function(data) {
                        thisTopObj.spinObj.DATA = thisTopObj.spinObj.DATA || {};
                        if (data && data["calPrice"]) {
                            setTJPrice(data["calPrice"]); //给邮轮公共导航条 --特价预约添加最低价格

                            F.one(".pro-price span", $topBox).html("<strong>&yen;" + data["calPrice"] + "</strong>起");
                            F.lang.extend(thisTopObj.spinObj.DATA, { price: data["calPrice"] });
                            var urlStr = "/youlun/linebook/" + PFData.lineId + "_" + PFData.lineDate + ".html"
                            F.one(".pro-book-btn", $topBox).attr("href", urlStr).attr("target", "_blank").removeClass("disabled").html("立即预订");
                            F.one(".nav-box .nav-book-info a").attr("href", urlStr).attr("target", "_blank").removeClass("disabled").html("立即预订");
                            TJObj.add(F.all(".nav-box .nav-book-info a,.pro-box .pro-book .pro-book-btn"));
                        } else {
                            F.one(".pro-price strong", $topBox).html("已售罄");
                            F.one(".pro-book-btn", $topBox).html("已售罄");
                            F.one(".nav-box .nav-book-info a").html("已售罄");
                            F.lang.extend(thisTopObj.spinObj.DATA, { price: 0 });
                        }
                        thisTopObj.spinObj.draw.call(thisTopObj.spinObj);
                    }
                })
            },
            getTelephoneFn: function() {
                var urlStr = "http://www.ly.com/AjaxHelper/TopLoginHandler.aspx?channel=YouLun&action=getTelephone",
                    ref = util.getUrlParam("refid") || "0";
                F.ajax({
                    url: urlStr,
                    data: "&asyncRefid=" + ref,
                    type: "jsonp",
                    fn: function(data) {
                        var phone = data.telephone;
                        F.one(F.all(".pro-book span p", $topBox)[1]).html(phone);
                        F.one(".nav-box .nav-book-info span").html("找客服帮你订：" + phone);
                    },
                    err: function() {
                        var phone = "4007-740-075";
                        F.one(F.all(".pro-book span p", $topBox)[1]).html(phone);
                        F.one(".nav-box .nav-book-info span").html("找客服帮你订：" + phone);
                    }
                })
            },
            cabinObj: {
                init: function() {
                    this.draw();
                },
                draw: function() {
                    var $roomBox = F.one(".pro-diff", $topBox),
                        tempStr2 = F.trim(F.one("script.template2").html()),
                        tempStr = F.trim(F.one("script.template").html()),
                        str2 = "",
                        data = this.DATA,
                        that = this,
                        promotionCount = 0,
                        giftStr = "",
                        promotionArr = [],
                        flag = false; //为真时，不显示所有房型
                    if (!data) {
                        this.load();
                        return false;
                    }
                    util.forEach(data["RoomInfo"] || [], function(index, item) {
                        promotionArr = [];
                        str2 += tempStr2.format(
                            (function() {
                                //截取前6个字
                                var __name = item["CruiseCabinName"] || "";
                                return __name.length > 6 ? __name.slice(0, 6) + "..." : __name;
                            }()),
                            item["RoomTypeInfo"].length + "种房型",
                            "&yen;" + item["MinPrice"] + "起/人",
                            (function() {
                                var _str = "",
                                    _item = item["RoomTypeInfo"][0],
                                    _promotionCount = 0;
                                util.forEach(item["RoomTypeInfo"] || [], function(_i, _t) {
                                    if (_t["PromotionInfo"].length) {
                                        promotionCount += 1;
                                        _promotionCount += 1;
                                        if (_t["PromotionInfo"][0]["PromotionDesc"].length) {
                                            var promotionObj = { promotionName: "", promotionPrice: 0 };
                                            promotionObj["promotionName"] = item["RoomTypeInfo"][_i]["RoomTypeName"],
                                                promotionObj["promotionPrice"] = _t["PromotionInfo"][0]["PromotionDesc"];
                                            promotionArr.push(promotionObj);
                                        }
                                    }
                                    util.forEach(_t["GiftList"] || [], function(__i, __t) {
                                        giftStr += "<p>{0}至{1}预订指定舱房，{2}</p>".format(F.parseTime(__t["ProRuleBeginTime"]), F.parseTime(__t["ProRuleEndTime"]), __t["Title"]);
                                    });

                                });
                                if (!_item) return _str;

                                if (promotionCount && promotionArr.length > 0) {
                                    _str += promotionArr[0]["promotionName"];
                                    _str += promotionArr[0]["promotionPrice"];
                                    if (_promotionCount > 0) {
                                        _str += "等" + _promotionCount + "种优惠";
                                    }
                                } else {
                                    _str = "";
                                }
                                return _str;
                            }())
                        );
                    });

                    relateObj.draw.call(F.lang.extend(relateObj, { DATA: that.DATA }));

                    if (!str2.length) {
                        return false;
                    }
                    if (giftStr.length) {
                        F.one(".pro-feat .pro-feat-inner", $topBox).html("bottom", "<a href='javascript:;'>礼包<div class='pro-feat-more'><i></i>" + giftStr + "</div></a>");
                    }

                    flag = PFData.tourType == 0;
                    flag = flag && data["RoomInfo"] && data["RoomInfo"].length <= 1;
                    if (!flag) {
                        $roomBox.html("bottom", tempStr.format(
                            promotionCount ? "<em>惠</em>" : "",
                            data["RoomInfo"] && data["RoomInfo"].length ? "共" + data["RoomInfo"].length + "种房型" : "",
                            promotionCount ? promotionCount + "个优惠" : "",
                            str2,
                            (PFData.isUsedPriceInland == 1 ? "/youlun/linebookinland/{0}_{1}.html" : "/youlun/linebook/{0}_{1}.html").format(PFData.lineId, PFData.lineDate),
                            "target='_blank'",
                            promotionCount ? "查看全部房型和优惠" : "查看全部房型"
                        ));
                    } else {
                        if (data["RoomInfo"] && data["RoomInfo"].length == 1 && data["RoomInfo"][0] && data["RoomInfo"][0]["RoomTypeInfo"].length == 1) {
                            thisTopObj.spinObj.DATA = thisTopObj.spinObj.DATA || {};
                            F.lang.extend(thisTopObj.spinObj.DATA, { RoomInfo: data["RoomInfo"] });
                            thisTopObj.spinObj.draw.call(thisTopObj.spinObj);
                        }
                    }
                    TJObj.add(F.all(".pro-sale .pro-diff-more", $topBox));
                },
                load: function() {
                    var that = this;
                    if (this.ajaxObj) this.ajaxObj.abort();
                    this.ajaxObj = F.ajax({
                        url: "/youlun/cruisetours/tours.ashx?type=GetLineRoomInfo&lineId={0}&lineDate={1}".format(PFData.lineId, PFData.lineDate),
                        type: "json",
                        fn: function(data) {
                            if (data) {
                                that.DATA = data;
                                that.draw();
                            } else {
                                R(["pc_final_relate"], function(relateObj) {
                                    relateObj.draw.call(F.lang.extend(relateObj, { DATA: { RoomInfo: [] } }));
                                });
                            }
                        }
                    })
                }
            },
            collectObj: { //有关收藏的一些操作
                init: function() {
                    this.$collectBtn = F.one(".pro-f-collect", $topBox);
                    this.isCollectFn();
                    this.bindEvent();
                },
                isCollectFn: function(fn) { //判断是否收藏，回调函数是用于未登录，登录后的操作
                    var that = this;
                    F.ajax({
                        url: "/youlun/MemberFavoritesHandler.ashx?type=searchnew&productId={0}".format(PFData.lineId),
                        type: "json",
                        fn: function(data) {
                            if (data && data["ResultFlag"] == true) {
                                that.$collectBtn.addClass("has-crt");
                            } else {
                                that.$collectBtn.removeClass("has-crt");
                            }
                            if (fn && util.isFunction(fn)) {
                                fn.call(this, data)
                            }
                        }
                    });
                },
                addCollectFn: function() {
                    var that = this;
                    F.ajax({
                        url: "/youlun/MemberFavoritesHandler.ashx?type=Addnew&productId={0}".format(PFData.lineId),
                        type: "json",
                        fn: function(data) {
                            if (data && data["ResultFlag"] == true) {
                                that.$collectBtn.addClass("has-crt");
                            }
                        }
                    });
                },
                delCollectFn: function() {
                    var that = this;
                    F.ajax({
                        url: "/youlun/MemberFavoritesHandler.ashx?type=Delete&favoriteId={0}".format(PFData.lineId),
                        type: "json",
                        fn: function(data) {
                            if (data && data["ResultFlag"] == true) {
                                that.$collectBtn.removeClass("has-crt");
                            }
                        }
                    });
                },
                bindEvent: function() {
                    var that = this; //
                    this.$collectBtn.once("top-collectObj", function() {
                        F.one(this).on("click", function() {
                            that.memberId = F.cookie.get("cnUser", "userid") || F.cookie.get("us", "userid") || 0;
                            if (!that.memberId) {
                                that.loginFn(function(data) {
                                    if (data && data["ResultFlag"] != true) {
                                        that.addCollectFn();
                                    };
                                });
                            } else {
                                if (F.one(this).hasClass("has-crt")) { //已收藏-取消收藏 
                                    that.delCollectFn();
                                } else { //未收藏--新增收藏
                                    that.addCollectFn();
                                }
                            }
                        });
                    })
                },
                loginFn: function(fn) {
                    var that = this;
                    that.memberId = F.cookie.get("cnUser", "userid") || F.cookie.get("us", "userid") || 0;
                    F.admin.config({
                        mLogin: { v: "2.0", css: "2.0", g: 20160718 }
                    });
                    if (!this.memberId) {
                        F.require("mLogin", function() {
                            F.mLogin({
                                unReload: true,
                                maskClose: true,
                                loginSuccess: function() {
                                    that.memberId = F.cookie.get("cnUser", "userid") || F.cookie.get("us", "userid") || 0;
                                    //that.logined = true;
                                    that.isCollectFn(fn);
                                }
                            })
                        });
                    } else {
                        that.isCollectFn(fn);
                    }
                }
            },
            //促销专题
            promotionObj: {
                init: function() {
                    this.isPromotionFn();
                },
                isPromotionFn: function() {
                    F.ajax({
                        url: "/youlun/cruisetours/tours.ashx?type=CruiseLineIdInTopic&TopicId={0}&lineId={1}&LineDate={2}&ModuleId={3}".format(PFData.topicId, PFData.lineId, PFData.lineDate, PFData.moduleId),
                        type: 'json',
                        fn: function(data) {
                            if (data && data["LineIn"] == 1) {
                                var $act = F.one(".pro-box .pro-right .pro-act"),
                                    $actBtn = F.one("a", $act);
                                $actBtn.attr("href", "/youlun/tours-{0}-{1}-{2}.html?lid=399".format(PFData.lineId, PFData.topicId, data["ModuleId"]));
                                $actBtn.attr("target", "_blank");
                                $act.removeClass("none");
                            }
                        }
                    });
                }
            },
            calObj: {
                init: function() {
                    this.draw();
                    this.bindEvent();
                },
                bindEvent: function() {
                    var that = this;
                    F.one(".pro-st-btn", $topBox).once("top-calObj", function() {
                        F.one(this).on("click", function() {
                            var $this = F.one(this);
                            if ($this.hasClass("loading") || $this.hasClass("disabled")) return false;
                            F.one(".pro-cal-box", $topBox).css("display:block;");
                        });
                    });


                    F.one(document).once("top-calObj", function() {
                        F.one(this).on("click", function(e) {
                            var $tar = F.one(F.getTarget(e));
                            if ($tar.hasClass("pro-st-btn")) return false;
                            if ($tar.hasClass("pro-cal-box")) return false;
                            if ($tar.parent(".pro-cal-box").length) return false;
                            F.one(".pro-cal-box", $topBox).css("display:none;");
                        })
                    });

                    F.one(".pro-cal-next", $topBox).once("top-calObj", function() {
                        F.one(this).on("click", function() {
                            var $this = F.one(this),
                                $wrap = F.one(".pro-cal-headwrap", $topBox),
                                $box = F.one("div", $wrap),
                                $btns = F.all("a", $box),
                                i = parseInt($box.attr("i-attr"), 10);
                            if ($wrap.hasClass("Animing")) return false;
                            $box.css("width:" + ($btns.width() * $btns.length) + "px;");
                            i = isNaN(i) ? 0 : i < 0 ? 0 : i;
                            if (i + 5 > $btns.length) {
                                $this.addClass("disabled");
                                return false;
                            }
                            $wrap.addClass("Animing");
                            $box.anim("left:-" + ($btns.width() * (i + 1)) + "px;", 400, function() {
                                $wrap.removeClass("Animing");
                                if (i + 6 > $btns.length) {
                                    $this.addClass("disabled");
                                }
                                $box.attr("i-attr", i + 1);
                                F.one(".pro-cal-prev", $topBox).removeClass("disabled");
                            });
                        })
                    });
                    F.one(".pro-cal-prev", $topBox).once("top-calObj", function() {
                        F.one(this).on("click", function() {
                            var $this = F.one(this),
                                $wrap = F.one(".pro-cal-headwrap", $topBox),
                                $box = F.one("div", $wrap),
                                $btns = F.all("a", $box),
                                i = parseInt($box.attr("i-attr"), 10);
                            if ($wrap.hasClass("Animing")) return false;
                            i = isNaN(i) ? 0 : i < 0 ? 0 : i;
                            if (i <= 0) {
                                $this.addClass("disabled");
                                return false;
                            }
                            $wrap.addClass("Animing");
                            $box.anim("left:-" + ($btns.width() * (i - 1)) + "px;", 400, function() {
                                $wrap.removeClass("Animing");
                                if (i <= 1) {
                                    $this.addClass("disabled");
                                }
                                $box.attr("i-attr", i - 1);
                                F.one(".pro-cal-next", $topBox).removeClass("disabled");
                            });
                        })
                    });
                    F.all(".pro-cal-headwrap div a", $topBox).once("top-calObj", function() {
                        F.one(this).on("click", function() {
                            var $this = F.one(this);
                            if ($this.hasClass("crt-at")) return false;
                            F.all(".pro-cal-headwrap div a", $topBox).removeClass("crt-at");
                            $this.addClass("crt-at");
                            that.draw($this.attr("t-attr") + "-1");
                        });
                    });
                },
                draw: function(timeStr) {

                    var data = this.DATA,
                        $box = F.one(".pro-cal-box", $topBox),
                        $headBox = F.one(".pro-cal-headwrap div", $box),
                        str = "",
                        $calBtn = F.one(".pro-st-btn", $topBox),
                        that = this;

                    if (!this.Cal && !timeStr) {
                        $calBtn.addClass("loading");
                    }
                    if (!data) {
                        this.load();
                        return false;
                    }
                    if (!this.Cal && !timeStr) {
                        $calBtn.removeClass("loading");
                        data = data["initData"];
                        str = "";
                        util.forEach(data["MonthInfo"] || [], function(index, item) {

                            str += "<a class='{0}' {2} href='javascript:;'>{1}</a>".format(
                                (function() {
                                    var itemTime = F.parseDate(item + "-01").getTime(),
                                        lineTime = PFData.lineDate.split("-").slice(0, 2).join("-");
                                    lineTime += "-01";
                                    lineTime = F.parseDate(lineTime).getTime();
                                    if (lineTime == itemTime) return "crt-at";
                                    return "";
                                }()),
                                item.split("-").join("年") + "月",
                                "t-attr='" + item + "'"
                            )
                        })
                        if ((!data["MonthInfo"] || !data["LineInfo"]) || (data["MonthInfo"].length <= 1 && data["LineInfo"].length <= 1)) {
                            $calBtn.addClass("disabled");
                        }
                        if (!data["MonthInfo"] || data["MonthInfo"].length <= 4) {
                            F.one(".pro-cal-next", $topBox).addClass("disabled");
                        }
                        $headBox.html(str);
                    } else {
                        data = data[timeStr];
                        if (!data) {
                            this.load(timeStr);
                            return false;
                        }
                        if (this.Cal) {
                            this.Cal.skip(F.parseDate(timeStr));
                            return false;
                        }
                    }

                    this.Cal = new cruiseCal($box, {
                        optimCurrentMonth: false,
                        currentTime: timeStr || PFData.lineDate,
                        callback: function() {
                            that.bindEvent();
                        },
                        drawUnit: function(cal, elem) {
                            that.drawUnit.call(that, cal, elem, timeStr);
                        },
                        template: "<div class='{{-ui-calendar-}}'><ul class='{{-ui-calendar-head-}}'>{{_palceholder_repeat_head_s_}}" +
                            "<li class='{{_palceholder_day_class_}}'>{{_palceholder_head_item_}}</li>{{_palceholder_repeat_head_e_}}" +
                            "</ul><div class='{{-ui-calendar-body-}}'>{{_palceholder_repeat_month_s_}}{{_palceholder_repeat_week_s_}}" +
                            "<ul>{{_palceholder_repeat_date_s_}}<li class='{{-ui-calendar-out-of-month-}} {{_palceholder_day_class_}}'>" +
                            "{{_palceholder_repeat_unit_s_}}<a herf='javascript:;' class='{{-ui-calendar-disabled ui-calendar-enabled-}}' {{_palceholder_date_attr}}>" +
                            "<p class='{{-ui-calendar-date-}}'>{{_palceholder_date_item_}}</p><div class='{{-ui-calendar-data clearfix-}}'></div></a>" +
                            "{{_palceholder_repeat_unit_e_}}</li>{{_palceholder_repeat_date_e_}}</ul>{{_palceholder_repeat_week_e_}}" +
                            "{{_palceholder_repeat_month_e_}}</div></div>"
                    });
                },
                drawUnit: function(cal, elem, timeStr) {
                    elem = F.one(elem);
                    var key = F.parseTime(elem.attr("date-attr")),
                        date = F.parseDate(key),
                        data = this._DATA,
                        index, arr = this.Arr,
                        _data;
                    index = arr.indexOf(key);
                    if (index >= 0) {
                        _data = data[index];
                        F.one(".ui-calendar-data", elem).html("<em>{0}</em><span>&yen;{1}起</span>".format(
                            (function() {
                                var __str = "";
                                if (_data["IsShowBaoChuaIcon"] == 1) __str += "<i>包船</i>";
                                if (_data["IsTeHui"] == 1) __str += "<i>惠</i>";
                                return __str;
                            }()),
                            _data["OnLinePrice"]
                        ));
                        if (date.getTime() != F.parseDate(PFData.lineDate).getTime()) {
                            elem.attr("href", "/youlun/final-{0}_{1}.html{2}".format(_data.LineId, key, (function() {
                                var __str = "";
                                if (util.getUrlParam("lid")) {
                                    __str += "?lid=" + util.getUrlParam("lid");
                                }
                                return __str;
                            }())));
                        }
                        elem.addClass("ui-calendar-enabled").removeClass("ui-calendar-disabled");
                    } else {
                        elem.removeClass("ui-calendar-enabled").addClass("ui-calendar-disabled");
                    }
                    if (date.getDate() == 1) {
                        elem.html("after", "<p class='ui-calendar-mph'>" + (date.getMonth() + 1) + "</p>");
                    }
                },
                load: function(timeStr) {
                    var that = this;
                    if (this.ajaxObj) this.ajaxObj.abort();
                    this.ajaxObj = F.ajax({
                        url: "/youlun/cruisetours/tours.ashx?type=GetLineDetailCalendar&CruiseId={0}&date={1}&ProductType={2}&LineId={3}&TourType={4}".format(PFData.cruiseId, timeStr || PFData.lineDate, PFData.productType, PFData.lineId, PFData.tourType),
                        type: "json",
                        fn: function(data) {
                            if (data) {
                                that.DATA = that.DATA || {};
                                that._DATA = that._DATA || [];
                                that.Arr = that.Arr || [];
                                that.DATA["initData"] = data;
                                if (!timeStr) {
                                    var key = F.parseTime(PFData.lineDate);
                                    key = key.split("-").slice(0, 2);
                                    key.push(1);
                                    key = key.join("-");
                                    that.DATA[key] = data["LineInfo"] || [];
                                    that._DATA = that._DATA.concat(data["LineInfo"] || []);
                                    util.forEach(data["LineInfo"] || [], function(index, item) {
                                        that.Arr.push(F.parseTime(item.LineDate))
                                    });
                                } else {
                                    that.DATA[timeStr] = data["LineInfo"] || [];
                                    that._DATA = that._DATA.concat(data["LineInfo"] || []);
                                    util.forEach(data["LineInfo"] || [], function(index, item) {
                                        that.Arr.push(F.parseTime(item.LineDate))
                                    });
                                }
                                that.draw(timeStr);
                            }
                        }
                    })
                }
            },
            spinObj: {
                init: function() {},
                draw: function() {
                    var $spin = F.one(".pro-spinner", $topBox),
                        $spins = F.all(".pro-spinner-box", $spin),
                        num,
                        $btns = F.all(".nav-box .nav-book-info a,.pro-box .pro-book .pro-book-btn"),
                        that = this;
                    if (data = this.DATA);
                    if (!(data && typeof(data["price"]) === "number" &&
                            data["RoomInfo"] && data["RoomInfo"].length == 1 && data["RoomInfo"][0]["RoomTypeInfo"])) return false;
                    if (data["price"] <= 0) return false;
                    $spin.removeClass("none");
                    num = data["RoomInfo"][0]["RoomTypeInfo"][0]["RoomPersonNum"];
                    maxNum = data["RoomInfo"][0]["RoomTypeInfo"][0]["RemainStockNum"];
                    if (maxNum == -1) {
                        maxNum = 99;
                    } else {
                        maxNum = maxNum * num;
                        maxNum = maxNum >= 99 ? 99 : maxNum;
                    }

                    this.adultSpin = new F.spinner(F.one($spins[0]), {
                        name: "adult-spinner",
                        min: num,
                        max: maxNum,
                        value: num,
                        change: function() {
                            var cSpin = that["childSpin"];
                            if (!cSpin) return false;
                            cSpin.opts.max = this.get();
                            cSpin.reset.call(cSpin, cSpin.opts);
                        }
                    });
                    this.childSpin = new F.spinner(F.one($spins[1]), {
                        name: "child-spinner",
                        min: 0,
                        max: num,
                        value: 0,
                        change: function() {
                            var aSpin = that["adultSpin"],
                                selfSpin = this;
                            if (!aSpin) return false;
                            F.ajax({
                                url: "/youlun/AjaxCallNew.aspx?type=GetDesForPriceList&pricelist={0}:{1}:{2}:{3}".format(PFData.isUsedPriceInland == 1 ? data["RoomInfo"][0]["RoomTypeInfo"][0]["roomTypeId"] : data["RoomInfo"][0]["RoomTypeInfo"][0]["PriceId"], aSpin.get(), this.get(), (function() {
                                    var rooms = aSpin.opts.min,
                                        adults = aSpin.get(),
                                        childs = selfSpin.get();
                                    return Math.ceil((adults + childs) / rooms);
                                }())),
                                fn: function(__d) {
                                    $btns.attr("href", "/youlun/{3}.aspx?id={0}&bookdate={1}&pricelist={2}".format(PFData.lineId, PFData.lineDate, encodeURIComponent(__d), PFData.isUsedPriceInland == 1 ? "bookinland" : "book"));
                                    TJObj.add($btns);
                                }
                            });

                        },
                        init: function() {
                            var selfSpin = this;
                            F.ajax({
                                url: "/youlun/AjaxCallNew.aspx?type=GetDesForPriceList&pricelist={0}:{1}:{2}:{3}".format(PFData.isUsedPriceInland == 1 ? data["RoomInfo"][0]["RoomTypeInfo"][0]["roomTypeId"] : data["RoomInfo"][0]["RoomTypeInfo"][0]["PriceId"], that.adultSpin.get(), this.get(), (function() {
                                    var rooms = that.adultSpin.opts.min,
                                        adults = that.adultSpin.get(),
                                        childs = selfSpin.get();
                                    return Math.ceil((adults + childs) / rooms);
                                }())),
                                fn: function(__d) {
                                    $btns.attr("href", "/youlun/{3}.aspx?id={0}&bookdate={1}&pricelist={2}".format(PFData.lineId, PFData.lineDate, encodeURIComponent(__d), PFData.isUsedPriceInland == 1 ? "bookinland" : "book"));
                                    TJObj.add($btns);
                                }
                            });

                        }
                    });
                }
            }
        });

        F.ready(function() {
            //初始化绑定事件
            thisTopObj.init();

        });
        define([], function() {
            return thisTopObj;
        });
        return thisTopObj;
    });

}(requirejs, fish, window, document);
