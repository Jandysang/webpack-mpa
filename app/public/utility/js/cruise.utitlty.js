define([], function() {
    /****
     * 字符串 format方法
     * 模仿C#的String.format方法，个人觉得它很好用
     ****/
    String.prototype.format = function() {
        var str = this.valueOf();
        for (var i = 0; i < arguments.length; i++) {
            var re = new RegExp('\\{' + i + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };

    /****
     * 字符串转换成JSON对象
     * 兼容所有浏览，根据字符的格式规范，依次调用不同的方法转换
     ****/
    String.prototype.parseJSON = function() {
        var str = this.valueOf(),
            fn = function(_fn) {
                try {
                    return _fn();
                } catch (ex) {
                    return ex;
                }
            },
            obj;

        if (!str.length) return new Error("空字符串不是一个合格的JSON格式！");
        obj = fn(function() {
            return JSON.parse(str);
        });
        if (typeDeepOf(obj) === "object" || typeDeepOf(obj) === "array") return obj;
        obj = fn(function() {
            return (new Function("return " + str))();
        });
        if (typeDeepOf(obj) === "object" || typeDeepOf(obj) === "array") return obj;
        obj = fn(function() {
            return eval("(" + str + ")");
        });
        if (typeDeepOf(obj) === "object" || typeDeepOf(obj) === "array") return obj;
        return new Error("请使用合格的JSON字符格式！");
    };

    //fn是否是方法对象
    function isFunction(fn) {
        return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + "");
    }

    /*
     * 判断object的准确类型
     */
    function typeDeepOf(obj) {
        if (typeof obj !== "object") return typeof obj;
        return Object.prototype.toString.apply(obj).slice(8, -1).toLowerCase();
    }

    /*****
     * 获取地址栏的参数值
     * name需要获取的key值
     * 如果urlStr有有效值，取urlStr里的有效值
     *****/
    function getUrlParam(name, urlStr) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (typeof urlStr === "string" && urlStr.length) r = (urlStr.split("?")[1] || '').match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    /*****
     *
     * 获取地址栏里所有参数的键值对
     *
     **/
    function formatUrl(urlStr) {
        if (!(typeof urlStr === "string" && urlStr.length)) urlStr = window.location.href;
        var reg = /(?:[?&]+)([^&]+)=([^&]+)/g;
        var data = {};

        function fn(str, pro, value) {
            data[decodeURIComponent(pro)] = decodeURIComponent(value);
        }
        urlStr.replace(reg, fn);
        return data;
    }

    /***
     * cookie的方法
     *
     ***/
    function cookie(key, value, options) {
        var days, time, result, decode;

        //set cookie
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            options = $.extend({}, options);
            if (value === null || value === undefined) options.expires = -1;
            if (typeof options.expires === 'number') {
                days = (options.expires * 24 * 60 * 60 * 1000);
                time = options.expires = new Date();
                time.setTime(time.getTime() + days);
            }
            value = String(value);
            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        //get cookie
        options = value || {};
        decode = options.raw ? function(s) {
            return s
        } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    }

    /****
     * 数组的模糊查询
     * 一搬用于autoComplete这种场景
     ****/
    function filter(array, term, fn) {
        if (typeDeepOf(array) !== "array" || array.length === 0) return array;
        var matcher = new RegExp(escapeRegex(term), "i"),
            flag = false,
            arr = [];
        for (var i = 0, len = array.length; i < len; i++) {
            flag = matcher.test(array[i].label || array[i].value || array[i]);
            if (fn && isFunction(fn)) {
                flag = fn.call(array, matcher, array[i]);
            }
            if (flag) arr.push(array[i]);
        }
        return arr;

        function escapeRegex(value) {
            return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        }
    }

    /****
     * 数组遍历，提供一个数组遍历的方法
     * 类似jQuery的$.each()
     * callback: return false===break;
     ****/
    function forEach(array, callback) {
        if (typeDeepOf(array) !== "array" || array.length === 0) return array;
        for (var i = 0, len = array.length; i < len; i++) {
            if (isFunction(callback)) {
                if (callback.apply(array, [i, array[i]]) === false) break;
            }
        }
    }

    /****
     * 去重
     * 效果不太好，但是效率最高
     * 效果最好的可以用下面的方法，但是效率最差
     * Array.prototype.unique=function(){
     *     var newArr=this.concat();
     *     for(var i=0,len=newArr.length;i<len;i++) {
     *         for(var j=i+1,len=newArr.length;j<len;j++) {
     *             if(newArr[i]===newArr[j]) {
     *                 newArr.splice(j,1);
     *                 j--;
     *             }
     *         }
     *     }
     *     return newArr;
     * }
     ****/
    function unique(array) {
        if (typeDeepOf(array) !== "array" || array.length === 0) return array;
        var arr = [];
        for (var i = 0, len = array.length; i < len; i++) {
            if (arr.indexOf(array[i]) == -1) {
                arr.push(array[i]);
            }
        }
        return arr;
    }
    /****
     *
     * 将JSON转化为string类型
     * 如果转化有问题，可以用自己的方法
     ****/
    function parseString(obj) {
        var tp = typeDeepOf(this),
            str;
        if (tp !== "object" && tp !== "array") return this.toString();
        str = fn(function() {
            return JSON.stringify(obj);
        });
        if (typeof str === "string") return str;
        str = fn(function() {
            return parseFn(obj);
        });
        if (typeof str === "string") return str;
        return this.toString();

        function parseFn() {
            var _obj = arguments[0],
                arr = [],
                that = this,
                formatFn = function(s) {
                    if (typeof s == 'object' && s != null) {
                        if ($.isArray(s)) {
                            return arrayFormatFn(s);
                        } else {
                            return that.jsonParseString(s);
                        }
                    }
                    return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
                },
                arrayFormatFn = function(o) {
                    if (typeof(o) !== 'object' || !$.isArray(o)) return "";
                    var str = "[";
                    for (var i = 0; i < o.length; i++) {
                        str += that.jsonParseString(o[i]) + ',';
                    }
                    if (o.length > 0) {
                        str = str.substring(0, str.length - 1);
                    }
                    str += "]";
                    return str;
                };
            for (var i in _obj) arr.push("'" + i + "':" + formatFn(_obj[i]));
            return '{' + arr.join(',') + '}';
        }

        function fn(_fn) {
            try {
                return _fn();
            } catch (ex) {
                return ex;
            }
        }
    }
    return {
        isFunction: isFunction,
        typeDeepOf: typeDeepOf,
        getUrlParam: getUrlParam,
        formatUrl: formatUrl,
        cookie: cookie,
        filter: filter,
        forEach: forEach,
        unique: unique,
        parseString: parseString
    }
});
