    //百叶窗
    ;
    ! function(R, F, window, document, undefined) {
        define(["../../public/utility/js/cruise.utitlty.js", "../../public/fish/js/fish.once.js", "../../public/fish/js/fish.scroll.js"], function(util, once, scroll) {

            //截字
            function cutFont(elem,num1,num2){
                F.all(elem).each(function(){
                    var _html = F.trim(F.one(this).html()),
                        _length = _html.length,
                        newhtml = "";
                    if(_length > num1){                        
                        newhtml = _html.substring(0,num2) + "<em>.</em><em>.</em><em>.</em>";
                        F.one(this).html(newhtml);
                    }
                })                
            }
            F.ready(function() {
                if(F.one(".module-con .current img").length > 0 && !fish.browser("ms")){
                    var _src = F.one(".module-con li img").attr("src");
                    F.one(".blur-img").html("<img src='"+_src+"' alt=''/>");
                    F.one(".module-con").css("background:none;");
                }
                //绑定百叶窗事件                
                F.all(".module-box li").each(function(elem,i){
                    var that = F.one(elem);
                    F.one(".title",that).on('click',function(){                                               
                        F.all(".module-box li").removeClass("current");
                        that.addClass("current");                        
                        if(F.all("img",that).length > 0 && !fish.browser("ms")){
                            var _src = F.one("img",that).attr("src");
                            F.one(".blur-img").html("<img src='"+_src+"' alt=''/>");
                            F.one(".module-con").css("background:none;");
                        }else{
                            F.one(".blur-img").html("");
                            F.one(".module-con").css("background:#f5f5f5;");
                        }
                    })
                })
                cutFont(".module-con .title .text",10,10);
                cutFont(".module-con .img-box .text",390,390);
            });

        });
    }(requirejs, fish, window, document);