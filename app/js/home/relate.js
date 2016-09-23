//邮轮介绍
;
! function(R, F, window, document, undefined) {
    define([ "../../public/fish/js/fish.once.js", "./tongji.js", "../../public/utility/js/cruise.utitlty.js", "./data.js", "./common.js"], function(once, TJObj, util, PFData, PFCommon) {
        var thisRelateObj = thisRelateObj || {};
        var $relateBox = F.one(".unit-relate");
        F.lang.extend(thisRelateObj, {
            init: function() {
                this.bindEvent();
                this.reset();
            },
            bindEvent: function() {
                var $tabBtns = F.all(".relate-pro-tabs a", $relateBox);
                $tabBtns.once("relate-thisObj", function(elem, index) {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $conts = F.all(".relate-pro-conts .relate-pro-cont", $relateBox);
                        if ($this.hasClass("crt-at")) return false;
                        F.all(".relate-pro-tabs a", $relateBox).removeClass("crt-at");
                        $this.addClass("crt-at");
                        $conts.addClass("none");
                        F.one($conts[index]).removeClass("none");
                    })
                });
                F.all(".relate-pro-prev", $relateBox).once("relate-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $unitWrap = $this.parent(".relate-pro-cont"),
                            $unitBox = F.one(".relate-pro-unit ul", $unitWrap);
                        if ($this.hasClass("disabled")) return false;
                        if ($unitBox.hasClass("Animing")) return false;
                        index = parseInt($unitBox.attr("index-attr"), 10);
                        index = isNaN(index) ? 0 : index < 0 ? 0 : index;
                        if (index <= 0) return false;
                        $unitBox.addClass("Animing");
                        $unitBox.anim("left:-" + (270 * (index - 1)) + "px;", 300, function() {
                            $unitBox.removeClass("Animing");
                            $unitBox.attr("index-attr", index - 1);
                            if (index <= 1) {
                                $this.addClass("disabled");
                            }
                            F.one(".relate-pro-next", $unitWrap).removeClass("disabled");
                        });
                    });
                });
                F.all(".relate-pro-next", $relateBox).once("relate-thisObj", function() {
                    F.one(this).on("click", function() {
                        var $this = F.one(this),
                            $unitWrap = $this.parent(".relate-pro-cont"),
                            $unitBox = F.one(".relate-pro-unit ul", $unitWrap),
                            $units = F.all("li", $unitBox),
                            index;
                        if ($this.hasClass("disabled")) return false;
                        if ($unitBox.hasClass("Animing")) return false;
                        index = parseInt($unitBox.attr("index-attr"), 10);
                        index = isNaN(index) ? 0 : index < 0 ? 0 : index;
                        if (index + 4 >= $units.length) return false;
                        $unitBox.addClass("Animing");
                        $unitBox.anim("left:-" + (270 * (index + 1)) + "px;", 300, function() {
                            $unitBox.removeClass("Animing");
                            $unitBox.attr("index-attr", index + 1);
                            if (index + 5 >= $units.length) {
                                $this.addClass("disabled");
                            }
                            F.one(".relate-pro-prev", $unitWrap).removeClass("disabled");
                        });
                    });
                });
            },
            asyncBindEvent: function() {
                F.all(".relate-pro-cont li", $relateBox).once("relate-thisObj", function() {
                    var $this = F.one(this);
                    if ($this.hasClass("package")) return;
                    $this.on("click", function(e) {
                        var target = F.getTarget(e),
                            $contBox = F.one(".relate-pro-conts", $relateBox),
                            tempStr1 = F.one("script.template1", $contBox).html(),
                            tempStr2 = F.one("script.template2", $contBox).html(),
                            str = "";
                        if ($this.hasClass("cabinintro")) {
                            if (F.one(target).hasClass("btn")) return;
                            str += tempStr1.format(
                                $this.attr("attr-img") ? "<div class='img-box'>" + $this.attr("attr-img") + "</div>" : "",
                                $this.attr("attr-name"),
                                (function() {
                                    var ___str = "",
                                        ___str1 = "",
                                        ___arr = $this.attr("attr-state").split("|");
                                    if ($this.attr("attr-proportion")) {
                                        ___str += "<dl><dt><i class='icon icon_proportion'></i>房间面积</dt><dd>" + $this.attr("attr-proportion") + "m²</dd></dl>";
                                    }
                                    if ($this.attr("attr-personrange")) {
                                        ___str += "<dl><dt><i class='icon icon_personrange'></i>入住人数</dt><dd>" + $this.attr("attr-personrange") + "人</dd></dl>";
                                    }
                                    if (___arr[0] == 1) {
                                        ___str1 += "有窗";
                                    } else if (___arr[0] == 2) {
                                        ___str1 += "无窗";
                                    } else if (___arr[0] == 3) {
                                        ___str1 += "部分有窗";
                                    }
                                    if (___arr[1] == 1) {
                                        ___str1 += "，有阳台";
                                    } else if (___arr[1] == 2) {
                                        ___str1 += "，无阳台";
                                    } else if (___arr[1] == 3) {
                                        ___str1 += "，部分有阳台";
                                    }
                                    ___str += "<dl><dt><i class='icon icon_state'></i>窗户/阳台</dt><dd>" + ___str1 + "</dd></dl>";
                                    if ($this.attr("attr-floor")) {
                                        ___str += "<dl><dt><i class='icon icon_floor'></i>楼层</dt><dd>" + $this.attr("attr-floor") + "</dd></dl>";
                                    }
                                    return ___str;
                                }()),
                                $this.attr("attr-price"),
                                $this.attr("attr-stocknum") == 0 ? "" : "<a href='/youlun/linebook/" + PFData.lineId + "_" + PFData.lineDate + ".html' target='_blank'>预订</a>",
                                (function() {
                                    var ___str = "";
                                    if (F.trim($this.attr("attr-intro"))) {
                                        ___str += "<div class='introbox'><h3>舱房介绍</h3><p>" + F.trim($this.attr("attr-intro")) + "</p></div>";
                                    }
                                    if (F.trim($this.attr("attr-facility"))) {
                                        ___str += "<div class='introbox'><h3>舱房设施</h3><p>" + F.trim($this.attr("attr-facility")) + "</p></div>";
                                    }
                                    if (F.trim($this.attr("attr-server"))) {
                                        ___str += "<div class='introbox'><h3>专享礼遇</h3><p>" + F.trim($this.attr("attr-server")) + "</p></div>";
                                    }
                                    return ___str;
                                }())
                            )
                            F.one("#dialog-box", $relateBox).html(str);
                            F.all(".relate-pro-box,.relate-layer").css("display:block;");
                        } else {
                            str += tempStr2.format(
                                (function() {
                                    var ___str = "",
                                        imgArr = $this.attr("attr-img") ? $this.attr("attr-img").split(",") : "";
                                    if (imgArr) {
                                        var __length = imgArr.length;
                                        ___str += "<div class='img-box'><ul attr-num='1' attr-maxnum='" + __length + "' style='width:" + __length * 280 + "px;'>";
                                        for (var i = 0; i < __length; i++) {
                                            ___str += "<li><img src='" + imgArr[i] + "' /></li>";
                                        }
                                        if (imgArr.length > 1) {
                                            ___str += "</ul><div class='sliderBox'><span class='numBox'></span><span class='num'><em>1</em>/" + __length + "</span><span class='sliderBtn prevBtn not'></span><span class='sliderBtn nextBtn'></span></div></div>";
                                        } else {
                                            ___str += "</ul></div>";
                                        }
                                    }
                                    return ___str;
                                }()),
                                $this.attr("attr-name"),
                                (function() {
                                    var ___str = "";
                                    if ($this.attr("attr-clothes")) {
                                        ___str += "<dl><dt><i class='icon icon_clothes'></i>着装建议</dt><dd>" + $this.attr("attr-clothes") + "</dd></dl>";
                                    }
                                    if ($this.attr("attr-free")) {
                                        ___str += "<dl><dt><i class='icon icon_free'></i>是否免费</dt><dd>" + $this.attr("attr-free") + "</dd></dl>";
                                    }
                                    if ($this.attr("attr-floor")) {
                                        ___str += "<dl><dt><i class='icon icon_floor'></i>楼层信息</dt><dd>" + $this.attr("attr-floor") + "层</dd></dl>";
                                    }
                                    return ___str;
                                }()),
                                (function() {
                                    var ___str = "";
                                    if (F.trim($this.attr("attr-intro"))) {
                                        ___str += "<div class='introbox'><h3>简介</h3><p>" + F.trim($this.attr("attr-intro")) + "</p></div>";
                                    }
                                    return ___str;
                                }())
                            );
                            F.one("#dialog-box", $relateBox).html(str);
                            F.all(".sliderBtn", $relateBox).once("relate-thisObj", function() {
                                F.one(this).on("click", function() {
                                    var __parent = F.one(this).parent(".sliderBox"),
                                        __prev = __parent.previous(),
                                        currentNum = parseInt(__prev.attr("attr-num"), 10),
                                        maxNum = parseInt(__prev.attr("attr-maxnum"), 10);
                                    if (F.one(this).hasClass("not")) {
                                        return false;
                                    } else if (F.one(this).hasClass("prevBtn")) {
                                        currentNum--;
                                        F.one("em", __parent).html(currentNum);
                                        __prev.attr("attr-num", currentNum).anim("left:" + (1 - currentNum) * 280 + "px;", 500);
                                        if (currentNum == 1) {
                                            F.one(this).addClass("not");
                                        }
                                        F.one(this).next().removeClass("not");
                                    } else if (F.one(this).hasClass("nextBtn")) {
                                        currentNum++;
                                        F.one("em", __parent).html(currentNum);
                                        __prev.attr("attr-num", currentNum).anim("left:" + (1 - currentNum) * 280 + "px;", 500);
                                        if (currentNum == maxNum) {
                                            F.one(this).addClass("not");
                                        }
                                        F.one(this).previous().removeClass("not");
                                    }
                                })
                            });
                            F.all(".relate-pro-box,.relate-layer").css("display:block;");
                        }
                    })
                });
                F.all(".relate-pro-box").delegate(".dialog-close-btn", "click", function() {
                    F.all(".relate-pro-box,.relate-layer").css("display:none;");
                })
                F.all(".relate-layer").once("relate-thisObj", function() {
                    F.one(this).on("click", function() {
                        F.all(".relate-pro-box,.relate-layer").css("display:none;");
                    });
                });
            },
            reset: function() {
                var $contBox = F.one(".relate-pro-conts", $relateBox),
                    $conts = F.all(".relate-pro-cont", $contBox);
                $conts.each(function(elem, index) {
                    elem = F.one(elem);
                    var $unitBox = F.one(".relate-pro-unit ul", elem),
                        $units = F.all("li", $unitBox),
                        $prev = F.one(".relate-pro-prev", elem),
                        $next = F.one(".relate-pro-next", elem),
                        index;
                    $unitBox.css("width:" + (270 * $units.length) + "px");
                    index = parseInt($unitBox.attr("index-attr"), 10);
                    index = isNaN(index) ? 0 : index < 0 ? 0 : index;
                    if (index > 0) {
                        $prev.removeClass("disabled");
                    } else {
                        $prev.addClass("disabled");
                    }
                    if (index + 4 < $units.length) {
                        $next.removeClass("disabled");
                    } else {
                        $next.addClass("disabled");
                    }
                });
            },
            draw: function() {
                var that = this,
                    data = this.DATA;
                if (!data) {
                    this.load();
                    return false;
                }
                var $contBox = F.one(".relate-pro-conts", $relateBox),
                    $cont = F.one(".relate-pro-cabin", $contBox),
                    tempStr = F.one("script.template", $cont).html(),
                    $btn = F.one(".relate-pro-tabs a", $relateBox),
                    str = "";
                if (!F.dom($cont)) return false;
                dataRoom = data["RoomInfo"] || [];
                if (dataRoom.length) {
                    var dataPackage = data["PackageInfo"] || [],
                        length = 0,
                        num = 0;
                    if (dataPackage && dataPackage[0]) {
                        length = dataRoom.length + 1;
                        util.forEach(dataPackage, function(index, item) {
                            num += item["StockQuantity"];
                        });
                        str += tempStr.format(
                            dataPackage[0]["CruisePackageRoomInfo"][0]["ImageUrl"], //0
                            "套餐特惠", //1
                            "套餐特惠", //2
                            (function() {
                                return "{0}种套餐".format(dataPackage.length);
                            }()), //3
                            (function() {
                                var temp = '<div><p>套餐{0}：可住{1}人</p><span>{2}</span></div>',
                                    _str = '';
                                util.forEach(dataPackage.slice(0, 2), function(index, item) {
                                    _str += temp.format(
                                        PFCommon.toFixChineseNum(index + 1),
                                        item["RoomPersonNum"],
                                        item["DiscountPrice"] && item["DiscountPrice"] > 0 ? "省{0}元".format(item["DiscountPrice"]) : ""
                                    );
                                });
                                return '<div class="relate-pro-package">{0}</div>'.format(_str);
                            }()), //4
                            '<i>省</i>&nbsp;', //5
                            "&yen;" + data["MinPackagePrice"] + "起", //6 
                            num == 0 ? "" : "href='/youlun/linebook/{0}_{1}.html'".format(PFData.lineId, PFData.lineDate), //7
                            num == 0 ? "" : "target='_blank'", //8
                            '<span>套餐特惠</span>', //9
                            "", //10
                            "", //11
                            "", //12
                            "", //13
                            "", //14
                            "", //15
                            "", //16
                            "", //17
                            num == 0 ? "售罄" : "预订", //18
                            num == 0 ? "over" : "", //19
                            "", //20
                            "package" //21
                        );
                    } else {
                        length = dataRoom.length;
                    }
                    $btn.html("舱房介绍&nbsp;(&nbsp;" + length + "&nbsp;)");

                    util.forEach(dataRoom, function(index, item) {
                        str += tempStr.format(
                            item["ImageUrl"] || "",
                            item["CruiseCabinName"] || "",
                            (function() {
                                var ___str = item["CruiseCabinName"] || "";
                                if (___str.length > 10) return ___str.slice(0, 10) + "...";
                                return ___str;
                            }()),
                            item["RoomTypeInfo"].length ? item["RoomTypeInfo"].length + "种房型" : "",
                            (function() {
                                var ___str = "";
                                ___str += item["CabinProportion"] ? item["CabinProportion"] + "m²，" : "";
                                if (item["WindowState"] == 1) {
                                    ___str += "有窗，";
                                } else if (item["WindowState"] == 2) {
                                    ___str += "无窗，";
                                } else if (item["WindowState"] == 3) {
                                    ___str += "部分有窗，";
                                }
                                if (item["BalconyState"] == 1) {
                                    ___str += "有阳台";
                                } else if (item["BalconyState"] == 2) {
                                    ___str += "无阳台";
                                } else if (item["BalconyState"] == 3) {
                                    ___str += "部分有阳台";
                                }
                                ___str += item["CabinPersonRange"] ? "，入住" + item["CabinPersonRange"] + "人" : "";
                                return '<p class="relate-pro-descri">{0}</p>'.format(___str);
                            }()),
                            (function() {
                                var __str = "",
                                    i = 0;
                                util.forEach(item["RoomTypeInfo"] || [], function(_index, _item) {
                                    if (_item["PromotionInfo"].length) i += 1;
                                });
                                if (i) __str += "<i>惠</i>";
                                return __str;
                            }()),
                            "&yen;" + item["MinPrice"] + "起",
                            item["RemainStockNum"] == 0 ? "" : "href='/youlun/linebook/{0}_{1}.html'".format(PFData.lineId, PFData.lineDate),
                            item["RemainStockNum"] == 0 ? "" : "target='_blank'",
                            (function() {
                                function formatMemeber(str) {
                                    str = str.replace(/^[\s\r\n]*|[\s\r\n]*$/g, "");
                                    if (!str) {
                                        return false;
                                    }
                                    var arr = str.split("\r\n");
                                    str = "";
                                    for (var i = 0, len = arr.length; i < len; i++) {
                                        str += '<p>' + arr[i] + '</p>';
                                    }
                                    return !str ? false : str;
                                };
                                if (item["ServiceInstruction"] && formatMemeber(item["ServiceInstruction"])) return "<span>专享礼遇</span>";
                                return "";
                            }()),
                            item["CabinProportion"], //10
                            item["CabinPersonRange"], //11
                            item["WindowState"] + "|" + item["BalconyState"], //12
                            item["CabinFloors"], //13
                            item["MinPrice"], //14
                            item["Intro"] ? item["Intro"] : "", //15
                            item["Facility"] ? item["Facility"] : "", //16
                            item["ServiceInstruction"] ? item["ServiceInstruction"].replace(/\n/g, "<br/>") : "", //17
                            item["RemainStockNum"] == 0 ? "售罄" : "预订", //18
                            item["RemainStockNum"] == 0 ? "over" : "", //19
                            item["RemainStockNum"],
                            ""
                        );
                    });
                    F.one(".relate-pro-unit ul").html("bottom", str);
                    TJObj.add(F.all(".relate-pro-price a", F.one(".relate-pro-unit ul")));
                    that.asyncBindEvent();
                } else {
                    $btn.css("display:none;");
                    $cont.css("display:none;");
                    $btn = F.dom(F.all(".relate-pro-tabs a", $relateBox)[1]);
                    $btn && $btn.click();
                    that.asyncBindEvent();
                }

                this.reset();
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
                        }
                    }
                })
            }
        });
        F.ready(function() {
            thisRelateObj.init();
        });
        define("pc_final_relate", function() {
            return thisRelateObj;
        });
    });
}(requirejs, fish, window, document);
