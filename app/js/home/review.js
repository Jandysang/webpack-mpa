//有关点评内容的脚本
;
! function(R, F, window, document, undefined) {
    define([ "../../public/fish/js/fish.scroll.js", "./data.js","./buried_point.js"], function(cruiseScroll, PFData,cbPoint) {
        //  分页异步
        fish.admin.config({ mPage: { v: '0.5.6', g: 2016022501, css: 1 } });
        // var cruiseId = fish.one('#HidCruiseId').val();
        var url = "/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=2&tagId=1&dpCruiseId=" + PFData.cruiseId + "&SortType=0";
        commonAjaxFn(url);

        function commonAjaxFn(url, isloading) {
            var dataUrl;
            /**
             数据格式的处理成JSON在转换成json串
             */
            var params = url.split("&");
            var json = {
                "pageSize": params[3].split("=")[1],
                "dpCruiseId": params[5].split("=")[1],
                "SortType": params[6].split("=")[1],
                "tagId": params[4].split("=")[1]
            }
            url = params[0] + "&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&param=" + JSON.stringify(json);
            dataUrl = url.substring(0, url.length - 1);
            fish.all("#ctrlPager").mPage({
                startWithAjax: true,
                //  pageNO: "page",//页码的请求参数名,
                callback: function(data) {

                    if (!data || !data.CountInfo) {
                        F.all(".satisfaction_wrap,.reviews,#ctrlPager", F.one(".unit-review .review-pro")).addClass("none");
                        F.all(".review-pro-nothing", F.one(".unit-review .review-pro")).removeClass("none");
                        return;
                    }

                    var data1 = data.CountInfo,
                        data2 = data.CommentInfos;
                    if ((!data2 || data2.length < 1) && fish.one(".satisfaction_wrap").html().length < 1) {

                        F.all(".satisfaction_wrap,.reviews,#ctrlPager", F.one(".unit-review .review-pro")).addClass("none");
                        F.all(".review-pro-nothing", F.one(".unit-review .review-pro")).removeClass("none");
                        return;
                    }

                var temp1 = '<div class="rates">\
                                <strong>{{=it[0].CompositeScore}}<em>分</em></strong><span>综合得分</span>\
                             </div>\
                             <div class="rates_list">\
                                <div class="line_dp clearfix">\
                                    <span class="r_position">邮轮体验 :</span>\
                                    <div class="rates_box r_position">\
                                        <span class="pray_bg"><span class="yellow_bg" style="width: {{=(20*it[0].CruiseTyScore+2)}}px;"></span></span></span>\
                                </div>\
                                <span class="r_num r_position">{{=it[0].CruiseTyScore}}分</span>\
                                </div>\
                                <div class="line_dp clearfix">\
                                    <span class="r_position">客服服务 :</span>\
                                    <div class="rates_box r_position">\
                                        <span class="pray_bg"><span class="yellow_bg" style="width: {{=(20*it[0].ServiceScore+2)}}px;"></span></span>\
                                    </div>\
                                    <span class="r_num r_position">{{=it[0].ServiceScore}}分</span>\
                                </div>\
                                <div class="line_dp bad_line_dp clearfix">\
                                    <span class="r_position">岸上风光 :</span>\
                                    <div class="rates_box r_position">\
                                        <span class="pray_bg"><span class="yellow_bg" style="width: {{=(20*it[0].TravelScore+2)}}px;"></span></span>\
                                    </div>\
                                    <span class="r_num r_position">{{=it[0].TravelScore}}分</span>\
                                </div>\
                             </div>\
                             <div class="experience">\
                                <div class="scores">\
                                   <span class="s_text2">大家感受 :</span>\
                                </div>\
                                <dl class="scores_litem">\
                                    {{for(var n = 0,m = it[0].DpTagList.length;n < m; n++){ }}\
                                        {{? (it[0].DpTagList[n]).TagId>6}}\
                                        <dd class="s_list4 reviewInput" data-id="{{=((it[0]).DpTagList)[n].TagId}}" data-type="{{=((it[0]).DpTagList)[n].TagType}}">{{=((it[0]).DpTagList)[n].TagName}}</dd>\
                                        {{?}}\
                                    {{}}}\
                                </dl>\
                            </div>\
                            <div class="rules">\
                                <p>您可对已购订单立刻发表点评</p>\
                                <a class="dp_link" href="http://member.ly.com/center/order">立即点评</a>\
                                <span class="pre_t present_tip"><span></span>点评奖金规则</span>\
                            </div>',
                      temp2 = '{{for(var n = 0,m = it[0].DpTagList.length;n < m; n++){ }}\
                                {{? (it[0].DpTagList[n]).TagId<6}}\
                                    {{?(it[0].DpTagList[n]).TagId==1}}\
                                    <label for="reviewInt{{=(it[0].DpTagList[n]).TagId}}" class="lab_sty"><input type="radio" data-id="{{=(it[0].DpTagList[n]).TagId}}" data-type="{{=(it[0].DpTagList[n]).TagType}}" id="reviewInt{{=(it[0].DpTagList[n]).TagId}}" name="reviewType" checked="checked" class="reviewInput" attr-total="{{=it[0].all}}" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=2&tagId={{=(it[0].DpTagList[n]).TagId}}">{{=(it[0].DpTagList[n]).TagName}}{{? (it[0].DpTagList[n]).TagName.indexOf((it[0].DpTagList[n]).TagNum)==-1}}({{=it[0].All}}){{?}}</label>\
                                    {{??}}\
                                    <label for="reviewInt{{=(it[0].DpTagList[n]).TagId}}" class="lab_sty"><input type="radio" data-id="{{=(it[0].DpTagList[n]).TagId}}" data-type="{{=(it[0].DpTagList[n]).TagType}}" id="reviewInt{{=(it[0].DpTagList[n]).TagId}}" name="reviewType" class="reviewInput"  attr-total="{{=it[0].all}}" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=2&tagId={{=(it[0].DpTagList[n]).TagId}}">{{=(it[0].DpTagList[n]).TagName}}{{? (it[0].DpTagList[n]).TagName.indexOf((it[0].DpTagList[n]).TagNum)==-1}}({{=it[0].All}}){{?}}</label>\
                                    {{?}}\
                                {{?}}\
                              {{}}}\
                               <div class="review_select">\
                                    <span class="paixu at" attr-type="0">默认排序</span><span class="paixu" attr-type="1">最有价值 ↑</span><span class="paixu" attr-type="3">时间排序 ↑</span>\
                                </div>',
                        temp3 = '{{for(var n = 0,m = it.length;n < m; n++){ }}\
                              <div class="review_lists clearfix">\
                                  {{? it[n].IsElite == "1"}}<span class="essence_reviews"></span>{{?}}\
                                  <div class="author">\
                                      <img src="{{=it[n].UserAvatar}}">\
                                      <span class="lev leve{{=it[n].Level}}"></span>\
                                      <p class="" title="{{=it[n].NickName}}">{{=it[n].NickName}}</p>\
                                      <span class="user_0{{=it[n].Level}}"></span>\
                                  </div>\
                                  <div class="right_main">\
                                    <!-- 游客点评内容  -->\
                                    <div class="c_details">\
                                        <p><span>{{=it[n].Comment}}</span><a class="checkmore" style="display: none;"><span>展开全部</span></a></p>\
                                    </div>\
                                    <!-- 图片展示 -->\
                                    {{? it[n].PhotoSizeList == ""}}{{??}}\
                                    <div class="pic_show clearfix"  attr-img="{{=it[n].PhotoSizeList}}" attr-maxImg="{{=it[n].PhotoList}}">\
                                        <div class="pic_box">\
                                            {{for(var i = 0,j = it[n].PhotoSizeList.length;i < j; i++){}}\
                                              <img class="pic_right" src="{{=it[n].PhotoSizeList[i]}}" alt="" imgid="{{=i}}">\
                                            {{?}}\
                                        </div>\
                                        <a class="pic_right" imgid="0" style="display: none">查看更多</a>\
                                    </div>{{?}}\
                                    <!-- 发表时间 -->\
                                    <div class="c_dates clearfix">\
                                        <div class="reward_type">\
                                            <span class="family_t">{{=it[n].WalkAimDes}}</span>\
                                        </div>\
                                        <span class="reward_time">\
                                            {{=it[n].CreateDateSoa}}&nbsp;\
                                            发表于{{? it[n].CommentSource == 2}}<i class="pc"></i>{{??}}<i class="app"></i>{{?}}\
                                            {{=it[n].CommentSourceDes}}\
                                        </span>\
                                    </div>\
                                    <!-- 同程回复 -->\
                                    {{? it[n].Response ==""}}\
                                    {{??}}\
                                    <div class="tc_review">\
                                        <p>\
                                            <span>同程回复：</span>{{=it[n].Response}}\
                                        </p>\
                                    </div>\
                                    {{?}}\
                                  </div>\
                                {{? it[n].Response == 0}}\
                                <span class="reward_support none" resId="{{=it[n].ResId}}"><span><em>{{=it[n].PraiseCount}}</em>有用</span></span>\
                                {{??}}\
                                <span class="reward_support none reward_supported" resId="{{=it[n].ResId}}"><span><em>{{=it[n].PraiseCount}}</em>有用</span></span>\
                                {{?}}\
                                </div>\
                                {{ } }}';

                    if (isloading) {
                        fish.mPop.close();
                    }

                    //综合评分
                    if (fish.trim(fish.one(".satisfaction_wrap").html()).length < 1) {
                        fish.one(".satisfaction_wrap").html(fish.template(temp1, data1));
                    }
                    //筛选项
                    if (fish.trim(fish.one(".dp_tab").html()).length < 1) {
                        fish.one(".dp_tab").html(fish.template(temp2, data1));
                    }
                    //点评内容
                    if (!data2) {
                        fish.one(".dp_list").html("");
                    } else {
                            for(var i=0;i<data2.length;i++){
                            if(data2[i].HighLightList&&data2[i].HighLightList.length>0){
                                var data=data2[i].HighLightList;
                                for(var j=0;j<data.length;j++){ 
                                var span="<i style='color:#f6810d'>"+data[j]+"</i>",comtent=data2[i].Comment;                       
                                comtent.replace(new RegExp(data[j],'gm'), span);
                                data2[i].Comment=comtent.replace(new RegExp(data[j],'gm'), span);
                                }
                            }
                        }
                        fish.one(".dp_list").html(fish.template(temp3, data2));
                    }


                    //分页模块显示隐藏
                    if (fish.one("#ctrlPager").html().length > 0 || (!data2)) {
                        fish.one("#ctrlPager").removeClass("none");
                    } else {
                        fish.one("#ctrlPager").addClass("none");
                    }




                    //点赞
                    fish.all(".reward_support").on("click", function() {
                        var that = this,
                            uDpId = this.getAttribute("resId"),
                            cnuser = fish.cookie.get("us", "userid");
                        if (fish.one(that).hasClass("reward_supported")) return;
                        if (!cnuser) {
                            fish.mLogin();
                        } else {
                            var params = { "praiseId": uDpId, "userid": cnuser }
                            fish.one(that).addClass("reward_supported");
                            fish.one("em", that).html(parseInt(fish.one("em", that).html()) + 1);
                            fish.ajax({
                                url: "/youlun/CruiseTours/CruiseToursAjax.aspx?Type=GetCommentPraise",
                                data: "praiseId=" + uDpId + "&userId=" + cnuser,
                                type: 'json',
                                fn: function(date) {
                                    var dpTip = fish.one("#dp_tip");

                                    var oLeft = fish.one(that).offset().left + 40,
                                        oTop = fish.one(that).offset().top,
                                        speed = 30,
                                        time = 400;
                                    dpTip.css(
                                        "top:" + oTop + "px;left:" + oLeft + "px;display:block;opacity:0;filter:alpha(opacity=0)"
                                    );

                                    dpTip.anim(
                                        "top:" + (parseInt(oTop, 10) - speed) + "px;left:" + (parseInt(oLeft, 10)) + "px;opacity:1;filter:alpha(opacity=100)",
                                        time, {
                                            fn: function() {
                                                dpTip.css("display:none;top:;left:;opacity:;filter:;");
                                            },
                                            easeing: function() {
                                                //轨迹函数，
                                            }
                                        }
                                    );
                                }
                            })
                        }
                    })

                    //点评内容过多隐藏
                    fish.all(".c_details p").each(function(elem, i) {
                        var that = fish.one(elem),
                            height = that.height();
                        if (height > 72) {
                            var str = fish.one("span", that).html(),
                                html = str.substring(0, 200) + "...";
                            that.css("height:72px;");
                            fish.one("span", that).html(html);
                            fish.one(".checkmore", this).css("display:block").on("click", function() {
                                if (fish.one(this).hasClass("hide")) {
                                    fish.one(this).removeClass("hide");
                                    that.css("height:72px;");
                                    fish.one("span", that).html(html);
                                    fish.one("span", this).html("展开全部");
                                    cbPoint.dpFnTrackEvent("dppage_labload", "^youlun^1^"+PFData.cruiseId+"^");
                                } else {
                                    fish.one(this).addClass("hide");
                                    that.css("height:auto;");
                                    fish.one("span", that).html(str);
                                    fish.one("span", this).html("收起全部");
                                }
                            });
                        }
                    })

                    //查看更多图片
                    picFrame();
                     //分页翻页埋点
                    fish.all("#ctrlPager .bag_page a").each(function (item,index) {
                        fish.one(this).on("click", function () {
                            var  now_page = 1;
                            var tagId=0,typeId=0,now_page=1;
                            var now_type=fish.dom(".reviews .experience .scores_litem .clickTag")||fish.dom(".dp_tab label input");
                            var _this=fish.all("#ctrlPager .pagenum").length-1;
                            var totalPage=parseInt(fish.one(fish.all("#ctrlPager .pagenum")[_this]).html(),10);
                            if (fish.one(this).hasClass("prevGrey")) {
                                now_page =1;
                            } else if (fish.one(this).hasClass("nextGrey")) {
                                now_page=totalPage;
                            }else if(fish.one(this).hasClass('prevNormal')){
                                now_page=parseInt(fish.one("#ctrlPager .bag_page .current_page").val(),10)-1;
                            }else if(fish.one(this).hasClass('nextNormal')){
                                now_page=parseInt(fish.one("#ctrlPager .bag_page .current_page").val(),10)+1;
                            }else{
                                now_page=parseInt(fish.one(this).html(),10);
                            }
                            cbPoint.dpFnTrackEvent("dppage_load", "^youlun^" +fish.one(now_type).attr("data-id") + "^a,"+fish.one(now_type).attr("data-type")+"^" + now_page  + "^");
                        })
                    });
                    cruiseScroll.update();
                },
                preSortTotal: function(data) {
                    return data.PageCount && data.PageCount <= 1 ? 0 : data.PageCount;
                },
                ajaxObj: {
                    type: 'json',
                    url: dataUrl + ",\"page\":\"{pagenum}\"}",
                    fn: function(data) {
                        return JSON.parse(data.result);
                    }
                },
                skip: "true" //带页面跳转框
            });
        }

        //点评筛选
        function updateRecommandCont() {
            var typeid = 0,
                ifloading = true;
            fish.all(".review_select span").each(function() {
                if (fish.one(this).hasClass("at")) {
                    typeid = fish.one(this).attr("attr-type");
                }
            });
            fish.all(".reviews .dp_tab input").each(function() {
                if (fish.dom(this).checked) {
                    var _curl = fish.one(this).attr("sttr-url");
                    _curl += "&dpCruiseId=" + PFData.cruiseId + "&SortType=" + typeid;
                //好评中评差评标签埋点
                var typeId=fish.one(this).attr("data-type");
                var tagId=fish.one(this).attr("data-id");
                cbPoint.dpFnTrackEvent("dppage_sel", "^youlun^" +PFData.cruiseId+"^"+tagId+ "^a,"+typeId+ "^1^");
                    fish.mPop({
                        content: fish.one("#inline_example_load"),
                        afterOpen: function() {
                            commonAjaxFn(_curl, ifloading);
                            window.scrollTo(0, fish.one(".reviews").offset().top - fish.one(".f_tit").height());
                        }
                    });
                }
            });
            //语义标签模块数据加载
            fish.all(".experience .scores_litem .s_list4 ").each(function(item,index){
                var $this = fish.one(this);
                if($this.hasClass("clickTag")){
                    var _curl=fish.one(this).attr("data-id");
                    _curl="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=2&tagId="+_curl+"&dpCruiseId="+PFData.cruiseId+"&SortType="+typeid;
                    //语义标签埋点
                    var typeId=fish.one(this).attr("data-type");
                    var tagId=fish.one(this).attr("data-id");
                    cbPoint.dpFnTrackEvent("dppage_sel", "^youlun^" +PFData.cruiseId+"^"+tagId+ "^a,"+typeId+ "^1^");
                    fish.mPop({
                        content: fish.one("#inline_example_load"),
                        afterOpen: function() {
                            commonAjaxFn(_curl, ifloading);
                            window.scrollTo(0, fish.one(".reviews").offset().top - fish.one(".f_tit").height());
                        }
                    });
                }
            });
        }

        fish.one("#ctrlPager").delegate("a", "click", function(e) {
            var target = fish.getTarget(e);
            if (fish.one(target).hasClass("currentpage") || fish.one(target).hasClass("prevGrey") || fish.one(target).hasClass("nextGrey")) return;
            window.scrollTo(0, fish.one(".reviews").offset().top - fish.one(".f_tit").height());
        }).delegate(".page_btn", "click", function() {
            //点击分页GO按钮埋点
            var tagId=0,typeId=0,now_page=1;
            var now_type=fish.dom(".reviews .experience .scores_litem .clickTag")||fish.dom(".dp_tab label input");
            var now_page= fish.one("#ctrlPager .bag_page .current_page").val();
            cbPoint.dpFnTrackEvent("dppage_load", "^youlun^" + fish.one(now_type).attr("data-id")+ "^a,"+fish.one(now_type).attr("data-type")+"^" + now_page+ "^");
            window.scrollTo(0, fish.one(".reviews").offset().top - fish.one(".f_tit").height());
        });

        //点击查看更多图片
        function picFrame() {
            fish.all(".pic_show").each(function(elem, i) {
                var length = fish.all("img", elem).length,
                    arr = fish.one(elem).attr("attr-img").split(","),
                    arrMax = fish.one(elem).attr("attr-maxImg").split(",");
                if (length > 4) { //大于4张，隐藏后面
                    var str = "";
                    for (var i = 0; i < 4; i++) {
                        str += "<img src='" + arr[i] + "' class='pic_right' alt='' imgid='" + i + "'/>"
                    }
                    fish.one(".pic_box", elem).html(str);
                    fish.all(".pic_right", elem).css("display:block");
                }
                fish.all(".pic_right", elem).on("click", function() { //点击显示弹框，所有图片
                    var imgid = parseInt(fish.one(this).attr("imgid"), 10),
                        imgurl = arrMax[imgid],
                        imgstr = "<ul class='photo-list' page='1'>",
                        framestr = "";
                    if (imgid == 0) {
                        imgurl = arrMax[imgid];
                    }
                    for (var i = 0; i < length; i++) {
                        imgstr += '<li picunm="' + (i + 1) + '"><img src="' + arrMax[i] + '" alt=""/><i></i></li>'
                    }
                    imgstr += "</ul><a href='javascript:;' class='pa-l'></a><a href='javascript:;' class='pa-r'></a>";
                    framestr += '<div class="big-photo">\
                            <img src="' + imgurl + '">\
                            <span class="big-p-num">' + (imgid + 1) + '/' + length + '</span>\
                         </div>\
                         <div class="pa-box">' + imgstr + '</div>';
                    fish.one(".popc-con").html(framestr);
                    fish.mPop({
                        content: fish.one(".photo-album"),
                        afterOpen: function() {
                            var totalage = Math.ceil(length / 4);
                            if (length < 5) {
                                fish.all(".pa-l,.pa-r").html("remove");
                            }
                            fish.one(".photo-list").css("width:" + (length * 184) + "px;");
                            fish.one(".photo-album .popName").html(PFData.cruiseName);
                            fish.one(fish.all(".photo-list li")[imgid]).addClass("photo-at");
                            fish.all(".photo-list li").each(function(elem, i) {
                                fish.one(elem).on("mouseover", function() { //hover图片切换
                                    chiocePic(i, length);
                                })
                            });
                            fish.one(".pa-l").on("click", function() { //点击向左滑
                                var page = parseInt(fish.one(".photo-list").attr("page"), 10);
                                if (page == 1) return;
                                page = page - 1;
                                fish.one(".photo-list").attr("page", page);
                                fish.one(".photo-list").anim("left:" + -((page - 1) * 736) + "px;", 100);
                                chiocePic(((page * 4) - 4), length);
                            });
                            fish.one(".pa-r").on("click", function() { //点击向右滑
                                var page = parseInt(fish.one(".photo-list").attr("page"), 10);
                                if (page == totalage) return;
                                fish.one(".photo-list").anim("left:" + -(page * 736) + "px;", 100);
                                page = page + 1;
                                fish.one(".photo-list").attr("page", page);
                                chiocePic(((page * 4) - 4), length);
                            });
                        }
                    });
                    //图片埋点：
                var dpId=fish.one(".dp_list .reward_support").attr("resid");
                var imgId=fish.one(this).attr("imgid");
                var now_type=fish.dom(".reviews .experience .scores_litem .clickTag")||fish.dom(".dp_tab label input");
                cbPoint.dpFnTrackEvent("dppage_pic", "^youlun^1^" +dpId+"^"+imgId+"^"+PFData.cruiseId+"^"+fish.one(now_type).attr("data-id")+"^a,"+fish.one(now_type).attr("data-type")+ "^"+length+"^");
                })
            })
        }
        //弹框图片自动选中
        function chiocePic(i, length) {
            fish.one(".big-photo img").attr("src", fish.one(fish.all(".photo-list li img")[i]).attr("src"));
            fish.one(".big-p-num").html(fish.one(fish.all(".photo-list li")[i]).attr("picunm") + "/" + length);
            fish.all(".photo-list li").removeClass("photo-at");
            fish.one(fish.all(".photo-list li")[i]).addClass("photo-at");
        }

        fish.on("click", function(e) {
            var target = fish.getTarget(e);
            do {
                var cname = target.className;
                if (cname && cname.indexOf("reviewInput") > -1) { //  选择点评
                    //语义标签点评感受筛选
                    if(fish.one(target).hasClass('s_list4')){
                        fish.all(".s_list4").removeClass("clickTag");
                        fish.one(target).addClass("clickTag");
                        fish.all('.lab_sty').each(function(item,index){
                            var ele=fish.dom(item);
                            if(fish.dom(fish.one("input",ele)).checked){
                            var id=fish.one(ele.children).attr("id");
                            var data_id=fish.one(ele.children).attr("data-id");
                            var data_type=fish.one(ele.children).attr("data-type");
                            var attr_total=fish.one(ele.children).attr("attr-total");
                            var sttr_url=fish.one(ele.children).attr("sttr-url");
                            var str="<input type='radio' id='"+id+"' name='reviewType' data-id='"+data_id+"' data-type='"+data_type+"' class='reviewInput' attr-total='"+attr_total+"' sttr-url='"+sttr_url+"'>";
                            str+=ele.innerHTML.split('>')[1];
                            fish.one(item).html(str);
                        }
                        })
                        fish.all(".experience .scores_litem .s_list4").each(function(item,index){
                            fish.one(item).css("color:#666");
                        })
                        fish.one(target).css("color:#fff");
                    }else{
                        fish.all(".s_list4").removeClass("clickTag");
                        fish.all(".experience .scores_litem .s_list4").each(function(item,index){
                            fish.one(item).css("color:#666");
                        })
                    }
                    setTimeout(function() {
                        updateRecommandCont();
                    }, 10);
                    return;
                } else if (cname && cname.indexOf("paixu") > -1) { //排序
                    fish.all(".review_select span").removeClass("at");
                    fish.one(target).addClass("at");
                    setTimeout(function() {
                        updateRecommandCont();
                    }, 10);
                    return;
                } else if (cname && cname.indexOf("look") > -1) {
                    window.scrollTo(0, fish.one(".calbox").offset().top - fish.one(".intr_tit").height());
                } else if (cname && cname.indexOf("top_proInfo") > -1) {
                    return;
                }
            } while (target = target.parentNode);
        }, "body");
        fish.on("mouseover", function(e) {
            var target = fish.getTarget(e);
            do {
                var cname = target.className;
                if (cname && cname.indexOf("pre_t") > -1) { //  奖金规则
                    showC = true;
                    var off = getOffset(target, 33, -8),
                        ww = fish.one(window).width();
                    fish.one("#prizeRules").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                    cutOverstep("#prizeRules", target, ww);
                    return;
                } else if (cname && cname.indexOf("top_proInfo") > -1) {
                    return;
                }
            } while (target = target.parentNode);
        }, ".content");
        fish.on("mouseout", function(e) {
            var target = fish.getTarget(e);
            do {
                var cname = target.className;
                if (cname && cname.indexOf("pre_t") > -1) { //  console.log("奖金规则");
                    showC = false;
                    setTimeout(function() {
                        if (!showC) {
                            fish.one("#prizeRules").css({ "display": "none" });
                        }
                    }, 100);
                    return;
                } else if (cname && cname.indexOf("top_proInfo") > -1) {
                    return;
                }
            } while (target = target.parentNode);
        }, ".content");
        fish.on("mouseover", function() {
            showC = true
        }, "#prizeRules");
        fish.on("mouseout", function() {
            showC = false;
            setTimeout(function() {
                if (!showC) {
                    fish.one("#prizeRules").css({ "display": "none" });
                }
            }, 100);
        }, "#prizeRules");

        //  节点的offset方法  elem为节点，top定位需要添加的像素int，left定位需要left的像素
        function getOffset(elem, top, left) {
            var off = fish.one(elem).offset();
            return {
                top: off.top + (top ? top : 0),
                left: off.left + (left ? left : 0)
            }
        }

        //  弹框超出widow范围
        function cutOverstep(elem, tar, ww) {
            var off = getOffset(elem),
                toff = getOffset(tar),
                th = fish.one(elem);
            if ((off.left + th.width() + 10) > ww) {
                var san = fish.one(".comm_s", th),
                    target = fish.one(tar);
                san.removeClass("comm_s").addClass("comm_sr");
                th.css("top:" + (toff.top + target.height() + 8) + "px;left:" + (toff.left - 367 + target.width()) + "px;");
            }
        }
    });
}(requirejs, fish, window, document);
