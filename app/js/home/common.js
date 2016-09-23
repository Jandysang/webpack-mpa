//PC终页公用方法
;
! function(R, F, window, document, undefined) {
    define(["../../public/utility/js/cruise.utitlty.js"], function(util) {

        var thisObj = {};
        F.lang.extend(thisObj, {
            toFixChineseNum: function(num) { //将小写数字转成大写数字(简体的大写)
                var arr = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
                var pos = ["", "十", "百", "千", "万"];
                num = parseInt(num, 10);
                num = isNaN(num) ? 0 : num < 0 ? 0 : num;
                if (num <= 0) return "";
                if (num > 99999) return "";
                var _num = num + "";
                var str = "";
                util.forEach(_num.split(""), function(index, item) {
                    if (_num.length !== 2) {
                        item = parseInt(item, 10);
                        str += arr[item] + pos[_num.length - index - 1];
                    } else {
                        str += index == 0 && item == 1 ? "" : arr[item];
                        str += pos[_num.length - index - 1];
                    }
                });
                return str;
            }
        })
        return thisObj;
    });
}(requirejs, fish, window, document);
