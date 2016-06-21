fish.admin.config({
    Calendar: { v: '0.3', css: '0.3', g: 2015032101 },
    anim:{v:'0.3',g:2016061704}
});
var ylcNavObj = ylcNavObj || {};;
! function(F, window, document, undefined) {

    //公有类
    F.lang.extend(ylcNavObj, {
        init: function() {
            var that = this;
            setTimeout(function(){that.specReserTips.init.call(that.specReserTips)},1000*3);
            thisObj.changePic();
            F.one('.ylc-nav .ylc-item').once('ylcNavObj', function() {
                F.one(this).on("click", function() {
                    F.ajax({ url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseHomePageWindowStatistic&value=ActivityClick" });
                });
            });
            /*
            ----此方法写在特价预约中
            F.one(".ylc-nav .ylc-special-price").once("ylcNavObj", function() {
                F.one(this).on("click", function() {
                    //console.log("哈哈!");
                })
            });

            */
            F.one(".ylc-nav .ylc-gotop").once("ylcNavObj", function() {
                F.one(this).on("click", function() {
                    F.dom("body").scrollTop = 0;
                    F.dom("html").scrollTop = 0;
                });
            });
            var _FN = function() {
                if (F.one(this).scrollTop() > 50) {
                    F.one(".ylc-nav .ylc-gotop").css("visibility: visible;");
                } else {
                    F.one(".ylc-nav .ylc-gotop").css("visibility: hidden;");
                }
            };
            F.one(window).once("ylcNavObj", function() {
                F.one(window).on("scroll", _FN);
                _FN();
            });

            F.one(".ylc-nav .ylc-plus .ylc-plus-close").once("ylcNavObj", function() {
                F.one(this).on("click", function() {
                    var $this = F.one(this),
                        $plus = F.one(".ylc-nav .ylc-plus"),
                        BR = fish.browser();
                    if (BR.name == "ms" && BR.version < 10) {
                        $plus.html("remove");
                    } else {
                        $plus.removeClass("fadeInDown").addClass("fadeInUp");
                        setTimeout(function() {
                            $plus.html("remove");
                        }, 1600);
                    }
                });
            });
            F.one(".ylc-nav .ylc-plus .ylc-plus-cont").once("ylcNavObj", function() {
                F.one(this).on("click", function() {
                    var $this = F.one(this),
                        $tips = F.one(".ylc-nav .ylc-plus .ylc-plus-tips");
                    $tips.length && $tips.css({ "display": "block" });
                    F.ajax({ url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseDetailPageWindowStatistic&value=DiscountClick" });
                });
            });

            F.one(document).once("ylcNavObj", function() {
                F.one(this).on("click", function(e) {
                    var $tar = F.one(fish.getTarget(e));
                    var $par = $tar.parent(".ylc-plus");
                    if (!($tar.hasClass("ylc-plus") || $par.length > 0)) {
                        F.one(".ylc-nav .ylc-plus .ylc-plus-tips").length && F.one(".ylc-nav .ylc-plus .ylc-plus-tips").css({ "display": "none" })
                    }
                });
            });
        },
        specReserDialog: { //特价预约对话框 specialReservationDialog
            init: function() {},
            bindEvent: function() {},
            isFinal: function() { //判断是否是终页
                var $final = F.one("#hidIsFinalPage"),
                    $lineId = F.one("#hidFinalLineId"),
                    $beginData = F.one("#hidTjBeginDate");
                return $final && $final[0] && parIntPos($final.val()) && $lineId && $lineId[0] && parIntPos($lineId.val()) && $beginData && $beginData[0] && F.trim($beginData.val()).length > 0;
            }
        },
        specReserTips: {
            poll: function() {
                var that = this;
                if (this.tipTimer) clearInterval(this.tipTimer);
                if (this.hideTimer) {
                    clearTimeout(this.hideTimer);
                    F.one(".ylc-nav .ylc-tips").removeClass("open");
                }
                if (!(this.DATA && this.DATA.length)) return false;
                this.show();
                this.hideTimer=setTimeout(function() {
                    F.one(".ylc-nav .ylc-tips").removeClass("open");
                }, 3000);
                this.tipTimer = setInterval(function() {
                    var topPos=parIntPos(F.one(".ylc-modal-tips p").attr("t-attr"));
                    
                    F.one(".ylc-modal-tips p").anim("top:"+(0-topPos-22)+"px",600,function(){
                        var _topPos=parIntPos(F.one(".ylc-modal-tips p").attr("t-attr"));
                        if(_topPos>=22*that.DATA.length){
                           F.one(".ylc-modal-tips p").css({"top":"0px"});
                            F.one(".ylc-modal-tips p").attr("t-attr",0);
                        }
                    });
                    F.one(".ylc-modal-tips p").attr("t-attr",topPos+22);
                }, 1000 * 4.2); //四秒 
            },
            show: function() { //显示
               if (!(this.DATA && this.DATA.length)) return false;
                var $navTips = F.all(".ylc-nav .ylc-tips"),
                    $modalTips=F.all(".ylc-modal-tips"),
                    tipContent="{0}成功预约{1}人出游",
                    _str=""
                    ;
                sytObj.forEach(this.DATA,function(index,item){
                    _str+=("<span>"+tipContent+"</span>").format(item["Mobile"]||"",item["PersonNum"]||"");
                });
                _str+=("<span>"+tipContent+"</span>").format(this.DATA[0]["Mobile"]||"",this.DATA[0]["PersonNum"]||"");
                $navTips.html(tipContent.format(this.DATA[0]["Mobile"]||"",this.DATA[0]["PersonNum"]||""));
                F.one("p",$modalTips).html(_str);
                F.one("p",$modalTips).attr("t-attr",0);
                F.one("p",$modalTips).css({"top":"0"});
                $navTips.addClass("open");
                $modalTips.addClass("open");
            },
            hide: function() { //隐藏
                var $tips = F.all(".ylc-nav .ylc-tips,.ylc-modal-tips");
                $tips.removeClass("open");
            },
            load: function() {
                var that = this;
                if (this.loadTimer) clearTimeout(this.loadTimer);
                F.ajax({
                    url:"/youlun/cruiserequireorder/homepageRequireorder.ashx?action=GetRequireOrder&top=10",
                    //url: "js/orderData.js",
                    type: "json",
                    fn: function(data) {
                        if (data && data.length && data[0] && typeof data === "object") {
                            that.DATA=data;
                            that.poll.call(that);
                        }
                        that.loadTimer = setTimeout(function() {
                            that.load.call(that);
                        }, 1000 * 60*3); //3分钟请求一次
                    }
                })
            },
            init:function(){
                this.load();
            }
        }
    });

    //特价预约 ---先抄用搜索列表页的逻辑
    var tejiaObj = tejiaObj || {};
    F.lang.extend(tejiaObj, {
        init: function() {
            var that = this;
            if (ylcNavObj.specReserDialog.isFinal()) {
                thisObj.setDialogTitle();

                F.all(".ylc-m-title").removeClass("none");
                F.all(".ylc-m-time").addClass("none");

            } else {
                F.all(".ylc-m-title").addClass("none");
                F.all(".ylc-m-time").removeClass("none");
            }
            //表单
            this.formConBox = tejiaObj.alertFormCtrl({
                showCon: fish.one(".ylc-modal"),
                shadowBg: fish.one(".ylc-modal-layer"),
                closeBut: fish.one(".ylc-modal .ylc-modal-head a"),
                showBeforeFn: function(objA, objB) {
                    tejiaObj.cirCenter(objA);
                }
            });
            //提交弹框
            this.msgForm = tejiaObj.alertFormCtrl({
                showCon: fish.one(".ylc-modal-rs"),
                shadowBg: fish.one(".ylc-modal-layer"),
                closeBut: fish.one(".ylc-modal-rs .ylc-mr-close"),
                showBeforeFn: function(objA, objB) {
                    tejiaObj.cirCenter(objA);
                }
            });
            this.cruiseObj.init();
            this.tripDateObj.init();
            this.codeObj.init();
            this.bindEvent();
        },
        //重置所有的input以及交互
        restAllInput: function() {
            var $allInput = fish.all(".ylc-modal dl dd input");
            //清空输入框
            // $allInput.removeClass("place_holder");
            for (var i = 0, len = $allInput.length; i < len; i++) {
                var $input = fish.one($allInput[i]);
                if ($input.attr("_placeholder")) {
                    $input.addClass("place_holder").val($input.attr("_placeholder"));
                } else {
                    $input.val("");
                }
            }
            fish.one(".ylc-modal dl dd span.no_enter").removeClass("checked");
            this.tripDateObj.noDateflag = false;
            fish.all(".ylc-modal dl dd").removeClass("has_error");

            //重置验证码
            this.codeObj.resetCode();
        },
        //绑定全局事件
        bindEvent: function() {
            var that = this,
                $subBut = fish.one(".ylc-modal .ylc-modal-foot a.sub_data"),
                $allInput = fish.all(".ylc-modal dl.eve_yusuan dd input,.ylc-modal dl.cust_name dd input,.ylc-modal dl.cust_mobile dd input,.ylc-modal dl.code dd input");
            this.inputObj.bindPlaceHolder($allInput);
            //出游人数
            this.inputObj.filterKeyUp(fish.all(".ylc-modal dl.travel_num dd input"), "[^\\d]", 3);
            //人均预算
            this.inputObj.filterKeyUp(fish.one(".ylc-modal dl.eve_yusuan dd input"), "[^\\d]", 13);
            //提交数据
            $subBut.on("click", function() {
                if ($subBut.hasClass("sub_no_act")) return false;
                if (that.subCheck()) {
                    $subBut.addClass("sub_no_act").html("提交中...");
                    //提交数据
                    fish.ajax({
                        url: "/youlun/CruiseRequireOrder/HomePageRequireOrder.ashx",
                        // url : "js/jsonTestToSubData.txt",
                        data: "action=SpecialReserOrder&" + that.getInputDataToStr(),
                        openType: "post",
                        type: "json",
                        fn: function(data) {
                            $subBut.removeClass("sub_no_act").html("提交");
                            if (!data) {
                                that.alertMsgFn(0); //0失败
                                return false;
                            }
                            switch (data.ResultCode) {
                                case -100:
                                    tejiaObj.msgCtrl.show(fish.dom(".ylc-modal dl.code dd input"), "验证码输入错误！");
                                    break;
                                case 1:
                                    that.alertMsgFn(1); //1成功
                                    that.restAllInput();
                                    break;
                                case 8:
                                    that.alertMsgFn(2); //2重复提交
                                    that.restAllInput();
                                    break;
                                default:
                                    that.alertMsgFn(0); //0失败
                                    break
                            }

                        }
                    });
                }
            });
            //点击关闭信息提示弹框
            fish.one(".ylc-modal-rs .s_con").delegate(".close_but", "click", function() {
                that.msgForm.close();
            });

            //点击显示提交弹框
            fish.one(".ylc-nav .ylc-special-price").on("click", function() {
                that.cruiseObj.drawLine();
                that.formConBox.show();
                that.statcClick();
                thisObj.setDialogTitle();
            });

            //得到焦点关闭提示
            fish.all(".ylc-modal dl.cust_name dd input,.ylc-modal dl.cust_mobile dd input,.ylc-modal dl.code dd input").on("focus", function() {
                that.msgCtrl.close(this);
            });
        },
        //输入框对象
        inputObj: {
            //添加一个placeholder方法
            bindPlaceHolder: function($allInput) {
                if (!$allInput || !$allInput[0]) return false;
                $allInput.on("focus", function() {
                    var $input = fish.one(this);
                    thisVal = $input.val(),
                        thisPlaceHolder = $input.attr("_placeholder");
                    if (thisVal == thisPlaceHolder && $input.hasClass("place_holder")) {
                        $input.val("").removeClass("place_holder");
                    }
                }).on("blur", function() {
                    var $input = fish.one(this);
                    thisVal = $input.val(),
                        thisPlaceHolder = $input.attr("_placeholder");
                    if (thisVal.length <= 0) {
                        $input.val(thisPlaceHolder).addClass("place_holder");
                    }
                });
            },
            //keyUp 限制输入
            filterKeyUp: function($input, regx, strLen) {
                if (!$input || !$input[0] || !regx || !strLen) return false;
                var regxObj = new RegExp(regx, "g");
                $input.on("keyup", function() {
                    var $input = fish.one(this),
                        thisFilterVal = $input.val().substr(0, strLen).replace(regxObj, "");
                    $input.val(thisFilterVal)
                });
            }
        },
        //错误消息提示框
        msgCtrl: {
            show: function(inputDom, msg) {
                if (!inputDom || !msg || msg.length <= 0) return false;
                $parent = fish.one(inputDom).parent("dd");
                $parent.addClass("has_error");
                fish.one(".err_msg", $parent[0]).html('<i></i>' + msg);
            },
            close: function(inputDom) {
                if (!inputDom) return false;
                $parent = fish.one(inputDom).parent("dd");
                $parent.removeClass("has_error");
                fish.one(".err_msg", $parent[0]).html('<i></i>');
            }
        },
        //邮轮航线
        cruiseObj: {
            init: function() {
                // this.drawLine();
                this.bindEvent();
            },
            bindEvent: function() {
                //航线选择点击事件
                var that = this,
                    $linesCon = fish.one(".ylc-modal .ylc-sltport"),
                    $lineInput = fish.one(".ylc-modal dl.route_port dd input");
                $lineInput.addClass("scon_tar_show");

                //显示框
                $lineInput.on("click", function() {
                    var x = F.one(this).offset().left,
                        y = F.one(this).offset().top + 30;
                    x -= F.one(".ylc-modal").offset().left;
                    y -= F.one(".ylc-modal").offset().top;
                    // x-=5;

                    $linesCon.css("display:block;top:" + y + "px;left:" + x + "px;");
                });

                $linesCon.addClass("scon_tar_show").delegate(".ylc-sltport-content a", "click", function(evt) {
                    var $tar = fish.one(fish.getTarget(evt));
                    $lineInput.removeClass("place_holder").val($tar.attr("attr-val"));
                    $linesCon.css({ "display": "none" });
                });

                //关闭航线框
                fish.one(document).on("click", function(evt) {
                    var tar = fish.getTarget(evt),
                        $this = fish.one(tar),
                        $parent = $this.parent(".scon_tar_show"); //scon_tar_show 这个类名用来判断是否是是所需要的事件源
                    if ($this.hasClass("scon_tar_show") || $parent.length >= 1) {
                        return true;
                    }
                    //$linesCon.addClass("none");
                    $linesCon.css({ "display": "none" });
                });
                fish.one(".ylc-sltport-close", $linesCon[0]).on("click", function() {
                    $linesCon.css({ "display": "none" });
                });
            },
            //打印航线数据
            drawLine: function() {
                if (this.drawLineHasData) return false;
                this.drawLineHasData = true;
                fish.ajax({
                    url: "/youlun/CruiseRequireOrder/HomePageRequireOrder.ashx?action=SearchRouteData",
                    //url : "js/lineData.js",
                    type: "json",
                    fn: function(data) {
                        if (!data || !data[0]) return false;
                        var str = "";
                        for (var i = 0, len = data.length; i < len; i++) {
                            str += "<a class='{0}' href='javascript:;' {2} attr-val='{1}'>{1}</a>".format("", fish.trim(data[i].CrName || ""), "");
                        }
                        fish.all(".ylc-modal .ylc-sltport-body").html("<div class='ylc-sltport-content '>" + str + "</div>");
                    }
                });
            }
        },
        //出游日期
        tripDateObj: {
            init: function() {
                this.bindEvent();
                this.noDateflag = false;
            },
            bindEvent: function() {
                var that = this,
                    // this.noDateflag = false,
                    $startDate = fish.one(".ylc-modal dl.tour_date dd input.input_start_date"),
                    $endDate = fish.one(".ylc-modal dl.tour_date dd input.input_end_date"),
                    domCal01 = fish.one(""),
                    domCal02 = fish.one("");
                fish.one(".ylc-modal dl dd span.no_enter").on("click", function() {
                    var $this = fish.one(this);
                    if ($this.hasClass("checked")) {
                        $this.removeClass("checked");
                        that.noDateflag = false;
                    } else {
                        $this.addClass("checked");
                        $startDate.val($startDate.attr("_placeholder")).addClass("place_holder");
                        $endDate.val($endDate.attr("_placeholder")).addClass("place_holder");
                        that.noDateflag = true;
                    }
                });

                //绑定日历选择
                fish.require("Calendar", function() {
                    var endDate = new Date();
                    endDate.setFullYear(endDate.getFullYear() + 5);
                    $startDate.on("focus", function(e) {
                        if (that.noDateflag) return false;
                        domCal01.html("remove");
                        var cal = new fish.Calendar({
                            skin: "white",
                            style: "show",
                            wrapper: fish.all(".ylc-modal dl.tour_date dd .s_show_div")[0],
                            elem: this, // 如果设置了elem的值，且elem参数为input框
                            startDate: new Date(),
                            endDate: $endDate.val() && $endDate.val() != $endDate.attr("_placeholder") ? new Date(new Date($endDate.val().replace(/-/g, "/")).getTime() - 24 * 3600 * 1000) : endDate,
                            fn: function(y, d, r, t, m) {
                                domCal01.addClass("none");
                                $startDate.removeClass("place_holder");
                                $endDate.removeClass("place_holder");
                                var _startDate = new Date(y + "/" + d + "/" + r).getTime() + 24 * 3600 * 1000;
                                domCal02.html("remove");
                                var cal = new fish.Calendar({
                                    skin: "white",
                                    style: "show",
                                    wrapper: fish.all(".ylc-modal dl.tour_date dd .s_show_div")[1],
                                    startDate: new Date(_startDate),
                                    endDate: endDate,
                                    elem: $endDate[0],
                                    currentDate: [new Date(_startDate)],
                                    fn: function(y, d, r, t, m) {
                                        domCal02.addClass("none");
                                    }
                                });
                                domCal02 = fish.one(cal.panel);
                                domCal02.parent(".s_show_div").addClass("tar_cal_jenvent");
                                domCal02.css("position:absolute;top:30px;left:0;z-index:2;");
                                that.setCalPosition(domCal02);

                            }
                        });
                        domCal01 = fish.one(cal.panel);
                        domCal01.parent(".s_show_div").addClass("tar_cal_jenvent");
                        domCal01.css("position:absolute;top:36px;left:0;z-index:2;");
                        that.setCalPosition(domCal01);
                    });
                    $endDate.on("focus", function(e) {
                        if (that.noDateflag) return false;
                        var startDate = $startDate.val() && $startDate.val() != $startDate.attr("_placeholder") ? new Date(new Date($startDate.val().replace(/-/g, "/")).getTime() + 24 * 3600 * 1000) : new Date(new Date().getTime() + 24 * 3600 * 1000);
                        domCal02.html("remove");
                        var cal = new fish.Calendar({
                            skin: "white",
                            style: "show",
                            wrapper: fish.all(".ylc-modal dl.tour_date dd .s_show_div")[1],
                            elem: this, // 如果设置了elem的值，且elem参数为input框
                            startDate: startDate,
                            endDate: endDate,
                            fn: function(y, d, r, t, m) {
                                $endDate.removeClass("place_holder");
                                domCal02.addClass("none");
                            }
                        });
                        domCal02 = fish.one(cal.panel);
                        domCal02.parent(".s_show_div").addClass("tar_cal_jenvent");
                        domCal02.css("position:absolute;top:36px;left:0;z-index:2;");
                        that.setCalPosition(domCal02);
                    });
                });



                //点击关闭日历
                fish.one(document).on("click", function(evt) {
                    var $tar = fish.one(fish.getTarget(evt)),
                        $parent = $tar.parent(".tar_cal_jenvent");
                    if ($tar.hasClass("tar_cal_jenvent") || $parent.length >= 1) return false;
                    domCal01.addClass("none");
                    domCal02.addClass("none");
                });

                //分别控制日历关闭
                $startDate.on("click", function(evt) {
                    // domCal01.addClass("none");
                    domCal02.addClass("none");
                });
                $endDate.on("click", function(evt) {
                    domCal01.addClass("none");
                    // domCal02.addClass("none");
                });
            },
            setCalPosition: function($cal) {
                var $parentBox = $cal.parent(".ylc-modal"),
                    winW = fish.one(window).width(),
                    parentBoxW = $parentBox.width(),
                    calW = $cal.width(),
                    cz = $cal.offset().left + calW - $parentBox.offset().left - parentBoxW,
                    rightPX = (winW - parentBoxW) / 2 - cz;
                if (rightPX < 0) {
                    $cal.css("left:" + rightPX + "px;");
                }
                // console.log(rightPX)
            }
        },
        //日历创建对象
        calCreateFn: function(option) {

        },
        //验证码
        codeObj: {
            init: function() {
                this.getCodeFlag = true; //是否可以获取验证码
                this.bindEvent();
            },
            bindEvent: function() {
                var that = this;
                //点击获取验证码
                fish.one(".ylc-modal dl.code dd span.get_code").on("click", function() {
                    if (tejiaObj.checkObj.checkPhone() && that.getCodeFlag === true) {
                        that.getCode();
                        that.timerCode(60000);
                    }
                });
            },
            //获取验证码
            getCode: function() {
                fish.ajax({
                    url: "/youlun/CruiseRequireOrder/HomePageRequireOrder.ashx",
                    data: "action=GetSmsAuthCode&custMobile=" + fish.one(".ylc-modal dl.cust_mobile dd input").val(),
                    fn: function() {}
                });
            },
            //验证码获取倒计时
            timerCode: function(times) {
                var that = this,
                    $codeBut = fish.one(".ylc-modal dl.code dd span.get_code"),
                    $showCs = fish.one("span i", $codeBut[0]),
                    setTime = times || 30000,
                    aniTime = 500;
                this.timerD = setInterval(function() {
                    if (setTime <= 0) {
                        that.getCodeFlag = true;
                        $codeBut.removeClass("no_active");
                        clearInterval(that.timerD);
                    }
                    $showCs.html(Math.round(setTime / 1000));
                    setTime -= aniTime;
                }, aniTime);
                $showCs.html(Math.round(setTime / 1000))
                this.getCodeFlag = false;
                $codeBut.addClass("no_active");
            },
            //重置验证码
            resetCode: function() {
                var $codeBut = fish.one(".ylc-modal dl.code dd span.get_code"),
                    $showCs = fish.one("span i", $codeBut[0]);
                this.getCodeFlag = true;
                $codeBut.removeClass("no_active");
                $showCs.html("0");
                this.timerD && clearInterval(this.timerD);
            }
        },
        //点击提交验证
        subCheck: function() {
            return this.checkObj.checkName() & this.checkObj.checkPhone() & this.checkObj.checkCode();
        },
        // 所有需要验证的对象
        checkObj: {
            //验证姓名
            checkName: function() {
                var $input = fish.one(".ylc-modal dl.cust_name dd input"),
                    regex = /^[^@\/\'\\\"#$%&\^\*\(!\^\*\;\:\>\<\-\|]+$/,
                    thisValue = fish.trim($input.val()),
                    placeHoder = fish.trim($input.attr("_placeholder"));
                thisValue = $input.hasClass("place_holder") && thisValue == placeHoder ? "" : thisValue;
                if (thisValue.length <= 0) {
                    tejiaObj.msgCtrl.show($input[0], "请填写联系人姓名！");
                    return false;
                }
                if (!regex.test(thisValue)) {
                    tejiaObj.msgCtrl.show($input[0], "姓名中包含非法字符！");
                    return false;
                }
                tejiaObj.msgCtrl.close($input[0]);
                return true;
            },
            //验证手机号
            checkPhone: function() {
                var $input = fish.one(".ylc-modal dl.cust_mobile dd input"),
                    regex = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|147)\d{8}$/,
                    thisValue = fish.trim($input.val()),
                    placeHoder = fish.trim($input.attr("_placeholder"));
                thisValue = $input.hasClass("place_holder") && thisValue == placeHoder ? "" : thisValue;
                if (thisValue.length <= 0) {
                    tejiaObj.msgCtrl.show($input[0], "请输入手机号！");
                    return false;
                }
                if (!regex.test(thisValue)) {
                    tejiaObj.msgCtrl.show($input[0], "请输入正确的手机号！");
                    return false;
                }
                tejiaObj.msgCtrl.close($input[0]);
                return true;
            },
            //验证验证码是否为空
            checkCode: function() {
                var $input = fish.one(".ylc-modal dl.code dd input"),
                    thisValue = fish.trim($input.val()),
                    placeHoder = fish.trim($input.attr("_placeholder"));
                thisValue = $input.hasClass("place_holder") && thisValue == placeHoder ? "" : thisValue;
                if (thisValue.length <= 0) {
                    tejiaObj.msgCtrl.show($input[0], "请输入验证码！");
                    return false;
                }
                tejiaObj.msgCtrl.close($input[0]);
                return true;
            }
        },
        //获取数据
        getInputDataToStr: function() {
            var $allInput, //= fish.all(".ylc-modal input"),
                str = "";
            if (ylcNavObj.specReserDialog.isFinal()) {
                $allInput = F.all("#hidIsFinalPage,#hidFinalLineId,#hidTjBeginDate,.ylc-m-title .eve_yusuan input,.ylc-m-title .travel_num input,.cust_name input,.cust_mobile input,.code input", F.one(".ylc-modal"));
            } else {
                $allInput = F.all(".ylc-m-time .route_port input,.ylc-m-time .travel_num input,.ylc-m-time .tour_date input,.cust_name input,.cust_mobile input,.code input", F.one(".ylc-modal"));
            }
            for (var i = 0, len = $allInput.length; i < len; i++) {
                var $input = fish.one($allInput[i]),
                    placeHolder = $input.attr("_placeholder"),
                    thisVal = $input.hasClass("place_holder") && $input.val() == placeHolder ? "" : $input.val(),
                    thisName = $input.attr("name");
                str += '&' + thisName + '=' + encodeURIComponent(thisVal);
            }
            return str.substr(1);
        },
        //弹框提示方法
        alertMsgFn: function(type) {
            // 0失败 1成功 2重复提交
            var str = "";
            switch (type) {
                case 2:
                    str = '<h4 class="h4_txt">亲~您已经提交过哦</h4>\
                            <p class="ps">客服将尽快联系您<br/>请不要拒接0512开头的电话</p>\
                            <span class="msg_dbg success_sbg"></span>\
                            <span class="close_but">关闭</span>';
                    break;
                case 0:
                    str = '<h4 class="h4_txt">提交失败！</h4>\
                            <span class="msg_dbg fail_sbg"></span>\
                            <span class="close_but">关闭</span>';
                    break;
                case 1:
                    str = '<h4 class="h4_txt">通知预约成功！</h4>\
                            <p class="ps">客服将尽快联系您<br/>请不要拒接0512开头的电话</p>\
                            <span class="msg_dbg success_sbg"></span>\
                            <span class="close_but">关闭</span>';
                    break;
            }
            if (str.length >= 0) {
                fish.one(".ylc-modal-rs .s_con").html(str);
                this.formConBox.close();
                this.msgForm.show();
            }
        },
        //统计点击
        statcClick: function() {
            var isFinal = fish.one("#hidIsFinalPage").val();
            fish.ajax({
                url: "/youlun/CruiseRequireOrder/HomePageRequireOrder.ashx?action=SpecialReserClick&isFinal=" + isFinal,
                fn: function() {}
            });
        },
        alertFormCtrl: function(option) {
            var setOption = {
                showCon: fish.one(""),
                shadowBg: fish.one(""),
                clickBgClose: true,
                closeBut: fish.one(""),
                closeAfterFn: function(objA, objB) {},
                showBeforeFn: function(objA, objB) {}
            };
            fish.lang.extend(setOption, option);
            var g = setOption,
                status = 0,
                fns = {
                    show: function() {
                        g.showBeforeFn(g.showCon, g.shadowBg);
                        g.shadowBg.removeClass("none");
                        g.showCon.removeClass("none");
                    },
                    close: function() {
                        g.shadowBg.addClass("none");
                        g.showCon.addClass("none");
                        g.closeAfterFn(g.showCon, g.shadowBg);
                    }
                };
            g.closeBut.on("click", function() {
                fns.close();
            });
            if (g.clickBgClose === true) {
                g.shadowBg.on("click", function() {
                    fns.close();
                });
            }

            return fns;
        },
        //弹框居中算法
        cirCenter: function(fishObj) {
            if (!fishObj || !fishObj[0]) return false;
            var oW = fishObj.width(),
                oH = fishObj.height();
            fishObj.css("position:fixed;left:50%;top:50%;marginLeft:" + -oW / 2 + "px;marginTop:" + -oH / 2 + "px;");
        }
    });


    //私有类
    var thisObj = thisObj || {};
    F.lang.extend(thisObj, {
        changePic: function() { //更换nav条的广告图片
            var $item = F.one(".ylc-nav .ylc-item");
            if (this.isDuring("2016-06-02", "2016-06-17")) { // ---6.16期间使用
                F.one("img", $item).attr("src", "http://img1.40017.cn/cn/y/16/h/ylnav616-top.jpg");
                F.one(".ylc-more img", $item).attr("src", "http://img1.40017.cn/cn/y/16/h/cruisesale616.jpg");
            }
            if(this.isDuring("2016-06-20","2017-06-20")){
                F.one("img", $item).attr("src", "http://img1.40017.cn/cn/y/16/c/ylnav-top-1.jpg");
                F.one(".ylc-more img", $item).attr("src", "http://img1.40017.cn/cn/y/16/c/cruisesale-1.jpg");
            }

            F.ajax({ //符合砍价条件时使用
                url: "/youlun/cruiseactivity/TopicActivityAjax.aspx?Type=GetTodayHotLine&specialId=330&moduleId=911",
                type: "json",
                fn: function(data) {
                    if (data["stlSortNo"] > 0) {
                        var $img = F.one("img", $item),
                            $script = F.one("script", $item),
                            $more = F.one(".ylc-more", $item);
                        $img.attr("src", $img.attr("src-attr"));
                        $more.html($script.html().format(
                            data["image"],
                            data["stlRecommend"],
                            parseInt(data["price"], 10)
                        ));
                        $item.attr("href", data["url"] || "javascript:;");
                    }
                }
            })
        },
        isDuring: function(sTime, eTime) { //判断当前时间---是否在sTime与eTime之间
            var nTime = F.parseDate().getTime(),
                sTime = F.parseDate(sTime).getTime(),
                eTime = F.parseDate(eTime).getTime();
            if (nTime >= sTime && nTime <= eTime) return true;
            return false;
        },
        setDialogTitle: function() {
            if (ylcNavObj.specReserDialog.isFinal()) {
                var titleStr = F.create("<div></div>");
                titleStr.html(F.one(".pro_tit .h2_title").html());
                F.all("*", titleStr).html("remove");
                titleStr = F.trim(titleStr.html());
                if (!(titleStr && titleStr.length))
                    titleStr = F.trim(F.one(".content .location .h2_local").html());
                if (!(titleStr && titleStr.length))
                    titleStr = "邮轮特价预约线路";
                F.one(".ylc-modal .ylc-m-title .route-tit").html(titleStr);
            }
        }
    });

    //私有方法
    function parIntPos(str) { //转成正整数
        str = parseInt(str, 10);
        return isNaN(str) ? 0 : str < 0 ? 0 : str;
    }

    //页面初始化加载
    fish.ready(function() {
        ylcNavObj.init();
        tejiaObj.init();
        var $plusInput = F.one("#onlineSellPriceDefault");
        if (F.dom($plusInput)) {
            $plusInput = $plusInput.val();
            $plusInput = parseInt($plusInput, 10);
            $plusInput = isNaN($plusInput) ? 0 : $plusInput < 0 ? 0 : $plusInput;
            if ($plusInput >= 50) {
                F.one(".ylc-nav .ylc-plus").css({ "display": "block" }).addClass("fadeInDown")
            }
        }
        //ylcNavObj.specReserTips.poll();
    });
}(fish, window, window.document);
