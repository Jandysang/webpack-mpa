/**
 * Created with JetBrains WebStorm.
 * User: ghy
 * Date: 15-6-3
 * Time: 上午9:48
 * To change this template use File | Settings | File Templates.
 *
 *添加搜索页埋点统计 by zd 2016-04-06
 */
;
(function() {
	fish.admin.config({
		Calendar: {
			v: "0.3",
			css: 1,
			g: 20140333106
		},
		mPage: { v: '0.5.4', g: 20130111, css: 1 }
	});

	//0.0.4新增获取lid参数
	var lId = getLid();
	//搜索条件
	var dest = fish.one(".searchConditonLab").attr("data-dest");

	//新增查询条件
	var sC = {};
	//只统计一次
	var rateTimes = 0;

	// /youlun/tours-71997.html 获取lineid
	String.prototype.getLineId = function() {
		return this.split("-")[1].split(".")[0];
	};

	// String.AddParams
	String.prototype.addParams = function(obj) {
		var s = this;
		var _s = "";
		if (typeof obj === "object") {
			for (var i in obj) {
				if (obj[i]) {
					_s += "&" + i + "=" + obj[i];
				}
			}
		}
		if (_s) {
			if (s.indexOf("?") > -1) {
				s += _s;
			} else {
				s += "?" + _s.substring(1, _s.length);
			}
		}
		return s;
	};


	//获取地址栏参数
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	function stringFromJson(jsonObj) {
		var s = "";
		for (var i in jsonObj) {
			s += i + "=" + jsonObj[i] + "&";
		}
		return s.substring(0, s.length - 1);
	}

	function extendObj(a, b) {
		if (typeof a === "object" && typeof b === "object") {
			for (var i in b) {
				a[i] = b[i];
			}
		}
		return a;
	}

	function Base64() {

		// private property
		_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		// public method for encoding
		this.encode = function(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = _utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		}

		// public method for decoding
		this.decode = function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		}

		// private method for UTF-8 encoding
		_utf8_encode = function(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		}

		// private method for UTF-8 decoding
		_utf8_decode = function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while (i < utftext.length) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	}

	//初始统计
	var rate = function() {

		if (rateTimes > 0) {
			return;
		}

		//搜索页线路统计需要传递的参数
		var hiddenObj = fish.one(".searchConditonLab");
		var obj = {};
		var _base64 = new Base64();
		obj.HxId = hiddenObj.attr("data-hxid"); //航线id
		obj.HxCid = hiddenObj.attr("data-hxcname"); //子航线id
		obj.CompanyId = hiddenObj.attr("data-companyid"); //公司id
		obj.CruiseId = hiddenObj.attr("data-cruiseid"); //船队id
		obj.HarbourId = hiddenObj.attr("data-harbourid"); //港口id
		obj.DateId = hiddenObj.attr("data-dateid"); //出发月份
		obj.DayNum = hiddenObj.attr("data-daynumid"); //天数
		sC = obj = { SearchCondition: _base64.encode(encodeURIComponent(JSON.stringify(obj))) };

		var option = {
			"PageType": "AdvancedSearchPage",
			"Userid": (typeof getMemberId === "undefined") ? 0 : getMemberId(),
			"Lid": lId,
			"Url": encodeURIComponent(location.href),
			"v": new Date().getTime()
		};

		option = extendObj(option, obj);

		fish.ajax({
			url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseSpecialStatistic",
			data: stringFromJson(option),
			openType: "post",
			fn: function() {
				rateTimes++;
			}
		});

	}

	//绑定Key值,新增查询条件obj
	var bindKey = function(fDom) {

		var oA = fDom;
		var l = oA.length;
		//不满足，直接return
		if (l < 1) return;

		var aLineId = [],
			oB = [],
			sLs = '';

		for (var i = 0; i < l; i++) {
			var sL = oA[i].getAttribute('href') ? oA[i].getAttribute('href').getLineId() : '';
			aLineId.push(sL);
			oB.push({ 'ind': i, 'lid': sL });
		}

		sLs = aLineId.join(',');

		//查询条件对象
		var obj = sC;

		fish.ajax({
			url: "/youlun/AjaxCall_Cruise.aspx?Type=GenerateSpecialStatisticKey",
			data: "LineIds=" + sLs + "&lid=" + lId + '&v=' + new Date().getTime(),
			type: "json",
			timeout: 8000,
			fn: function(data) {

				if (data && data.length > 0) {
					for (var i = 0, l = data.length; i < l; i++) {
						for (var j = 0, jl = oB.length; j < jl; j++) {
							if (oB[j].lid == data[i].LineId && data[i].Key) {
								var sU = oA[oB[j].ind].getAttribute('href');
								if (oA[oB[j].ind].getAttribute('href').indexOf('Key') > -1) continue;
								var sNu = sU.addParams({ "Key": data[i].Key }).addParams(obj);
								oA[oB[j].ind].setAttribute('href', sNu);
							}
						}

					}
				}
			},
			err: function() {},
			onTimeout: function() {}
		});

	}

	//绑定lid
	window.bindLid = function(fDom) {

		//没有节点直接return;
		if (!fDom || !fDom.length) return;

		var lid = lId;

		for (var i = 0, l = fDom.length; i < l; i++) {
			var _this = fDom[i];
			var _lUrl = _this.getAttribute("href");
			if (_lUrl) {
				var _nUrl = _lUrl.addParams({ "lid": lId });
				_this.setAttribute("href", _nUrl);
			}
		}

	}

	// 获取lid
	function getLid() {
		var lid = '';
		if (GetQueryString("lid")) {
			lid = GetQueryString("lid");
			fish.cookie.set({ name: "cruiseSearchLid", value: lid });
			return lid;
		} else if (fish.cookie.get("cruiseSearchLid")) {
			lid = fish.cookie.get("cruiseSearchLid");
			return lid;
		} else {
			lid = '75';
			return lid;
		}
	}

	/*初始化异步*/
	fish.ready(function() {
		//是否是同程专线
		var serachLab = fish.one(".searchConditonLab"),
			isTcspeicalflag = serachLab.attr("data-tcspeicalflag");
		if (serachLab && serachLab.length == 1 && isTcspeicalflag && isTcspeicalflag == "1") {
			fish.one(".pre_tc i").removeClass("none");
			fish.one(".pre_tc").attr("attr-chiose", 1);
		}
		loadFenye();
		//页面统计
		rate();
		//绑定lid
		//bindLid(fish.all(".l_box li a"));
		//bindKey(fish.all(".l_box .linebox a"));
		workendactive();

	});

	//在线客服
	fish.one(".top_link").on("click", function() {
		window.scrollTo(0, 0);
	});
	//滚动事件
	window.onscroll = function() {
		var scroll = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop, //  滚动条高度
			fixElem = fish.one(".cond_tab"), //节点
			top = fixElem.offset().top, //   nav 节点top
			rFixElem = fish.one(".box_tab");
		if (scroll > top) {
			fish.one(".cond_tab_filterbox").css({ "position": "fixed", "top": 0, "z-index": 10 });
			fish.one(".box_tab").css({ "position": "fixed", "top": 0, "z-index": 10 });
		} else {
			fish.one(".cond_tab_filterbox").css({ "position": "" });
			fish.one(".box_tab").css({ "position": "" });
		}
		//回到顶部
		if (fish.one(window).scrollTop() > 50) {
			fish.one(".top_link").removeClass("none");
		} else {
			fish.one(".top_link").addClass("none");
		}
	};

	fish.one(".wx_link").on("mouseover", function() {
		fish.one(".app_fix").removeClass("none");
	}).on("mouseout", function() {
			fish.one(".app_fix").addClass("none");
		});


	/**回到顶部**/
	fish.one(".back").mFix({
		showType: "top", //返回顶部
		bottom: 150, //距离页面底部150px
		right: 50 //距离页面右部50px
	});



	//搜索框
	var date = new Date().getTime(),
		endDate = new Date("2016/05/21").getTime();
	if (date < endDate) {
		fish.one("#search").val("有爱❤出发").css("color:#333");
	} else {
		if (dest == "") {
			fish.one("#search").val(fish.one("#search").attr("attr-value"));
		}
	}

	function searchLength() {
		var hotsearch = fish.one(".hotSearch").width(),
			_width = 675 - hotsearch - 82 - 25;
		fish.one(".searchinput").css({ "width": _width + "px;" });
	}
	searchLength();

	fish.one("#search").on("blur", function() {
		var value = fish.trim(fish.one(this).val()),
			_value = fish.one(this).attr("attr-value");
		if (value == "") {
			fish.one(this).val(_value).css("color:#999;");
		} else {
			fish.one(this).css("color:#333;");
		}
	}).on("keyup", function(e) {
			var eve = fish.getEvent(e);
			var code = eve.keyCode ? eve.keyCode : e.which;
			if (code == 13) {
				toSearch();
				//搜索页按钮点击(回车也算)
				trackEventUseCookie({
					lable: "/sbox/k"
				});
			}
			var str = this.value;
			//this.value = str.replace(/[/\\~!@#$%^&*_\={}\[\];:'"\|,.<>?！￥……——｛｝【】；：‘“’”、《》，。、？]/g,"");
			var reg = new RegExp("[/\\~!@#$%^&*_\={}\[\];:\'\"\|,.<>?！￥……——｛｝【】；：‘“’”、《》，。、？]", "g");
			this.value = str.replace(reg, "");

			var value = encodeURIComponent(this.value);
			if (value == "") {
				fish.one(this).css("color:#999;");
				fish.one(".hotCity").removeClass("none");
				fish.one(".autoComplete").addClass("none");
			} else {
				fish.one(".hotCity").addClass("none");
				fish.one(this).css("color:#333;");
				fish.one(".autoComplete").removeClass("none");
				autoComplete(value);
			}
		})


	fish.one(".toSearch").on("click", function() {
		//搜索页按钮点击
		trackEventUseCookie({
			lable: "/sbox/k"
		});
		toSearch();
	})

	function toSearch() {
		var value = fish.trim(fish.one("#search").val()),
			_value = fish.one("#search").attr("attr-value"),
			lccityid = fish.one(".searchConditonLab").attr("data-lccity"); //定位城市
		lcCityIdStr = lccityid ? ("&lc=" + lccityid) : "";
		if (value == _value || value == "") {
			//跳到初始链接
			location.href = "/youlun/cruise-line-0-0-0-0-0-0-0-0-0-0.html" + lcCityIdStr;
			return false;
		}
		var date = new Date().getTime(),
			endDate = new Date("2016/05/21").getTime();
		if (date < endDate && encodeURIComponent(value) == "%E6%9C%89%E7%88%B1%E2%9D%A4%E5%87%BA%E5%8F%91") {
			fish.one(".tehui i").removeClass("none");
			fish.one(".tehui").attr("attr-chiose", 1);
			loadFenye();
			return;
		}
		if (fish.all(".autoComplete a.a_links").length == 1) {
			location.href = fish.one(".autoComplete a").attr("href");
			return;
		}
		location.href = "/youlun/cruise-line-0-0-0-0-0-0-0-0-0-0.html&dest=" + value + lcCityIdStr;
	}


	function autoComplete(val) {
		if (this.ajaxObj) this.ajaxObj.abort();
		this.ajaxObj = fish.ajax({
			url: "/youlun/AjaxcallTravel.aspx?type=GetFuzzySearch&lid=" + lId + "&dest=" + val + "&cityId=" + fish.one(".searchConditonLab").attr("data-lccity"),
			// url : "js/sercJsonData.txt",
			type: "json",
			fn: function(data) {
				var str = '',
					strLine = '',
					strCity = '',
					strShip = '',
					otherStr = '';
				if (data) {
					if (data.FuzzySearchInfos.length == 0) {
						fish.one(".autoComplete").html("").addClass("none");
						//触发下拉列表提示(目前只要记结果为0的
						searchTrackEvent("/sbox/ac", {
							k: encodeURIComponent(fish.one("#search").val()),
							//locCId : fish.one("#hidCityId").val(),
							//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
							rc: 0
						});
					} else {
						var thisData = data.FuzzySearchInfos;
						for (var i = 0, len = thisData.length; i < len; i++) {
							var regx = new RegExp(decodeURIComponent(val), "g"),
								replaceShowStr = thisData[i].Name.replace(regx, '<span class="c_fa7d29">$&</span>');
							switch (thisData[i].GroupType) {
								case 0:
									strLine += '<a class="a_links" _showName="' + thisData[i].Name + '" href="' + thisData[i].Url + '">' + replaceShowStr + '</a>';
									break;
								case 1:
									strCity += '<a class="a_links" _showName="' + thisData[i].Name + '" href="' + thisData[i].Url + '">' + replaceShowStr + '</a>';
									break;
								case 2:
									strShip += '<a class="a_links" _showName="' + thisData[i].Name + '" href="' + thisData[i].Url + '">' + replaceShowStr + '</a>';
									break;
								default:
									otherStr += '<a class="a_links" _showName="' + thisData[i].Name + '" href="' + thisData[i].Url + '">' + replaceShowStr + '</a>';
									break;
							}
						}
						if (strLine && strLine.length > 0) {
							str += ' <div class="show_cons"><span class="tip_span">航线</span>' + strLine + '</div>';
						}
						if (strCity && strCity.length > 0) {
							str += ' <div class="show_cons"><span class="tip_span">国家/城市</span>' + strCity + '</div>';
						}
						if (strShip && strShip.length > 0) {
							str += ' <div class="show_cons"><span class="tip_span">邮轮公司/船队</span>' + strShip + '</div>';
						}
						if (otherStr && otherStr.length > 0) {
							str += ' <div class="show_cons"><span class="tip_span">其他</span>' + otherStr + '</div>';
						}
						fish.one(".autoComplete").html("").html(str);

						fish.all(".autoComplete a").on("click", function() {
							var url = fish.one(this).attr("href"),
								html = encodeURIComponent(fish.one(this).attr("_showName"));
							tongjiClick(url, html);
						})


						fish.all(".autoComplete a").each(function(elem, i) {
							this.index = i;
							fish.one(this).on("click", function(evt) {
								var that = this,
									$this = fish.one(this);
								//搜索框下拉点击
								searchTrackEvent("/sbox/ac/click", {
									k: encodeURIComponent(fish.one("#search").val()),
									ct: encodeURIComponent(fish.one(this).attr("_showName")),
									pos: that.index + 1,
									//locCId : fish.one("#hidCityId").val(),
									//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
									pjId: "2007",
									jpTp: 1
								});
							});
						});
					}
				}
			},
			err: function() {}
		})
	}

	function tongjiClick(elem1, elem2) {
		fish.ajax({
			url: "/youlun/AjaxcallTravel.aspx?type=SaveFuzzyClick&lid=" + lId + "&pageUrl=" + elem1 + "&staType=5&pageDis=1&remark=" + elem2,
			type: "json",
			fn: function() {}
		})
	}

	fish.all(".hotword a").on("click", function() {
		var url = fish.one(this).attr("href"),
			html = encodeURIComponent(fish.one(this).html());
		tongjiClick(url, html);
	});




	/**筛选**/
	/*收缩展开折行筛选项*/
	/*显示隐藏更多*/
	fish.all(".cond_tab_conbox dl").each(function() {
		if (fish.one(this).attr("attr-param") == "hxid") {
			if (fish.one(this).height() > 41) {
				fish.one(".pack_up", this).css("display:block").html("更多<em></em>");
				fish.one(".pack_up", this).addClass("pack_down");
				fish.one("dd", this).addClass("hidden_dd");
			} else {
				fish.one(".pack_up", this).css("display:none");
			}
		}
		if (fish.one(this).attr("attr-param") == "companyid") {
			if (fish.one(this).height() > 41) {
				fish.one(".pack_up", this).css("display:block").html("更多<em></em>");
				fish.one(".pack_up", this).addClass("pack_down");
				fish.one("dd", this).addClass("hidden_dd");
			} else {
				fish.one(".pack_up", this).css("display:none");
			}
		}
		if (fish.one(this).attr("attr-param") == "cruiseid") {
			if (fish.one(this).height() > 41) {
				fish.one(".pack_up", this).css("display:block").html("更多<em></em>");
				fish.one(".pack_up", this).addClass("pack_down");
				fish.one("dd", this).addClass("hidden_dd");
			} else {
				fish.one(".pack_up", this).css("display:none");
			}
		}
		if (fish.one(this).attr("attr-param") == "harbourid") {
			if (fish.one(this).height() > 41) {
				fish.one(".pack_up", this).css("display:block").html("更多<em></em>");
				fish.one(".pack_up", this).addClass("pack_down");
				fish.one("dd", this).addClass("hidden_dd");
			} else {
				fish.one(".pack_up", this).css("display:none");
			}
		}
		if (fish.one(this).attr("attr-param") == "dateid") {
			if (fish.one(this).height() > 41) {
				fish.one(".pack_up", this).css("display:block").html("更多<em></em>");
				fish.one(".pack_up", this).addClass("pack_down");
				fish.one("dd", this).addClass("hidden_dd");
			} else {
				fish.one(".pack_up", this).css("display:none");
			}
		}
	});


	//点击效果

	//线路筛选
	fish.all(".cond_tab_conbox a").on("click", function() {
		if (fish.one(this).hasClass("on")) {
			return;
		}
		var emElem = fish.dom(this).parentNode,
			elElem = fish.dom(emElem).parentNode;
		var selectId = fish.one(this).attr("id"),
			typeId = fish.one(elElem).attr("attr-param"),
			typeName = fish.one("dt", elElem).html(),
			val = fish.one(this).attr("title");
		fish.all("a", emElem).removeClass("on");
		fish.one(this).addClass("on");
		if (val == "全部") {
			delElem(typeId);
		} else {
			delElem(typeId);
		}
	});


	//排序筛选
	fish.all(".a_chioce").on("click", function(e) {
		//搜索排序
		searchTrackEvent("/sort", {
			k: encodeURIComponent(fish.one(".searchConditonLab").attr("data-dest"))
			//locCId : fish.one("#hidCityId").val()
		});

		if (!fish.one(this).hasClass("rank")) {
			if (fish.one(this).hasClass("active")) {
				return;
			}
		}
		var target = fish.getTarget(e),
			cname = target.className;
		if (cname && cname.indexOf("salessort") > -1) {
			fish.all(".a_chioce").removeClass("active");
			fish.one(".salesPrice").addClass("active");
			if (target.innerHTML == "价格从低到高") {
				fish.one(".salesPrice").attr("price_info", 1);
				fish.one(".salesPrice font").html("价格从低到高");
			} else {
				fish.one(".salesPrice").attr("price_info", 0);
				fish.one(".salesPrice font").html("价格从高到低");
			}
			fish.one(".comment").html("满意度");
			fish.one(".dates").attr("price_info", 1);
			fish.one(".dates font").html("航期<i></i>");
			loadFenye();
		} else if (cname && cname.indexOf("comment") > -1) {
			fish.all(".a_chioce").removeClass("active");
			fish.one(".comment").addClass("active").html("满意度从高到低");
			fish.one(".salesPrice").attr("price_info", 0);
			fish.one(".salesPrice font").html("价格<i></i>");
			fish.one(".dates").attr("price_info", 1);
			fish.one(".dates font").html("航期<i></i>");
			loadFenye();
		} else if (cname && cname.indexOf("datessort") > -1) {
			fish.all(".a_chioce").removeClass("active");
			fish.one(".dates").addClass("active");
			if (target.innerHTML == "航期从近到远") {
				fish.one(".dates").attr("date_info", 0);
				fish.one(".dates font").html("航期从近到远");
			} else {
				fish.one(".dates").attr("date_info", 1);
				fish.one(".dates font").html("航期从远到近");
			}
			fish.one(".comment").html("满意度");
			fish.one(".salesPrice").attr("price_info", 0);
			fish.one(".salesPrice font").html("价格<i></i>");
			loadFenye();
		} else if (cname && cname.indexOf("all") > -1) {
			fish.all(".a_chioce").removeClass("active");
			fish.one(".all").addClass("active");
			fish.one(".comment").html("满意度");
			fish.one(".salesPrice").attr("price_info", 0);
			fish.one(".salesPrice font").html("价格<i></i>");
			fish.one(".dates").attr("price_info", 1);
			fish.one(".dates font").html("航期<i></i>");
			loadFenye();
		}
	}).on("mouseover", function() {
			fish.one("ul", this).removeClass("none");
		}).on("mouseout", function() {
			fish.one("ul", this).addClass("none");
		});


	/**选中同程专线**/
	fish.one(".pre_tc").on("click", function() {
		if (fish.one("i", this).hasClass("none")) {
			fish.one("i", this).removeClass("none");
			fish.one(this).attr("attr-chiose", 1);
		} else {
			fish.one("i", this).addClass("none");
			fish.one(this).attr("attr-chiose", 0);
		}
		loadFenye();
	});
	fish.all(".pre_tc .pre_icon").hover(
		function() {
			fish.one(".pre_tcW").removeClass("none");
		},
		function() {
			fish.one(".pre_tcW").addClass("none");
		}
	);
	/*优惠线路*/
	fish.one(".tehui").on("click", function() {
		if (fish.one("i", this).hasClass("none")) {
			fish.one("i", this).removeClass("none");
			fish.one(this).attr("attr-chiose", 1);
		} else {
			fish.one("i", this).addClass("none");
			fish.one(this).attr("attr-chiose", 0);
		}
		loadFenye();
	});

	fish.one(".cond_tab_filterbox").delegate("em", "click", function(e) {
		var tarEle = fish.getTarget(e);

		if (fish.all("i", tarEle).hasClass("none")) {
			fish.one("i", tarEle).removeClass("none");
			fish.one(tarEle).attr("attr-chiose", 1);
		} else {
			fish.one("i", tarEle).addClass("none");
			fish.one(tarEle).attr("attr-chiose", 0);
		}
		if (tarEle.tagName.toUpperCase() == "I") {
			fish.one(tarEle).parent().attr("attr-chiose", 0);
			fish.one(tarEle).addClass("none");
		}
		fish.one(".hide_sale").removeClass("show");
		loadFenye();
	});

	/*删除选项*/
	function delElem(e) {
		fish.all(".search_value").each(function() {
			if (fish.one(this).attr("typeid") == e) {
				fish.one(this).html("remove");
			}
		})
	}

	/*加载图片*/
	function loading() {
		//加载中...
		fish.mPop({
			content: fish.one("#inline_example_load"),
			top: 200
		});
	}


	/*添加criteoJS*/
	function criteoJS() {
		var mobile = fish.one("#mobile").val() || "";
		var idCriteo1 = fish.one("#criteoId1").val() || "";
		var idCriteo2 = fish.one("#criteoId2").val() || "";
		var idCriteo3 = fish.one("#criteoId3").val() || "";
		window.criteo_q = window.criteo_q || [];
		window.criteo_q.push({ event: "setAccount", account: 21750 });
		if (mobile != "") {
			window.criteo_q.push({ event: "setHashedEmail", email: mobile });
		}
		window.criteo_q.push({ event: "setSiteType", type: "d" }, { event: "viewList", item: [idCriteo1, idCriteo2, idCriteo3] });
	}

	/*分页*/
	var __v = {};
	__v.year = [];

	function loadFenye() {
		var hiddenObj = fish.one(".searchConditonLab");
		var producttypeid = hiddenObj.attr("data-producttypeid"), //产品类型
			hxid = hiddenObj.attr("data-hxid"), //邮轮航线
			hxcid = hiddenObj.attr("data-hxcname"), //航线子id
			companyid = hiddenObj.attr("data-companyid"), //邮轮公司
			cruiseid = hiddenObj.attr("data-cruiseid"), //船队id
			harbourid = hiddenObj.attr("data-harbourid"), //出发城市
			dateid = hiddenObj.attr("data-dateid"), //开航日期
			dayNum = hiddenObj.attr("data-daynumid"), //行程天数
			themeId = hiddenObj.attr("data-themeid"), //线路主题
			pctabid = hiddenObj.attr("data-pctabid"), //热门搜索加参数
			holidayid = hiddenObj.attr("data-holidayid"),
			istcRecommand = "0", //热门推荐
			sortManyiType = "0", //满意度
			sortPriceType = "0", //价格
			sortCmCountType = "0", //点评数
			sortSailDateType = "0", //出发日期
			baochuan = fish.one("#baochuan").attr("attr-chiose"), //包船
			lijian = "0", //立减
			tehui = fish.one(".tehui").attr("attr-chiose"), //特惠
			tejia = "0", //特价
			retui = "0", //热推
			qinziyou = "0", //亲子游
			shuqiyou = "0", //暑期游
			remenhangxian = "0", //热门航线
			fangxinyou = "0", //放心游
			tagNum = "", //勾选优惠
			isTCSpecialLine = fish.one(".pre_tc").attr("attr-chiose"); //同程专线
		lccityid = hiddenObj.attr("data-lccity"); //定位城市

		destWord = hiddenObj.attr("data-dest") ? ("&dest=" + encodeURIComponent(hiddenObj.attr("data-dest"))) : ""; //关键字

		lcCityIdStr = lccityid ? ("&lc=" + lccityid) : "";

		//搜索页线路统计需要传递的参数
		var obj = {};
		obj.HxId = hxid; //航线id
		obj.HxCid = hxcid; //子航线id
		obj.CompanyId = companyid; //公司id
		obj.CruiseId = cruiseid; //船队id
		obj.HarbourId = harbourid; //港口id
		obj.DateId = dateid; //出发月份
		obj.DayNum = dayNum; //天数
		obj = { SearchCondition: encodeURIComponent(JSON.stringify(obj)) };

		var urlStr = fish.one("#bqContent").attr("attr-url");
		fish.all(".cond_tab_filterbox a").each(function() {
			if (fish.one(this).hasClass("active")) {
				var strHtml = fish.one(this).html();
				if (strHtml.indexOf("综合排序") >= 0) {
					istcRecommand = "1";
				} else if (strHtml.indexOf("满意度") >= 0) {
					sortManyiType = "2";
				} else if (strHtml.indexOf("价格") >= 0) {
					if (fish.one(this).attr("price_info") == 0) {
						sortPriceType = "2";
					} else {
						sortPriceType = "1";
					}
				} else if (strHtml.indexOf("航期") >= 0) {
					if (fish.one(this).attr("date_info") == 0) {
						sortSailDateType = "2";
					} else {
						sortSailDateType = "1";
					}
				}
			}
		});

		//筛选排序，顺序打乱了，好龌龊
		tagNum = baochuan + lijian + tehui + tejia + retui + qinziyou + shuqiyou + remenhangxian + fangxinyou;
		tagNum = parseInt(tagNum, 2);

		urlStr += "&producttypeid=" + producttypeid + "&hxid=" + hxid + "&hxcid=" + hxcid + "&companyid=" + companyid + "&cruiseid=" + cruiseid + "&harbourid=" + harbourid + "&dateid=" + dateid + "&sortManyiType=" + sortManyiType + "&sortPriceType=" + sortPriceType + "&sortCmCountType=" + sortCmCountType + "&sortSailDateType=" + sortSailDateType + "&dayNum=" + dayNum + "&themeId=" + themeId + "&pctabid=" + pctabid + "&tagNum=" + tagNum + "&isTCSpecialLine=" + isTCSpecialLine + "&holidayId=" + holidayid + "&dest=" + encodeURIComponent(dest) + "&lccityid=" + lccityid;

		fish.all("#pageCountent").mPage({
			startWithAjax: true,
			pageNO: "pageNum", //页码的请求参数名,
			beforeAjaxFn: function() {
				if (fish.trim(fish.one('#bqContent').html()) != '') {
					loading();
				}
			},
			callback: function(data, num) {
				if (data) {
					//为了拿到真正的结果数（去掉同程推荐的线路）
					if (data.LineMessageMod) {
						var tcRecomm = 0,
							realRc = 0,
							forDspTongjiData = [];
						for (var i = 0, len = data.LineMessageMod.length; i < len; i++) {
							if (data.LineMessageMod[i].IsTCRecommend && data.LineMessageMod[i].IsTCRecommend == 1) {
								tcRecomm++;

								forDspTongjiData.push(data.LineMessageMod[i].LineId);
							}
						}
						if (!window.isRunDSP) {
							window.isRunDSP = true;
							dsp && dsp(forDspTongjiData.join(","));
						}
						forDspTongjiData = [];
						realRc = data.TotalLineCount - tcRecomm;
						realRc = realRc && realRc > 0 ? realRc : 0;
						if (!window.showTrackEvent) {
							window.showTrackEvent = true;
							//列表显示事件(翻页不算，翻页后重新到第一页后也不算)
							searchTrackEvent("/show", {
								k: encodeURIComponent(dest),
								//locCId : fish.one("#hidCityId").val(),
								//cityId : harbourid,
								rc: realRc
							});
						} else {
							//翻页统计
							if (num > 1) {
								searchTrackEvent("/page", {
									k: encodeURIComponent(fish.one(".searchConditonLab").attr("data-dest")),
									//locCId : fish.one("#hidCityId").val(),
									//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
									page: num
								});
							}
						}

						//搜索框按钮点击到列表页
						trackEventUseCookie({
							lable: "/sbox/k",
							type: 2,
							value: {
								k: encodeURIComponent(fish.one(".searchConditonLab").attr("data-dest")),
								//locCId : fish.one("#hidCityId").val(),
								//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
								rc: realRc
							}
						});
						//过滤统计
						trackEventUseCookie({
							type: 2,
							lable: "/filter",
							value: {
								k: encodeURIComponent(fish.one(".searchConditonLab").attr("data-dest")),
								//locCId : fish.one("#hidCityId").val(),
								//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
								rc: fish.one(".cond_tab_filterbox .tehui").attr("attr-chiose") - 0 == 1 ? data.YouhuiCount : realRc
							}
						});
					}
					fish.one("#bqContent").css("margin:0;width:auto;height:auto;background:none;");
					var stateStr = '',
						monthStr = '',
						stateData = data.CruiseSearchStartCityContinent,
						LeaveDates = data.SailDateByYearMod,
						totalPage = data.TotalPageNum,
						arr = [];
					if (fish.one("#stateName").html() == "") {
						stateStr = '{{for(var i = 0,j = it.length;i < j; i++){ }}\
                                        <a class="stateName{{? i == 0}} stateNameAt{{?}}">{{=it[i].ContinentName}}</a>\
                                    {{}}}\
                                    <div class="data_pop" id="cityType">\
                                        {{for(var i = 0,j = it.length;i < j; i++){ }}\
                                            <div class="data_main {{? i != 0}}none{{?}}">\
                                                {{for(var n = 0,m = it[i].StartCities.length;n < m; n++){ }}\
                                                    <a title="{{=it[i].StartCities[n].CityName}}" href="/youlun/cruise-line-' + hxid + '-' + companyid + '-0-' + dateid + '-{{=it[i].StartCities[n].CityId}}-' + hxcid + '-' + themeId + '-' + dayNum + '-' + cruiseid + '-' + producttypeid + '.html' + destWord + lcCityIdStr + '">{{=it[i].StartCities[n].CityName}}</a>\
                                                {{}}}\
                                            </div>\
                                        {{}}}\
                                    </div>\
                                    ';
						fish.one("#stateName").html(fish.template(stateStr, stateData));
					}
					__v.year = [];
					__v.holidayObj = [];
					//  初始化设置搜索月份数据
					function setSearchMonth() {

						var yList = __v.year,
							hObj = __v.holidayObj,
							html = "<div class='rqsliderCon'><span class='sliderBtn prevBtn prevBtnN none'></span><span class='sliderBtn nextBtn none'></span><div class='rqslider' attr-left='0'>",
							month = ["1月|01", "2月|02", "3月|03", "4月|04", "5月|05", "6月|06", "7月|07", "8月|08", "9月|09", "10月|10", "11月|11", "12月|12"];
						for (var n = 0, m = yList.length; n < m; n++) {
							var yHtml = '<div class="year_sty"><h4 class="year_tit">' + yList[n] + '年</h4>{{month}}</div>',
								yhString = "";
							for (var x = 0, y = month.length; x < y; x++) {
								var arr = month[x].split("|");
								yhString += '<a class="link_sty linksty link_none" href="/youlun/cruise-line-' +
									hxid + '-' + companyid + '-0-' + yList[n] + arr[1] + '-' + harbourid + '-' + hxcid + '-' + themeId + '-' + dayNum + '-' + cruiseid + '-' + producttypeid + '-0.html' + destWord + lcCityIdStr + '" _dValue="' + yList[n] + arr[1] + '" inputValue="' + yList[n] + "年" + arr[1] + '月">' + arr[0] + '</a>';
							}
							if (hObj[yList[n]]) {
								for (var _m = 0, _mLen = hObj[yList[n]].length; _m < _mLen; _m++) {
									var item = hObj[yList[n]][_m];
									yhString += "<a class='link_sty linksty" + (parseInt(item["Id"]) > 0 ? " " : " link_none") +
										"' href='/youlun/cruise-line-" + hxid + "-" + companyid + '-0-0-' + harbourid + '-' + hxcid + '-' + themeId + '-' + dayNum + '-' + cruiseid + '-' + producttypeid + '-' + item["Id"] + ".html" + destWord + lcCityIdStr + "'>" + item["Name"] + "</a>";
								}
							}

							yHtml = yHtml.replace("{{month}}", yhString);
							html += yHtml;
						}
						html += "</div></div>";
						return html;
					}
					for (var i = 0, j = LeaveDates.length; i < j; i++) {
						var obj = {};
						__v.year.push(LeaveDates[i].Year);
						for (var n = 0, m = LeaveDates[i].Pm.length; n < m; n++) {
							arr.push(LeaveDates[i].Pm[n].Value);
						}
						if (LeaveDates[i] && LeaveDates[i]["HolidayList"] && LeaveDates[i]["HolidayList"][0]) {
							obj[LeaveDates[i].Year] = LeaveDates[i]["HolidayList"];
							fish.lang.extend(__v.holidayObj, obj);
						}
					}
					if (fish.one(".scut_sty_main").html() == "") {
						fish.one(".scut_sty_main").html(setSearchMonth());
						if (fish.all(".year_sty").length == 1) {
							fish.one(".calendar_box .scut_sty .scut_sty_main").css("width:195px;")
						} else {
							fish.one(".calendar_box .scut_sty .scut_sty_main").css("width:391px;")
						}
						canSlider();

						fish.all(".calendar_box .scut_sty a").each(function(elem, i) {
							var that = fish.all(".calendar_box .scut_sty a"),
								levelDate = fish.one(that[i]).attr("_dvalue");
							for (var n = 0, m = arr.length; n < m; n++) {
								if (levelDate == arr[n]) {
									fish.one(that[i]).removeClass("link_none");
								}
							}
						})
						fish.all(".link_none").attr("href", "javascript:void(0);");
					}

					fish.dom("body").onclick = function(e) {
						var target = fish.getTarget(e),
							cname = target.className,
							parent = target.parentNode,
							hotCityP = fish.one(target).getParent(".hotCity"),
							historyP = fish.one(target).getParent(".history"),
							autoCompleteP = fish.one(target).getParent(".autoComplete");
						if (cname.indexOf("pack_hx") > -1 || cname.indexOf("pack_cd") > -1 || cname.indexOf("pack_ej") > -1 || cname.indexOf("pack_hs") > -1) {
							if (fish.one(target).hasClass("pack_down")) {
								fish.one(target).removeClass("pack_down").html("收起<em></em>");
								fish.one("dd", parent).removeClass("hidden_dd");
							} else {
								fish.one(target).addClass("pack_down").html("更多<em></em>");
								fish.one("dd", parent).addClass("hidden_dd");
							}
							fish.one(".calendar_box .scut_sty").addClass("none");
							fish.one(".moremonth").removeClass("more");
						} else if (cname.indexOf("pack_cs") > -1) {
							if (fish.one(target).hasClass("pack_down")) {
								fish.one(target).removeClass("pack_down").html("收起<em></em>");
								fish.one("dd", parent).removeClass("hidden_dd");
								if (fish.all(".stateName").length > 1) {
									fish.one("#cityName").addClass("none");
									fish.one("#stateName").removeClass("none");
								}
							} else {
								fish.one(target).addClass("pack_down").html("更多<em></em>");
								fish.one("dd", parent).addClass("hidden_dd");
								fish.one("#cityName").removeClass("none");
								fish.one("#stateName").addClass("none");
							}
							fish.one(".calendar_box .scut_sty").addClass("none");
							fish.one(".moremonth").removeClass("more");
						} else if (cname.indexOf("calendar_box") > -1 || cname.indexOf("moremonth") > -1 || cname.indexOf("year_tit") > -1 || cname.indexOf("year_sty") > -1 || cname.indexOf("sliderBtn") > -1 || cname.indexOf("link_none") > -1) {
							fish.one(".calendar_box .scut_sty").removeClass("none");
							fish.one(".moremonth").addClass("more");
						} else {
							fish.one(".calendar_box .scut_sty").addClass("none");
							fish.one(".moremonth").removeClass("more");
						}
						if (cname.indexOf("autoComplete") > -1 || autoCompleteP.length > 0) {
							fish.one(".autoComplete").removeClass("none");
						} else {
							fish.one(".autoComplete").addClass("none");
						}
						if (cname.indexOf("hotCity") > -1 || hotCityP.length > 0) {
							fish.one(".hotCity ").removeClass("none");
							if (historyP.length > 0 && target.tagName.toUpperCase() == "A") {
								fish.one(".hotCity ").addClass("none");
								fish.one(".autoComplete").removeClass("none");
							}
						} else {
							fish.one(".hotCity ").addClass("none");
						}
						if (cname.indexOf("searchinput") > -1) {
							var value = fish.trim(fish.one("#search").val()),
								_value = fish.one("#search").attr("attr-value");
							if (value == _value || value == "") {
								fish.one("#search").val("");
								fish.one(".hotCity").removeClass("none");
								fish.one(".autoComplete").addClass("none");
							} else {
								fish.one(".hotCity").addClass("none");
								fish.one(".autoComplete").removeClass("none");
							}
						}
					}
					fish.one("body").on("mouseover", function(e) {
						var target = fish.getTarget(e),
							cname = target.className,
							parent = target.parentNode;
						if (cname.indexOf("ts_x") > -1) {
							fish.one(target).removeClass("pack_down");
							fish.one("#dayType").removeClass("none");
							fish.one(".pack_lx").addClass("pack_down");
							fish.one("#productType").addClass("none");
							//fish.one("#dayType .data_main").css("width:" + fish.all("#dayType a").length * 82 + "px;");
						} else if (cname.indexOf("lx_x") > -1) {
							fish.one(target).removeClass("pack_down");
							fish.one("#productType").removeClass("none");
							if (fish.all("#productType a").length < 2) {
								//fish.one("#productType").css("left:-30px;");
								//fish.one("#productType .data_main").css("left:30px;");
							}
							fish.one(".pack_ts").addClass("pack_down");
							fish.one("#dayType").addClass("none");
							//fish.one("#productType .data_main").css("width:" + fish.all("#productType a").length * 65 + "px;");
						} else if (cname.indexOf("data_pop") > -1 || cname.indexOf("data_top") > -1 || cname.indexOf("data_main") > -1 || parent.className.indexOf("data_main") > -1) {
							if (target.id == "dayType") {
								fish.one(target).removeClass("pack_down");
								fish.one("#dayType").removeClass("none");
								//fish.one("#dayType .data_main").css("width:" + fish.all("#dayType a").length * 82 + "px;");
							} else if (target.id == "productType") {
								fish.one(target).removeClass("pack_down");
								fish.one("#productType").removeClass("none");
								//fish.one("#productType .data_main").css("width:" + fish.all("#productType a").length * 65 + "px;");
							}
						} else {
							fish.all(".pack_ts,.pack_lx").addClass("pack_down");
							fish.all("#dayType,#productType").addClass("none");
						}
					});
					fish.all(".stateName").each(function(elem, i) {
						fish.one(this).on("click", function() {
							var stateName = fish.all(".stateName"),
								data_main = fish.all("#stateName .data_main");
							stateName.removeClass("stateNameAt");
							data_main.addClass("none");
							fish.one(stateName[i]).addClass("stateNameAt");
							fish.one(data_main[i]).removeClass("none");
						})
					})
					if (fish.trim(fish.one("#bqContent").html()) != "") {
						var mainTop = fish.one(".mainLeft").offset().top;
						window.scrollTo(0, mainTop);
						fish.require("mPop", function() {
							fish.mPop.close()
						});
					}
					if (data && data.LineMessageMod && data.LineMessageMod.length > 0) {
						var ajaxStr = getData(data);
						fish.one("#bqContent").html(ajaxStr);

						//hover弹框
						fish.all(".line_info .icon_bc").hover(
							function() {
								fish.one(".bc_tcW", fish.one(this)).removeClass("none");
							},
							function() {
								fish.one(".bc_tcW", fish.one(this)).addClass("none");
							}
						);



						//绑定key值
						bindKey(fish.all("#bqContent .line_info .tit a"), obj);
						bindKey(fish.all("#bqContent .line_info .yhmore"), obj);
						bindKey(fish.all("#bqContent .line_info .linebtn"), obj);

						//放大航线图
						fish.all(".map img").on("mouseover", function() {
							var offset = fish.one(this).offset(),
								top = offset.top,
								left = offset.left,
								width = fish.one(this).width(),
								src = fish.one(this).attr("src");
							if (src.indexOf("gif") < 0) {
								fish.one("#Popview1").removeClass("none").css("top:" + top + "px;left:" + (width + left + 10) + "px;");
								fish.one("#Popview1 img").attr("src", src);
							}
						}).on("mouseout", function() {
								fish.one("#Popview1").addClass("none");
							});

						fish.one(".myline em").html(data.TotalLineCount + "条");
						fish.one(".tehui").removeClass("none");
						if (data.YouhuiCount == 0) {
							fish.one(".tehui").addClass("none");
						} else {
							fish.one(".tehui .txt").html(data.YouhuiCount + '条');
						}

						criteoJS();
						// 产品图片懒加载
						fish.all(".rsConList .map img").lazyLoad({ attr: "data-nsrc", preSpace: 100 });




						var history = fish.cookie.get("searchHistory"),
							historystr = "";
						if (dest) { //地址有分词才记录
							if (history) {
								if (history.indexOf("||") > -1) {
									var arr = history.split("||"),
										length = arr.length;
									if (length >= 10) {
										length = 9;
									}
									historystr += dest;
									for (var i = 0; i < length; i++) {
										historystr += "||" + arr[i];
										if (arr[i] == dest) return;
									}
								} else {
									if (history != dest) {
										historystr += dest + "||" + history;
									}
								}
							} else {
								historystr = dest;
							}
							if(historystr) {
								fish.cookie.set({ name: "searchHistory", value: historystr, path: "/youlun" });
								historyCookie();
							}							
						}

					} else if (data.LineMessageMod && data.LineMessageMod.length == 0) {
						fish.one(".myline em").html("0条");
						var noneStr = '<div class="norsBox">\
											<div class="norsShow"><span class="norsTit">很抱歉，没有找到“' + dest + '”相关的航线，您可以尝试其他关键词进行搜索或者<br/>您也可以<a class="ylc-custom" title="" href="http://livechat.ly.com/out/guest?p=6&amp;c=0&amp;pageId=6001&amp;lineId=0&amp;robsid=13162532" target="_blank">联系我们的客服</a>，帮您挑选和预订产品</span></div>\
											<div class="love"><p>您可能感兴趣的航线</p></div>';
						fish.ajax({
							url: "/youlun/AjaxcallTravel.aspx?Type=GetSearchRecLine&hxid=" + hxid + "&pageNum=1",
							type: "json",
							fn: function(data) {
								noneStr += getData(data) + '</div>';
								fish.one("#bqContent").html(noneStr);
								//绑定key值
								bindKey(fish.all("#bqContent .line_info .tit a"), obj);
								bindKey(fish.all("#bqContent .line_info .yhmore"), obj);
								bindKey(fish.all("#bqContent .line_info .linebtn"), obj);
							}
						})
					}
					if (totalPage == 0) {
						fish.one("#pageCountent").addClass("none");
					} else {
						fish.one("#pageCountent").removeClass("none");
					}
				}
			},
			preSortTotal: function(data) {
				return data.TotalPageNum;
			},
			ajaxObj: {
				type: 'json',
				url: urlStr,
				fn: function(data) {
					return data;
				}
			},
			skip: "true" //带页面跳转框
		});
	}

	function getData(data) {
		//绑定lid
		//fish.all(".condition_box a").each(function () {
		//var href = fish.one(this).attr("href");
		//if (href && href.indexOf("lid") < 0 && href.indexOf("javascript") < 0) {
		//bindLid(fish.all(this));
		//}
		//})
		var ajaxStr = '',
			proStr = '',
			tjProStr = '',
			trackLen = fish.all('#bqContent .line_info').length,
			tabName = fish.trim(fish.one('.searchbox .curr').html()),
			TagDesc = data.TagDesc;

		function getDesc(txt) {
			var desc = TagDesc[txt];
			if (desc) {
				return '<span class="label_d"><span class="layer"></span><span class="p_text"><em>' + desc + '</em></span></span>';
			} else {
				return '';
			}
		};

		function getSpan(txt) {
			return '<span class="label_d"><span class="layer"></span><span class="p_text"><em>' + txt + '</em></span></span>';
		}
		for (var i = 0, l = data.LineMessageMod.length; i < l; i++) {
			var odata = data.LineMessageMod[i],
				LineId = odata.LineId, //航线id
				IshasRefid = odata.IshasRefid, //refid
				title = odata.MainTitle, //主标题
				SubTitle = odata.SubTitle, //副标题
				IsTicket = odata.IsTicket, //是否单船票
				IsGuoJi = odata.IsGuoJi, //0是国内，1出境，2长线
				IsTCRecommend = odata.IsTCRecommend, //是否同程推荐
				IsTCSpecialLine = odata.IsTCSpecialLine, //是否同程专线
				IsBaoChuan = odata.IsBaoChuan, //是否包船
				imgurl = odata.IntroImagePro, //图片地址
				Tag = odata.TagListModel.TagList, //标签
				SailDate = odata.SailDateListModel.SailDateList, //航期
				GoodSatisfacstr = odata.GoodSatisfacstr, //好评率
				Satisfacstr = odata.Satisfacstr, //满意度
				TravelSimpIntro = odata.TravelSimpIntro, //途径城市
				CruiseName = odata.CruiseName, //航线名称
				IsUseRed = odata.IsUseRed, //是否可用红包
				Prize = odata.Prize, //价格
				IsPromtion = odata.IsPromtion, //是否是促销线路
				PromotionTitle = odata.PromotionTitle, //促销优惠信息
				PackageCount = odata.PackageCount, //是否可用礼包
				OnPtName = odata.OnPtName, //上船港口
				DownPtName = odata.DownPtName, //下船港口
				locationcity = odata.DepartureCity, //定位城市
				url = '/youlun/tours-' + LineId + '.html',
				tagstr = '',
				datestr = '',
				travelline = '',
				ptName = '',
				yhstr = '',
				dpstr = '',
				hpstr = '',
				trackStr = '', //同程专线的统计
				dataStr = '',
				isBlankNote = odata.IsBlankNote, //是否可以白条支付，1：可以 0：不可以
				blankNote = odata.BlankNote, //白条支付期数
				blankNoteFree = odata.BlankNoteFree; //白条支付免费手续费期数

			IshasRefid == 0 ? url : url += '#refid=' + IshasRefid;

			//616活动
			var date = new Date().getTime(),
				endDate = new Date("2016/05/21").getTime(),
				hStartDate = new Date("2016/05/25").getTime(),
				hEndDate = new Date("2016/06/20").getTime();
			var hot616 = '';
			if (IsPromtion == 1 && date >= hStartDate && date < hEndDate) {
				tagstr += '<span class="hot616"></span>';
			}
			var tczxH = '同程旅游联合境内外优质供应商为用户甄选提供更专业更高品质的产品。';
			IsTCSpecialLine == 1 ? tagstr += '<span class="tczx">同程专线' + getSpan(tczxH) + '</span>' : tagstr;

			var bcH = '<span class="bc_tcW none"><span class="arr_top"></span><span class="bc_tcM"><em class="p_text">码头接送，方便贴心<br/>专属客服，热情专业<br/>主题活动，独家特色<br/>精选领队，服务周到</em></span></span>';
			var bcStr = IsBaoChuan == 1 ? '<span class="icon_bc">' + bcH + '</span>' : '';
			//判断显示的标签
			if (Tag && Tag.length > 0) {
				for (var a = 0; a < Tag.length; a++) {
					tagstr += '<span>' + Tag[a] + getDesc(Tag[a]) + '</span>';
				}
			}
			//判断红包
			//IsUseRed == 1 ? tagstr += '<span>红包可用'+getDesc("红包可用")+'</span>' : tagstr;

			//分期付款
			if (isBlankNote == 1) {
				var blankN = blankNoteFree > 0 ? '，免息' + blankNoteFree + '期' : '';
				var blankHtml = '可分' + blankNote + '期支付' + blankN + '，出游更超值！';
				tagstr += '<span>分期付款' + getSpan(blankHtml) + '</span>';
			}
			//520特惠
			var th520 = '“定格幸福，有爱就购了” 5月20日当天，在同程全平台，下单并当天支付的用户享受双人房型立返￥200/人';
			if (date < endDate) {
				tagstr += '<span class="th520">520特惠' + getSpan(th520) + '</span>';
			}


			//同程专线统计str
			trackStr = "_tcTraObj._tcTrackEvent('zxyl_2','pc邮轮列表', 'pc邮轮列表页点击线路', '^listview^" + tabName + "^" + (trackLen + i + 1) + "^" + CruiseName + "^" + LineId + "^" + IsTCSpecialLine + "^');"

			//判断航期
			if (SailDate && SailDate.length > 0) {
				var length = SailDate.length;
				if (length > 3) {
					for (var b = 0; b < 3; b++) {
						datestr += '<em>' + SailDate[b] + '</em>';
					}
					datestr += '<span class="more up" _attr-id="' + LineId + '">更多<i></i></span>'
				} else {
					for (var b = 0; b < length; b++) {
						datestr += '<em>' + SailDate[b] + '</em>';
					}
				}
			}

			//判断点评
			if (Satisfacstr && Satisfacstr > 0) {
				dpstr = '<span class="dp_count"><em>' + Satisfacstr + '条</em>点评</span>';
			}

			if (GoodSatisfacstr && GoodSatisfacstr > 0) {
				hpstr = '<span class="good"><em>' + GoodSatisfacstr + '%</em>满意</span>';
			}

			//判断礼包
			PackageCount > 0 ? yhstr = '<em class="lb">礼包</em>' : yhstr;
			//判断促销
			if (IsPromtion == 1 && PromotionTitle) {
				yhstr += '<span><em class="yh">优惠</em>' + PromotionTitle + '</span><a class="yhmore" href="' + url + '" onclick="' + trackStr + '" target="_blank">更多优惠>></a>'
			} else {
				yhstr += '<em class="tese">特色</em>' + SubTitle
			}
			//判断是否长线+单船票
			if (IsTicket == 1 && IsGuoJi == 2) {
				yhstr = '';
				ptName += '<p class="date">上船港口：<em class="dowm">' + OnPtName + '</em>下船港口：<em>' + DownPtName + '</em></p>'; //判断上下船港口
			} else {
				yhstr = '<p class="tip">' + yhstr + '</p>';
			}
			if (tagstr.length) tagstr = "<p class='label'> " + tagstr + "</p>";
			if (TravelSimpIntro) {
				travelline = '<p class="plans">行程概况：<em title="' + TravelSimpIntro + '">' + TravelSimpIntro + '</em></p>';
			}
			dataStr = '<div class="line_info" _asIndex="' + (trackLen + i + 1) + '" _lineId="' + LineId + '">\
                                        <div class="info_l">\
                                            <div class="map">\
                                                ' + hot616 + '<img src="' + imgurl + '" alt="' + title + '">\
                                                <p>' + CruiseName + '</p>\
                                            </div>\
                                        </div>\
                                        <div class="info_r">\
                                            <div class="info_cont">\
                                                <div class="tit">\
                                                    <a href="' + url + '" onclick="' + trackStr + '" title="' + title + '" target="_blank">' + title + '</a> ' + bcStr + '\
                                                </div>\
                                                ' + tagstr + '\
                                                ' + travelline + '\
                                                ' + yhstr + '\
                                                ' + ptName + '\
                                                <p class="date"><span class="locationcity">' + locationcity + '出发</span>出发日期：\
                                                    ' + datestr + '\
                                                </p>\
                                                <div class="info_right">\
                                                    <span class="lineprice"><strong>&yen;<em>' + Prize + '</em></strong>起</span>\
                                                    <a class="linebtn" href="' + url + '" onclick="' + trackStr + '" target="_blank">查看详情</a>\
                                                    <p class="review">\
                                                        ' + dpstr + '\
                                                        ' + hpstr + '\
                                                    </p>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    <div class="calendar none"></div>\
                                <div class="clearfix"></div></div>';

			if (IsTCRecommend == 1) {
				tjProStr += dataStr;
			} else {
				proStr += dataStr;
			}
		}

		ajaxStr = '<div class="rsConList recommed">' + tjProStr + '</div>\
                   <div class="rsConList">' + proStr + '</div>';
		return ajaxStr;
	}

	//记录历史搜索数据
	function historyCookie() {
		var history = fish.cookie.get("searchHistory"),
			str = '';

		if (history) {
			if (history.indexOf("||") > -1) {
				var arr1 = history.split("||");
				for (var i = 0; i < arr1.length; i++) {
					str += '<a>' + arr1[i] + '</a>';
				}
			} else {
				str += '<a>' + history + '</a>';
			}
			fish.all(".history a").html("remove");
			fish.one(".history").removeClass("none").html("bottom", str);
		} else {
			fish.one(".history").addClass("none");
		}
		fish.one(".clearHistory").on("click", function() {
			fish.cookie.set({ name: "searchHistory", value: "", path: "/youlun" });
			fish.one(".history").addClass("none");
		})
		fish.all(".history a").on("click", function() {
			var html = fish.one(this).html();
			fish.one(".searchinput").val(html).css("color:#333;");
			fish.one(".autoComplete").removeClass("none");
			autoComplete(encodeURIComponent(html));
		});

		//搜索历史点击
		fish.all(".history a").each(function(elem, i) {
			this.index = i;
			fish.one(elem).on("click", function(evt) {
				var $this = fish.one(this);
				searchTrackEvent("/sbox/k/history", {
					k: encodeURIComponent($this.html()),
					pos: this.index + 1,
					//locCId : fish.one("#hidCityId").val(),
					jpTp: 1
				});
			});
		});
	}
	historyCookie();


	//设置搜索月份是否可以滑动
	function canSlider() {
		var rqList = fish.all(".calendar_box .scut_sty .year_sty").length,
			sliderLen = 196 * rqList,
			maxLen = sliderLen - 392;
		fish.one(".rqslider").css("width:" + sliderLen + "px;");
		if (rqList > 2) {
			fish.all(".sliderBtn").removeClass("none");
		}
		fish.all(".sliderBtn").on("click", function() {
			var that = fish.one(this),
				nowLen = parseInt(fish.one(".rqslider").attr("attr-left"), 10);
			fish.all(".sliderBtn").removeClass("prevBtnN").removeClass("nextBtnN");
			if (that.hasClass("prevBtnN") || that.hasClass("nextBtnN")) {
				return;
			} else if (that.hasClass("prevBtn")) {
				nowLen = nowLen - 196 <= 0 ? 0 : nowLen - 196;
				fish.one(".rqslider").attr("attr-left", nowLen).anim("left:" + (-nowLen) + "px;", 500);
				if (nowLen == 0) {
					fish.one(".prevBtn").addClass("prevBtnN");
				} else {
					fish.one(".prevBtn").removeClass("prevBtnN");
				}
			} else if (that.hasClass("nextBtn")) {
				nowLen = nowLen + 196 >= maxLen ? maxLen : nowLen + 196;
				fish.one(".rqslider").attr("attr-left", nowLen).anim("left:" + (-nowLen) + "px;", 500);
				if (nowLen == maxLen) {
					fish.one(".nextBtn").addClass("nextBtnN");
				} else {
					fish.one(".nextBtn").removeClass("nextBtnN");
				}
			}
		})
	}

	//点击更多控制下拉及价格日历
	fish.one("#bqContent").on("click", function(e) {
		var target = fish.getTarget(e);
		do {
			var cName = target.className;
			if (cName && cName.indexOf("more") > -1) {
				var elem = fish.one(target);
				if (elem.hasClass("up")) {
					elem.removeClass("up").addClass("down").html("收起<i></i>");
					fish.one(".calendar", elem.parent(".line_info")).removeClass("none");
					if (fish.one(".calendar", elem.parent(".line_info")).html() == "") {
						var id = elem.attr("_attr-id");
						setcalendar(elem, id);
					}
					return;
				}
				if (elem.hasClass("down")) {
					elem.removeClass("down").addClass("up").html("更多<i></i>");
					fish.one(".calendar", elem.parent(".line_info")).addClass("none");
					return;
				}
				break;
			} else if (cName && cName.indexOf("mainLeft") > -1) {
				break;
			}

		} while (target = target.parentNode);
	});

	function setcalendar(elem, id) {
		//日期异步
		fish.ajax({
			url: "/youlun/CruiseTours/CruiseToursAjax_book.aspx?Type=GetToursDataList&lineid=" + id,
			data: "IsSearchPromotion=1",
			type: "json",
			sync: true,
			fn: function(data) {
				calendar(elem, data);
			}
		});
	}

	function calendar(elem, data) {
		var wrapper = fish.one(".calendar", elem.parent(".line_info"));
		var ohref = fish.one("a", elem.parent(".line_info")).attr("href");
		fish.require("Calendar", function() {
			var startDate = fish.parseDate(data[0].LineDate),
				endDate = fish.parseDate(data[data.length - 1].LineDate),
				sYY = startDate.getFullYear(),
				sM = startDate.getMonth() + 1,
				sD = startDate.getDate(),
				eYY = endDate.getFullYear(),
				eM = endDate.getMonth() + 1,
				eD = endDate.getDate(),
				startTime = sYY + "-" + sM + "-" + sD,
				endTime = eYY + "-" + eM + "-" + eD;
			var cal = new fish.Calendar({
				monthNum: 2,
				wrapper: wrapper,
				style: "show",
				startDate: startTime,
				endDate: endTime,
				mode: "rangeFrom",
				//showOtherMonth: true,
				currentDate: [startTime, endTime],
				buildContent: function(td, date, dateStr) {
					__v.build(td, date, dateStr, data, ohref);
				}
			});

			cal.pick({
				startDate: startTime,
				endDate: endTime,
				mode: "rangeFrom",
				//showOtherMonth: true,
				currentDate: [startTime, endTime],
				buildContent: function(td, date, dateStr) {
					__v.build(td, date, dateStr, data, ohref);
				}
			});

		});
	}

	// 生成日历每个单元格。
	__v.tmpl = '<a class="dayjh" href="{dataHref}" target="{dataTarget}"><span class="date">{dateStr}</span><span class="dataprice">{priceStr}</span></a>';
	__v.build = function(td, date, dateStr, data, ohref) {
		var dateTime = date.getTime(),
			item, info, htmlStr,
			place, classArr = [];
		for (var i = 0, len = data.length - 1; i <= len; i++) {
			item = data[i];
			//这里获得的是8点的毫秒数
			var _date = Date.parse(item.LineDate.replace(/\-/gi, "/"));
			if (_date >= dateTime && _date < dateTime + 1000 * 60 * 60 * 24) {
				info = item;
				break;
			}
		}
		if (!info) {
			info = {};
		}
		info.dateStr = (dateStr ? dateStr : date.getDate());
		if (!info.LineDate) {
			classArr.push("invalid-day");
			info.dataHref = "javascript:void(0);";
			info.dataTarget = "_self";
		} else {
			info.priceStr = "&yen;" + info.MinPrice;
			info.dataHref = ohref.split(".html")[0] + "_" + data[i].LineDate + ".html" + ohref.split(".html")[1];
			info.dataTarget = "_blank";
		}
		htmlStr = this.tmpl.replace(/{(\w+)}/g, function($0, $1) {
			return info[$1] || "";
		});
		td.innerHTML = htmlStr;
		fish.one(td).addClass(classArr.join(" "));
	};


	//主题活动hover
	if (fish.browser("webkit")) {
		fish.all("#active a").hover(function() {
			fish.one(".active_bg", this).anim("opacity: 1;", 300);
		}, function() {
			fish.one(".active_bg", this).anim("opacity: 0;", 300);
		});
	} else if (fish.browser("ms")) {
		fish.all("#active a").hover(function() {
			fish.one(".active_bg", this).anim("filter:alpha(opacity=50);", 300);
		}, function() {
			fish.one(".active_bg", this).anim("filter:alpha(opacity=0);", 300);
		});
	}

	//热门搜索
	fish.one(".hot_search").on("click", function() {
		fish.one(".search_cont").removeClass("none");
	});

	fish.one("body").on("click", function(e) {
		var ever = fish.getTarget(e);
		do {
			var className = ever.className;
			if (className && className.indexOf("hot_search") > -1) {
				break;
			} else if (fish.dom("body") == ever) {
				fish.one(".search_cont").addClass("none");
				break;
			}
		} while (ever = ever.parentNode);
	});

	//攻略下载统计
	function count() {
		var cruiseid = fish.one("#cruiseid").val(),
			ohref = window.location.href,
			ourl = "/youlun" + ohref.split("/youlun")[1];
		fish.ajax({
			url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseStrategyStatistic&Url=" + ourl + "&pagetype=AdvancedSearchPage&cruiseid=" + cruiseid,
			type: "json",
			fn: function(data) {}
		})
	}

	fish.all(".download_raiders", fish.one(".l_center")).on("click", function() {
		count();
	});

	//判断手机号码格式
	function isPhone(str) {
		return /^1[3,4,5,7,8]\d{9}$/i.test(str);
	}

	//红包
	function workendactive(){
		//页面底部横幅控制
		if(setTime("2016/06/02 00:00:00","2016/06/20 00:00:00")){
			fish.one(".workendactive").removeClass("none");
			var lastTime =localStorage.lastOpenTime || 0;
			if(lastTime == 0 || lastTime != fish.parseDate()){
				localStorage.lastOpenTime = fish.parseDate();
				fish.one(".bonus_box").css({"left":0});
				fish.one(".aside_tag").css({"left":"-136px;"});
			}else{
				fish.one(".bonus_box").css({"left":"-100%;"});
				fish.one(".aside_tag").css({"left":0});
			}
		}
		//搜索框右边的图片控制
		if(setTime("2016/06/02 00:00:00","2016/06/09 00:00:00")){
			fish.one(".searchSale").attr("href","http://www.ly.com/zhuanti/youlundashiji");
			fish.one(".searchSale img").attr("src","http://img1.40017.cn/cn/y/16/h/3.0.3/dashijian.gif");
		}
		//领红包
		fish.one(".bonus_form a").on("click", function () {
			if (fish.one(this).hasClass("getting")) return;
			var phone = fish.trim(fish.one(".phone").val()),
				code = fish.trim(fish.one(".code").val());
			if (!isPhone(phone)) {
				fish.one(".bonus_tip").html("<span>亲，请输入正确手机号</span>").removeClass("none");
				return;
			}
			if (code == "") {
				fish.one(".bonus_tip").html("<span>亲，请输入正确验证码</span>").removeClass("none");
				return;
			}
			fish.one(this).addClass("getting");
			fish.ajax({
				url: "/youlun/CruiseRedPacket/CruiseRedPacketajax.aspx?type=GetGiftPacketByMobile&mobile=" + phone + "&checkCode=" + code,
				type: "json",
				fn: function (data) {
					var codeurl = '/youlun/CruiseRedPacket/CruiseRedPacketajax.aspx';
					fish.one(".bonus_form img").attr('src', codeurl + '?type=GetRedPackCheckCode&module=1&height=40&width=60&r=' + Math.random());
					if (data.ResultCode == 5) {
						fish.one(".bonus_tip").html("<span>亲，请输入正确验证码</span>").removeClass("none");
						fish.one(".code").val("");
						fish.one(".bonus_form a").removeClass("getting");
						return;
					} else if (data.ResultCode == 0) {
						fish.all(".bonus_bg,.bonus_box").addClass("none");
						fish.all(".bonus_mask,.bonus_suc").removeClass("none");
						fish.one(".bonus_form a").removeClass("getting");
					} else if (data.ResultCode == 3) {
						fish.all(".bonus_bg,.bonus_box").addClass("none");
						fish.all(".bonus_mask,.bonus_suc").removeClass("none");
						fish.one(".bonus_suc img").attr("src", "http://img1.40017.cn/cn/y/15/h/hb2.jpg?v=1");
						fish.one(".bonus_form a").removeClass("getting");
					}
				}
			})
		});
		fish.all(".phone,.code").on("focus", function () {
			fish.one(".bonus_tip").addClass("none");
		});
		//*刷新验证码
		fish.one(".bonus_form img").on('click', function () {
			fish.one(".code").val("");
			var url = '/youlun/CruiseRedPacket/CruiseRedPacketajax.aspx';
			fish.one(".bonus_form img").attr('src', url + '?type=GetRedPackCheckCode&module=1&height=40&width=60&r=' + Math.random());
		});


		//  红包弹层关闭
		fish.all(".bonus_suc .close,.use").on("click", function () {
			fish.all(".bonus_bg,.bonus_box").anim("left:-100%", 800, function () {
				fish.one(".aside_tag").anim("left:0px;", 200);
			});
			fish.all(".bonus_mask,.bonus_suc").addClass("none");
		});


		fish.one(".bonus_box .close").on("click", function () {
			fish.all(".bonus_bg,.bonus_box").anim("left:-100%", 800, function () {
				fish.all(".bonus_bg,.bonus_box").addClass("none");
				fish.one(".aside_tag").anim("left:0px;", 200);
			});
		});
		fish.one(".aside_tag").on("click", function () {
			var _width = fish.one(this).width();
			fish.one(".aside_tag").anim("left:-"+_width+"px;", 200, function () {
				fish.all(".bonus_bg,.bonus_box").removeClass("none").anim("left:0%", 800);
			});
		});


		if (fish.browser("ms")) {
			fish.all(".bonus_box input").each(function () {
				var placeholder_val = fish.one(this).attr("placeholder");
				fish.one(this).val(placeholder_val).css({"color": "#666"}).on("focus", function () {
					if (fish.one(this).val() == placeholder_val) {
						fish.one(this).val("");
					}
				}).on("blur", function () {
						if (!fish.one(this).val() == "") {
							fish.one(this).css({"color": "#333"});
						} else {
							fish.one(this).val(placeholder_val);
						}
					});
			})
		} else {
		}
	}
	//最近时间配置的东西比较多,是时候弄个配时间的方法了
	function setTime(startTime,endTime){
		var nowT = new Date(),
			startT = new Date(startTime),
			endT = new Date(endTime),
			nowTime = nowT.getTime(),
			startTime = startT.getTime(),
			endTime = endT.getTime();
		if(nowTime > startTime && nowTime < endTime){
			return true;
		}else{
			return false;
		}
	}

})();


