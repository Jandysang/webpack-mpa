//签证说明的脚本
;
! function(R, F, window, document, undefined) {
    define(["../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js"], function(once, scroll) {
        F.ready(function() {
            var $visaBox = F.one(".unit-visa");
            //绑定详情展开--tab切换事件
            //展开--收起
            F.all(".visa-pro-counts .visa-pro-li .more", $visaBox).once("visa-thisObj", function() {
                F.one(this).on("click", function() {
                    var $this = F.one(this),
                        $cont = F.one(".visa-pro-detail", $this.parent(".visa-pro-count"));
                    if ($cont.hasClass("none")) {
                        $this.html("收起");
                        $cont.removeClass("none");
                    } else {
                        $this.html("详情");
                        $cont.addClass("none");
                    }
                    scroll.update();
                });
            });
            //tab切换
            F.all(".visa-pro-counts .visa-pro-detail .tabs a", $visaBox).once("visa-thisObj", function(elem, index) {
                F.one(this).on("click", function() {
                    var $this = F.one(this),
                        $conts = F.all(".counts .count", $this.parent(".visa-pro-detail")),
                        $btns = F.all("a", $this.parent());
                    if ($this.hasClass("at")) return false;
                    $btns.removeClass("at");
                    $this.addClass("at");
                    $conts.addClass("none");
                    F.one($conts[index]).removeClass("none");
                    scroll.update();
                });
            });
            //签证查看大图
            F.all(".tab_td_img span",$visaBox).once("visa-thisObj",function(){
                F.one(this).on("click",function(){                    
                    var $contBox = F.one(".visa-pro-counts", $visaBox),
                        tempStr = F.one("script.template", $contBox).html(),
                        str = "",
                        __imgArr = F.one(this).attr("attr-img").split(","),
                        __imgLength = __imgArr.length,
                        __flag = __imgLength > 1 ? true : false,
                        __height = F.one(window).height(),
                        __width = parseInt(__height*0.8/1.3,10) + 20;
                    str += tempStr.format(
                        __flag ? "<em>1</em>/" +__imgLength  : "",
                        F.browser("ms") ? "" : "<span class='operationBtn operationZoom'></span>",
                        __imgArr[0],
                        __flag ? "<span class='imgBtn imgBtnPrev'></span>" : "",
                        __flag ? "<span class='imgBtn imgBtnNext'></span>" : "",
                        __imgLength,
                        __imgArr
                    );
                    F.one(".visa-pro-countImg",$visaBox).html(str).css("display:block;");
                    F.one(".imgBox",$visaBox).css("width:" + __width + "px;margin-left:" + (-__width)/2 + "px;");
                    imgFuc();
                })
            });
            //
            function imgFuc(){
                var __height = F.one(window).height(),
                    __width = 0;
                F.one(".operationZoom").on("click",function(){
                    if(F.one(this).hasClass("operation-Zoom")){
                        __width = parseInt(__height*0.8/1.3,10) + 20;
                        F.one(this).removeClass("operation-Zoom");
                        F.one(".imgBox",$visaBox).removeClass("imgBox-bigimgBox").css("width:" + __width + "px;margin-left:" + (-__width)/2 + "px;");
                    }else{
                        __width = parseInt(__height/1.3,10) + 20;
                        F.one(this).addClass("operation-Zoom");
                        F.one(".imgBox",$visaBox).addClass("imgBox-bigimgBox").css("width:" + __width + "px;margin-left:" + (-__width)/2 + "px;");
                    }
                })
                F.all(".operationClose,.layer",$visaBox).on("click",function(){
                    F.one(".visa-pro-countImg",$visaBox).css("display:none;");
                })
                F.all(".imgBtn",$visaBox).once("visa-thisObj",function(){
                    var that = F.one(this);
                    that.on("click",function(){
                        var __parent = that.parent(),
                            __current = __parent.attr("attr-current"),
                            __length = __parent.attr("attr-length"),
                            __imgArr = __parent.attr("attr-img").split(",");
                        if(that.hasClass("imgBtnNext")){
                            if(__current>=__length){
                                __current = 1;
                            }else{
                                __current++;
                            }
                        }else{
                            if(__current<=1){
                                __current = __length;
                            }else{
                                __current--;
                            }
                        }
                        F.one(".imgnum em",$visaBox).html(__current);
                        F.one(".countImgBox",$visaBox).attr("attr-current",__current);
                        F.one(".imgBox",$visaBox).html("<img src='"+__imgArr[__current-1]+"' />");
                    })
                })
            }
        });
    });
}(requirejs, fish, window, document);