//特价需求列表页
;
(function(win) {
	fish.admin.config({
		Calendar: { v: "0.3", css: "0.3", g: 2015032101 }
	});
	var tejiaObj = {
		init: function() {
			var that = this;
			//表单
			this.formConBox = alertFormCtrl({
				showCon: fish.one(".tj_con_box"),
				shadowBg: fish.one(".tj_shadow"),
				closeBut: fish.one(".tj_con_box .s_close"),
				showBeforeFn: function(objA, objB) {
					cirCenter(objA);
				}
			});
			//提交弹框
			this.msgForm = alertFormCtrl({
				showCon: fish.one(".tj_alert_box"),
				shadowBg: fish.one(".tj_shadow"),
				closeBut: fish.one(".tj_alert_box .alert_close"),
				showBeforeFn: function(objA, objB) {
					cirCenter(objA);
				}
			});
			this.cruiseObj.init();
			this.tripDateObj.init();
			this.codeObj.init();
			this.bindEvent();
		},
		//重置所有的input以及交互
		restAllInput: function() {
			var $allInput = fish.all(".dl_tj_cos dl dd input");
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
			fish.one(".dl_tj_cos dl dd span.no_enter").removeClass("checked");
			this.tripDateObj.noDateflag = false;
			fish.all(".dl_tj_cos dl dd").removeClass("has_error");

			//重置验证码
			this.codeObj.resetCode();
		},
		//绑定全局事件
		bindEvent: function() {
			var that = this,
				$subBut = fish.one(".dl_tj_cos a.sub_data"),
				$allInput = fish.all(".dl_tj_cos dl.eve_yusuan dd input,.dl_tj_cos dl.cust_name dd input,.dl_tj_cos dl.cust_mobile dd input,.dl_tj_cos dl.code dd input");
			this.inputObj.bindPlaceHolder($allInput);
			//出游人数
			this.inputObj.filterKeyUp(fish.one(".dl_tj_cos dl.travel_num dd input"), "[^\\d]", 3);
			//人均预算
			this.inputObj.filterKeyUp(fish.one(".dl_tj_cos dl.eve_yusuan dd input"), "[^\\d]", 13);
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
									tejiaObj.msgCtrl.show(fish.dom(".dl_tj_cos dl.code dd input"), "验证码输入错误！");
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
			fish.one(".tj_alert_box .s_con").delegate(".close_but", "click", function() {
				that.msgForm.close();
			});
			//点击显示提交弹框
			fish.one(".l_box .but_tjyy").on("click", function() {
				
				//弹出新框....统计保留 如果公共导航条不存在，继续获取以前的
				var $sPrice=fish.dom(".ylc-nav .ylc-special-price");
				if($sPrice){
					$sPrice.click();
					that.statcClick();
					return false;
				}

				// console.log(this)
				that.cruiseObj.drawLine();
				that.formConBox.show();
				that.statcClick();
			});

			//得到焦点关闭提示
			fish.all(".dl_tj_cos dl.cust_name dd input,.dl_tj_cos dl.cust_mobile dd input,.dl_tj_cos dl.code dd input").on("focus", function() {
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
					$linesCon = fish.one(".dl_tj_cos dl.route_port  dd .s_line_con"),
					$lineInput = fish.one(".dl_tj_cos dl.route_port dd input");
				$lineInput.addClass("scon_tar_show");

				//显示框
				$lineInput.on("click", function() {
					$linesCon.removeClass("none");
				});

				$linesCon.addClass("scon_tar_show").delegate(".line_con_body .as_s", "click", function(evt) {
					var $tar = fish.one(fish.getTarget(evt));
					$lineInput.removeClass("place_holder").val($tar.attr("_value"));
					$linesCon.addClass("none");
				});

				//关闭航线框
				fish.one(document).on("click", function(evt) {
					var tar = fish.getTarget(evt),
						$this = fish.one(tar),
						$parent = $this.parent(".scon_tar_show"); //scon_tar_show 这个类名用来判断是否是是所需要的事件源
					if ($this.hasClass("scon_tar_show") || $parent.length >= 1) {
						return true;
					}
					$linesCon.addClass("none");
				});
				fish.one(".line_con_head .sps_close", $linesCon[0]).on("click", function() {
					$linesCon.addClass("none");
				});
			},
			//打印航线数据
			drawLine: function() {
				if (this.drawLineHasData) return false;
				this.drawLineHasData = true;
				fish.ajax({
					url: "/youlun/CruiseRequireOrder/HomePageRequireOrder.ashx?action=SearchRouteData",
					// url : "js/testLineDataJson.txt",
					type: "json",
					fn: function(data) {
						// console.log(data)
						if (!data || !data[0]) return false;
						var str = "";
						for (var i = 0, len = data.length; i < len; i++) {
							str += '<span class="as_s" _value="' + data[i].CrName + '">' + data[i].CrName + '</span>';
						}
						fish.one(".dl_tj_cos dl.route_port  dd .s_line_con .line_con_body").html(str);
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
					$startDate = fish.one(".dl_tj_cos dl.tour_date dd input.input_start_date"),
					$endDate = fish.one(".dl_tj_cos dl.tour_date dd input.input_end_date"),
					domCal01 = fish.one(""),
					domCal02 = fish.one("");
				fish.one(".dl_tj_cos dl dd span.no_enter").on("click", function() {
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
							wrapper: fish.all(".dl_tj_cos dl.tour_date dd .s_show_div")[0],
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
									wrapper: fish.all(".dl_tj_cos dl.tour_date dd .s_show_div")[1],
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
						domCal01.css("position:absolute;top:30px;left:0;z-index:2;");
						that.setCalPosition(domCal01);
					});
					$endDate.on("focus", function(e) {
						if (that.noDateflag) return false;
						var startDate = $startDate.val() && $startDate.val() != $startDate.attr("_placeholder") ? new Date(new Date($startDate.val().replace(/-/g, "/")).getTime() + 24 * 3600 * 1000) : new Date(new Date().getTime() + 24 * 3600 * 1000);
						domCal02.html("remove");
						var cal = new fish.Calendar({
							skin: "white",
							style: "show",
							wrapper: fish.all(".dl_tj_cos dl.tour_date dd .s_show_div")[1],
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
						domCal02.css("position:absolute;top:30px;left:0;z-index:2;");
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
				var $parentBox = $cal.parent(".tj_con_box"),
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
				fish.one(".dl_tj_cos dl.code dd span.get_code").on("click", function() {
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
					data: "action=GetSmsAuthCode&custMobile=" + fish.one(".dl_tj_cos dl.cust_mobile dd input").val(),
					fn: function() {}
				});
			},
			//验证码获取倒计时
			timerCode: function(times) {
				var that = this,
					$codeBut = fish.one(".dl_tj_cos dl.code dd span.get_code"),
					$showCs = fish.one("span i", $codeBut[0]),
					setTime = times || 30000,
					aniTime = 500;
				this.timerD = setInterval(function() {
					if (setTime <= 0) {
						that.getCodeFlag = true;
						$codeBut.removeClass("no_active");
						clearInterval(timerD);
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
				var $codeBut = fish.one(".dl_tj_cos dl.code dd span.get_code"),
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
				var $input = fish.one(".dl_tj_cos dl.cust_name dd input"),
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
				var $input = fish.one(".dl_tj_cos dl.cust_mobile dd input"),
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
				var $input = fish.one(".dl_tj_cos dl.code dd input"),
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
			var $allInput = fish.all(".dl_tj_cos input"),
				str = "";
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
				fish.one(".tj_alert_box .s_con").html(str);
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
		}
	};


	fish.one(document).ready(function() {
		tejiaObj.init();
	});
	//通用方法
	//弹框显示控制
	function alertFormCtrl(option) {
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
	}
	//弹框居中算法
	function cirCenter(fishObj) {
		if (!fishObj || !fishObj[0]) return false;
		var oW = fishObj.width(),
			oH = fishObj.height();
		fishObj.css("position:fixed;left:50%;top:50%;marginLeft:" + -oW / 2 + "px;marginTop:" + -oH / 2 + "px;");
	}

})(window);

//邮轮搜索页埋点统计
;
(function(win) {
	//埋点事件
	function searchTrackEvent(sLabel, sValueObj) {
		//因为汉字无需URI编码 故还原回去
		sValueObj.k && (sValueObj.k = decodeURIComponent(sValueObj.k));
		sValueObj.ct && (sValueObj.ct = decodeURIComponent(sValueObj.ct));
		if (!sLabel || !sLabel.trim()) return false;
		//添加一个定位的城市Id 页面逻辑其实用不到 只是为了埋点统计所加
		//sValueObj.locCId = fish.one("#hidCityId").val();
		var str = "";
		for (key in sValueObj) {
			if (sValueObj[key] !== null && sValueObj[key] !== undefined && sValueObj[key] !== "") {
				str += "|*|" + key + ":" + sValueObj[key];
			}
		}
		try {
			str.length > 0 && (str = str + "|*|");
			_tcTraObj._tcTrackEvent("search", "/cruises/list", sLabel, str);
		} catch (e) {
			// console.log(e);
		}
	}

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	}


	//有些埋点统计需要在刷新页面之后做处理 所以需要借助cookie
	function trackEventUseCookie(option) {
		var g = {
			type: 1,
			lable: "",
			value: {}
		};
		fish.lang.extend(g, option);
		var cookieName = g.lable.replace(/\//g, "_");
		if (g.type == 1) {
			fish.cookie.set(cookieName, 1);
		} else if (g.type == 2) {
			if (fish.cookie.get(cookieName) == 1) {
				fish.cookie.remove(cookieName);
				searchTrackEvent(g.lable, g.value);
			}
		}
	}
	//生成GUID
	function guidGenerator() {
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}



	//热搜词点击
	fish.all(".hotSearch a").each(function(elem, i) {
		this.index = i;
		fish.one(elem).on("click", function(evt) {
			var that = this;
			$this = fish.one(this);
			searchTrackEvent("/sbox/k/hot", {
				k: encodeURIComponent($this.html()),
				pos: that.index + 1,
				//locCId : fish.one("#hidCityId").val(),
				//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
				jpTp: 1
			});
		});
	});
	//搜索框为空的时候的热词搜索
	fish.all(".hotword a").each(function(elem, i) {
		this.index = i;
		fish.one(elem).on("click", function(evt) {
			var that = this;
			$this = fish.one(this);
			searchTrackEvent("/sbox/k/hot", {
				k: encodeURIComponent($this.html()),
				pos: that.index + 1,
				//locCId : fish.one("#hidCityId").val(),
				//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
				jpTp: 1
			});
		});
	});



	//过滤统计
	fish.one("body").delegate(".cond_tab_filterbox .tehui,.cond_tab_filterbox .pre_tc,#baochuan,.cond_tab_conbox dd a,.allSearchList a,.condition_box .scut_sty .link_sty", "click", function(evt) {
		trackEventUseCookie({
			lable: "/filter"
		});
	});



	fish.one("body").delegate(".line_info a.linebtn,.line_info .tit a", "click", function(evt) {
		var tar = evt.target,
			parentA = fish.one(tar).parent(".line_info");
		//点击进入详情页
		searchTrackEvent("/detail", {
			// pos : parentA.attr("_asindex") - 0,
			k: encodeURIComponent(fish.one(".searchConditonLab").attr("data-dest")),
			//locCId : fish.one("#hidCityId").val(),
			pjId: "2007",
			//cityId : fish.one(".searchConditonLab").attr("data-harbourid"),
			resId: parentA.attr("_lineId")
		});

		//详情页埋点统计前置事件
		trackEventUseCookie({
			lable: "/show"
		});
	});

	win.searchTrackEvent = searchTrackEvent,
		win.trackEventUseCookie = trackEventUseCookie;
})(window);
