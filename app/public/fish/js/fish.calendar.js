/**
 * file fish.calendar.js
 * require fish.1.3+
 * description 日历组件
 *
 * @code
 *   fish.one(selector).calendar()
 * @endcode
 *
 * author syt4528@ly.com
 * time 2016-06-22
 *
 *
 */
;
! function(F, window, document, undefined) {

    var settings = {
            //显示
            show: true, //初始化是否显示（为true时，其他任何操作都会消失）
            firstDay: 0, //起始星期 0为周日 1~6周一到周六（只有在0-6之间数字有效，其他一切情况重置为0）    
            dayNames: ['日', '一', '二', '三', '四', '五', '六'], //星期头标题
            classNames: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
            wrapper: false, //填充位置
            specialDate: {}, //节、假日(规范：{'2016-06-22':'初创日'})
            showOtherMonths: false, //是否显示每月42天里相邻月
            visibleMonths: 1, //显示月数  (可见月数)
            stepMonths: 1, //切换跨越月数

            //范围
            startTime: new Date(), //有效时间开始 (如果为false ，最多从1900-1-1起)
            endTime: false, //有效时间结束 (如果为false ，最多从2101-1-1止)
            currentTime: new Date(), //初始化显示时间

            //自定义
            optimCurrentMonth: true, //是否优化当前月份（如为true,并且currentTime为所在月的下半月时，才会起作用）

            //动作
            skipBtn: true, //是否需要切换按钮
            //动作效果 后期添加
            //skipType:"fade",                //使用fade时,direction无效
            // itemHeight: false, //日历子项高度
            // itemWidth: false, //日历子项宽度
            // direction: "horizontal", //"horizontal" 为纵向(false)，"vertical" 为横向（true）

            //回调
            callback: false, //日历初始化完成
            skip: false,
            drawUnit: false, //初始化日期单元格

            //模板
            template: "<div class='{{-ui-calendar-}}'><div class='{{-ui-calendar-head-}}'><table><tbody><tr>" +
                "{{_palceholder_repeat_head_s_}}<th class='{{_palceholder_day_class_}}'>{{_palceholder_head_item_}}</th>" +
                "{{_palceholder_repeat_head_e_}}</tr></tbody></table></div><div class='{{-ui-calendar-body-}}'>" +
                "<a class='{{-ui-calendar-btn ui-calendar-prev-}}' href='javascript:;'></a>" +
                "<a class='{{-ui-calendar-btn ui-calendar-next-}}' href='javascript:;'></a>" +
                "<div class='{{-ui-calendar-items-}}'><div class='{{-ui-calendar-item-}}'>" +
                "<div class='{{-ui-calendar-months ui-calendar-two-months-}}'>{{_palceholder_repeat_month_s_}}<div class='{{-ui-calendar-month-}}'>" +
                "<table class='{{-ui-calendar-left-}}'><tbody><tr>" +
                "<td>{{_palceholder_year_item_}}年<br>{{_palceholder_month_item_}}月</td>" +
                "</tr></tbody></table><table class='{{-ui-calendar-right-}}'><tbody>" +
                "{{_palceholder_repeat_week_s_}}<tr>{{_palceholder_repeat_date_s_}}" +
                "<td class='{{-ui-calendar-out-of-month-}} {{_palceholder_day_class_}}'>{{_palceholder_repeat_unit_s_}}<a herf='javascript:;' class='{{-ui-calendar-disabled ui-calendar-enabled-}}' {{_palceholder_date_attr}}><span class='ui-calendar-date'>{{_palceholder_date_item_}}</span>" +
                "<span class='ui-calendar-data'></span></a>{{_palceholder_repeat_unit_e_}}</td>{{_palceholder_repeat_date_e_}}" +
                "</tr>{{_palceholder_repeat_week_e_}}</tbody></table></div>{{_palceholder_repeat_month_e_}}</div></div></div></div></div>"
        },
        thisObj = {};

    function Calendar(target, options) {
        var _cYear, _cMonth;
        this.$target = F.one(target);
        if (!(this.$target && this.$target[0])) this.$target = F.one("body");
        //初始化数据
        this.opts = this.opts || {};
        F.lang.extend(this.opts, settings);
        F.lang.extend(this.opts, options);

        //数据完善
        this.opts.startTime = F.parseDate(this.opts.startTime || "1900-01-01");
        this.opts.endTime = F.parseDate(this.opts.endTime || "2101-01-01");

        //容错
        this.opts.currentTime = F.parseDate(this.opts.currentTime);

        //根据具体情况重置

        if (this.opts.optimCurrentMonth) {
            _cYear = this.opts.currentTime.getFullYear();
            _cMonth = this.opts.currentTime.getMonth();
            //判断当前渲染时间  在当前月份 还剩几周，小于等于三周 需要显示半月
            this.opts.optimCurrentMonth = thisObj.monthWeekLength(_cYear, _cMonth, this.opts.firstDay) - thisObj.monthWeekIndex(this.opts.currentTime, this.opts.firstDay) < 4;
        }
        this.opts.template = this.opts.template.replace(/\{\{\-/ig, "").replace(/\-\}\}/ig, "");

        this.opts.template = thisObj.formatTemplate(this.opts.template);
        //this.opts.specialDate = F.lang.extend(eval("({'" + F.parseTime(new Date(), { days: -1 }) + "':'昨天','" + F.parseTime(new Date()) + "':'今天','" + F.parseTime(new Date(), { days: 1 }) + "':'明天'})"), this.opts.specialDate)


        this.init();
        if (this.opts.callback && thisObj.isFunction(this.opts.callback)) this.opts.callback.call(this);
    }
    Calendar.prototype.init = function() {
        this.skip(this.opts.currentTime);
    };
    Calendar.prototype.skip = function(time) { //一定要传年、月、日我判断一下 当前是否是需要优化月份的
        if (!(time && thisObj.typeDeepOf(time) === "date")) return false;
        this.updateCache("current", time);
        var $panel = this.opts.template.whole,
            _cYear = time.getFullYear(),
            _cMonth = time.getMonth(),
            days = thisObj.monthDays(_cYear, _cMonth, this.opts.firstDay),
            optim = time.getDate() != 1 && this.opts.optimCurrentMonth,
            _temp = "",
            _len = 0,
            __temp = "";
        //初始化日历头
        $panel = $panel.replace("{{_palceholder_head_}}", this.renderHead(days.slice(0, 7)));
        if (optim) { //需要优化的时间
            _len = thisObj.monthWeekLength(_cYear, _cMonth, this.opts.firstDay);
            days = days.slice((_len - 3) * 7, _len * 7);
            for (var i = 0, __len = days.length / 7; i < __len; i++) {
                _temp += this.renderWeek(days.slice(i * 7, (i + 1) * 7));
            }

            _temp = this.opts.template.monthItem.replace("{{_palceholder_week_}}", _temp);
            _temp = _temp.replace("{{_palceholder_year_item_}}", _cYear).replace("{{_palceholder_month_item_}}", _cMonth > 8 ? _cMonth + 1 : "0" + (_cMonth + 1))

            days = F.parseDate(days[days.length - 1], { days: 1 });
            _len = thisObj.monthWeekIndex(days, this.opts.firstDay);
            _cYear = days.getFullYear();
            _cMonth = days.getMonth();
            days = thisObj.monthDays(_cYear, _cMonth);
            days = days.slice(_len * 7, (_len + 3) * 7)
            for (var i = 0, __len = days.length / 7; i < __len; i++) {
                __temp += this.renderWeek(days.slice(i * 7, (i + 1) * 7));
            }

            _temp += this.opts.template.monthItem.replace("{{_palceholder_week_}}", __temp);
            _temp = _temp.replace("{{_palceholder_year_item_}}", _cYear).replace("{{_palceholder_month_item_}}", _cMonth > 8 ? _cMonth + 1 : "0" + (_cMonth + 1))

            $panel = $panel.replace("{{_palceholder_month_}}", _temp);
        } else {
            $panel = $panel.replace("{{_palceholder_month_}}", this.renderMonth(_cYear, _cMonth));
            $panel = $panel.replace("ui-calendar-two-months", "");
        }

        F.all(".ui-calendar", this.$target).html("remove");

        $panel = thisObj.createHTML($panel);

        this.updateCache("queue items", time, true);
        if (!this.opts.skipBtn) {
            F.all(".ui-calendar-btn", $panel).html("remove");
        }
        var $prevBtn = F.one(".ui-calendar-btn.ui-calendar-prev", $panel),
            $nextBtn = F.one(".ui-calendar-btn.ui-calendar-next", $panel);
        this.isPrev() ? $prevBtn.removeClass("ui-calendar-prev-disabled ui-calendar-disabled") : $prevBtn.addClass("ui-calendar-prev-disabled ui-calendar-disabled");
        this.isNext() ? $nextBtn.removeClass("ui-calendar-next-disabled ui-calendar-disabled") : $nextBtn.addClass("ui-calendar-next-disabled ui-calendar-disabled");

        this.registerEvent($panel);

        this.$target.html("bottom", $panel);

        if (this.opts.skip && thisObj.isFunction(this.opts.skip)) this.opts.skip.call(this, time);

    };
    Calendar.prototype.renderHead = function(weeks) {
        var temp = this.opts.template.headItem,
            str = "",
            day;
        for (var i = 0, len = weeks.length; i < len; i++) {
            day = weeks[i].getDay();
            str += this.opts.template.headItem.replace("{{_palceholder_head_item_}}", this.opts.dayNames[day]).replace("{{_palceholder_day_class_}}", this.opts.classNames[day])
        }

        return str;
    };
    Calendar.prototype.renderMonth = function(year, month) {
        var days = thisObj.monthDays(year, month, this.opts.firstDay),
            str = "";
        for (var i = 0, len = days.length / 7; i < len; i++) {
            str += this.renderWeek(days.slice(i * 7, (i + 1) * 7));
        }
        str = this.opts.template.monthItem.replace("{{_palceholder_week_}}", str);
        return str.replace("{{_palceholder_year_item_}}", year).replace("{{_palceholder_month_item_}}", month > 8 ? month + 1 : "0" + (month + 1));
    };
    Calendar.prototype.renderWeek = function(days) {
        var str = "";
        if (!(days && days.length == 7)) return str;
        for (var i = 0, len = days.length; i < len; i++) {
            str += this.renderDate(days[i]);
        }
        return this.opts.template.weekItem.replace("{{_palceholder_date_}}", str);
    };
    Calendar.prototype.renderDate = function(date) {
        var str = "",
            obj = this.getDateStatus(date);
        if (!(date && thisObj.typeDeepOf(date) === "date")) return str;
        str = this.opts.specialDate[F.parseTime(date)] || date.getDate();
        str = this.opts.template.unitItem.replace("{{_palceholder_date_item_}}", str);

        if (obj.isValid) str = str.replace("ui-calendar-disabled", "");
        else str = str.replace("ui-calendar-enabled", "");
        /*if (obj.isOut) str = this.opts.template.dateItem.replace("{{_palceholder_unit_}}", "")
        else {
            str = this.opts.template.dateItem.replace("{{_palceholder_unit_}}", str);
            str = str.replace("ui-calendar-out-of-month", "");
        }*/
        str = this.opts.template.dateItem.replace("{{_palceholder_unit_}}", str);
        if (!obj.isOut) str = str.replace("ui-calendar-out-of-month", "");
        str = str.replace("{{_palceholder_date_attr}}", "date-attr='" + F.parseTime(date) + "'");
        str = str.replace("{{_palceholder_day_class_}}", this.opts.classNames[date.getDay()]);
        return str;
    };
    Calendar.prototype.updateCache = function(type, time, value) { //更新缓存数据
        var key = F.parseTime(time || new Date()),
            monthKey = key.split("-").slice(0, 2).join("-"),
            date = key.split("-").slice(2)[0],
            cache = this.Cache || {};
        switch (type) {
            case 'current': //记录当前时间
                cache["current"] = cache.current || {};
                cache.current = key;
                break;
            case 'items': //记录当前时间是否应经记载处理过(本次改变缓存格式，这个属性可能不再用)
                cache["items"] = cache.items || {};
                cache.items[key] = value;
                break;
            case "queue items": // 记录队列值
                cache["queue"] = cache.queue || { items: [], index: 0 };
                cache["queue"]["items"] = value ? cache["queue"]["items"].concat([key]) : [key].concat(cache["queue"]["items"]);
                break;
            case "queue index":
                cache["queue"] = cache.queue || { items: [], index: 0 };
                cache["queue"]["index"] = value ? cache["queue"]["index"] + 1 : cache["queue"]["index"] - 1 >= 0 ? cache["queue"]["index"] - 1 : 0;
                break;
            case "datas": //记录月份数据
                cache["datas"] = cache.datas || {};
                cache.datas[monthKey] = value;
                break;
            case 'day items': //记录对应日期的元素
                cache['days'] = cache.days || {};
                cache.days[monthKey] = cache.days[monthKey] || {};
                cache.days[monthKey][date] = cache.days[monthKey][date] || { 'items': [], 'data': {} };
                cache.days[monthKey][date].items.push(F.all(value));
                break;
            case 'day data': //记录对应日期的数据
                cache['days'] = cache.days || {};
                cache.days[monthKey] = cache.days[monthKey] || {};
                cache.days[monthKey][date] = cache.days[monthKey][date] || { 'items': [], 'data': {} };
                cache.days[monthKey][date].data[key] = value;
                break;
            default:
                break;
        }
        this.Cache = this.Cache || {};
        F.lang.extend(this.Cache, cache);
    };
    Calendar.prototype.getCache = function(type, time) { //获取缓存数据
        var key = F.parseTime(time || new Date()),
            monthKey = key.split("-").slice(0, 2).join("-"),
            date = key.split("-").slice(2)[0],
            cache = this.Cache || {} //$.data(this.$wrapper,'calendars')||{}
            ,
            data = null;
        switch (type) {
            case 'current': //获取当前时间是否应经记载处理过
                //cache["current"]=cache.current||{};
                data = cache.current;
                break;
            case 'items': //获取当前时间是否应经记载处理过
                //cache["items"]=cache.items||{};
                data = cache.items[key];
                break;
            case 'queue items':
                data = cache.queue.items;
                break;
            case "queue index":
                data = cache.queue.index;
                break;
            case 'datas': //获取对应日期的元数据(整个月)
                cache["datas"] = cache.datas || {};
                data = cache['datas'][monthKey];
                break;
            case 'day item': //获取某一天的所有元素
                if (cache['days'][monthKey] && cache['days'][monthKey][date]) {
                    data = $(cache.days[monthKey][date].items);
                }
                break;
            case 'day data': //获取某一天的所有数据
                if (cache['days'][monthKey] && cache['days'][monthKey][date]) {
                    data = cache.days[monthKey][date].data;
                }
                break;
            default:
                break;
        }
        return data;
    };
    Calendar.prototype.getDateStatus = function(date) {
        if (!(date && thisObj.typeDeepOf(date) === "date")) return date;
        var crtTime = F.parseDate(this.getCache("current")),
            isValid = false,
            isOut = false,
            cYear = crtTime.getFullYear(),
            cMonth = crtTime.getMonth(),
            cDate = crtTime.getDate(),
            dYear = date.getFullYear(),
            dMonth = date.getMonth(),
            dDate = date.getDate();
        if (thisObj.compareTime(this.opts.endTime, this.opts.startTime) == 1 &&
            thisObj.compareTime(this.opts.endTime, date) >= 0 &&
            thisObj.compareTime(date, this.opts.startTime) >= 0)
            isValid = true;
        /**
         * 不显示相邻月份
         * 时间不是当前月份
         * 当前月不是优化月
         **/
        if (!this.opts.showOtherMonths &&
            (cYear != dYear || cMonth != dMonth) &&
            !(cDate != 1 && this.opts.optimCurrentMonth))
            isOut = true;
        return {
            isValid: isValid,
            isOut: isOut
        }
    };
    Calendar.prototype.prev = function() {
        if (!this.isPrev()) return false;
        var crtDate = F.parseDate(this.getCache("current"));
        this.skip(thisObj.prevMonth(crtDate));
    }
    Calendar.prototype.next = function() {
        if (!this.isNext()) return false;
        var crtDate = F.parseDate(this.getCache("current"));
        this.skip(thisObj.nextMonth(crtDate));
    }
    Calendar.prototype.isPrev = function() {
        var index = this.getCache("queue index"),
            current = this.getCache("current"),
            startTime = F.parseDate(this.opts.startTime),
            _sYear = startTime.getFullYear(),
            _sMonth = startTime.getMonth();

        if (index > 0) return true;
        current = F.parseDate(current);
        return thisObj.compareTime(thisObj.prevMonth(current), new Date(_sYear, _sMonth, 1)) >= 0;
    };
    Calendar.prototype.isNext = function() {
        var index = this.getCache("queue index"),
            items = this.getCache("queue items"),
            current = this.getCache("current"),
            show = this.opts.visibleMonths,
            step = this.opts.stepMonths,
            endTime = F.parseDate(this.opts.endTime),
            _eYear = endTime.getFullYear(),
            _eMonth = endTime.getMonth();
        if (index + show + step <= items.length) return true;
        current = F.parseDate(items[items.length - 1]);
        return thisObj.compareTime(new Date(_eYear, _eMonth, thisObj.monthLength(_eYear, _eMonth)), thisObj.nextMonth(current)) >= 0;
    };
    Calendar.prototype.registerEvent = function($panel) {
        if (!($panel && $panel[0])) return false;
        var $prevBtn = F.one(".ui-calendar-btn.ui-calendar-prev", $panel),
            $nextBtn = F.one(".ui-calendar-btn.ui-calendar-next", $panel),
            that = this;
        $prevBtn.on("click", function() {
            if (F.one(this).hasClass("ui-calendar-disabled")) return false;
            that.prev();
        });
        $nextBtn.on("click", function() {
            if (F.one(this).hasClass("ui-calendar-disabled")) return false;
            that.next();
        });

        F.all(".ui-calendar-enabled,.ui-calendar-disabled", $panel).each(function() {
            if (that.opts.drawUnit && thisObj.isFunction(that.opts.drawUnit)) that.opts.drawUnit.call(this, that, this);
        });
    };
    //私有方法类

    F.lang.extend(thisObj, {
        /*
         *
         * 判断元素的原本类型
         *
         */
        typeDeepOf: function(obj) {
            if (typeof obj !== "object") return typeof obj;
            return Object.prototype.toString.apply(obj).slice(8, -1).toLowerCase();
        },
        /*
         *
         * 字符串转换成JSON
         *
         */
        stringParseJSON: function(str) {
            if (typeof str !== "string") return null;
            var fn = function(_fn) {
                    try {
                        return _fn();
                    } catch (ex) {
                        return ex;
                    }
                },
                obj;
            if (!str.length) return null;
            obj = fn(function() {
                return JSON.parse(str);
            });
            if (this.typeDeepOf(obj) === "object" || this.typeDeepOf(obj) === "array") return obj;
            obj = fn(function() {
                return (new Function("return " + str))();
            });
            if (this.typeDeepOf(obj) === "object" || this.typeDeepOf(obj) === "array") return obj;
            obj = fn(function() {
                return eval("(" + str + ")");
            });
            if (this.typeDeepOf(obj) === "object" || this.typeDeepOf(obj) === "array") return obj;
            return null;
        },
        /*
         *
         * 当前replace方法
         *
         */
        replaceFn: function(str, _str, type) {
            if (typeof str !== "string" || typeof _str !== "string") return str;
            return str.replace(stringFormat("{{_palceholder_{0}_item_}}", type), _str);
        },
        /**
         * 
         * 获取需要循环的字符串
         * 每次只扒取一层
         *
         **/
        getRepeatStr: function(str, name) {
            if (typeof str !== "string") return str;
            var _s = "{{_palceholder_repeat_{0}_s_}}",
                _e = "{{_palceholder_repeat_{0}_e_}}";
            _s = this.stringFormat(_s, name);
            _e = this.stringFormat(_e, name);

            return str.slice(str.indexOf(_s) + _s.length, str.lastIndexOf(_e));
        },
        createHTML: function(str) {
            if (typeof str !== "string") return str;
            if (F && F["create"]) return F.create(str);
            var elem = document.createElement("div"),
                childs = [];
            F.one(elem).html(str);
            for (var i = 0; i < elem.childNodes.length; i++) {
                if (elem.childNodes[i].nodeType === 1) {
                    childs.push(elem.childNodes[i]);
                }
            }
            elem = null;
            return F.all(childs);
        },
        formatTemplate: function(template) {
            if (!(template && this.typeDeepOf(template) === "string")) return "";
            var _whole = template
            _headItemStr = this.getRepeatStr(template, "head"),
                _headReplaceStr = this.stringFormat("{{_palceholder_repeat_{0}_s_}}{1}{{_palceholder_repeat_{0}_e_}}", "head", _headItemStr),
                _dateItemStr = this.getRepeatStr(template, "date"),
                _weekItemStr = this.getRepeatStr(template, "week"),
                _monthItemStr = this.getRepeatStr(template, "month"),
                _unitItemStr = this.getRepeatStr(template, "unit");
            _whole = _whole.replace(_headReplaceStr, "{{_palceholder_head_}}");
            _whole = _whole.replace(this.stringFormat("{{_palceholder_repeat_{0}_s_}}{1}{{_palceholder_repeat_{0}_e_}}", "month", _monthItemStr), "{{_palceholder_month_}}");
            _monthItemStr = _monthItemStr.replace(this.stringFormat("{{_palceholder_repeat_{0}_s_}}{1}{{_palceholder_repeat_{0}_e_}}", "week", _weekItemStr), "{{_palceholder_week_}}")
            _weekItemStr = _weekItemStr.replace(this.stringFormat("{{_palceholder_repeat_{0}_s_}}{1}{{_palceholder_repeat_{0}_e_}}", "date", _dateItemStr), "{{_palceholder_date_}}");
            _dateItemStr = _dateItemStr.replace(this.stringFormat("{{_palceholder_repeat_{0}_s_}}{1}{{_palceholder_repeat_{0}_e_}}", "unit", _unitItemStr), "{{_palceholder_unit_}}")
            return {
                whole: _whole,
                headItem: _headItemStr,
                monthItem: _monthItemStr,
                weekItem: _weekItemStr,
                dateItem: _dateItemStr,
                unitItem: _unitItemStr
            }
        },
        isFunction: function(fn) {
            return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + "");
        },
        /*
         *
         * 比较两个时间先后(只比较年月日,不比较日分秒)
         * return 1:大于，-1：小于，0：等于
         *
         */
        compareTime: function(time1, time2) {
            time1 = F.parseDate(time1);
            time2 = F.parseDate(time2);
            time1 = new Date(time1.getFullYear(), time1.getMonth(), time1.getDate()).getTime();
            time2 = new Date(time2.getFullYear(), time2.getMonth(), time2.getDate()).getTime();
            return time1 > time2 ? 1 : time1 < time2 ? -1 : 0;
        },
        /*
         * 获取time在本周的索引（索引从0始）
         * time 时间
         * day 起始星期
         */
        weekIndex: function(time, day) {
            var _day = F.parseDate(time).getDay(),
                len;
            day = isNaN(parseInt(day)) ? 0 : parseInt(day, 10) >= 0 && parseInt(day, 10) <= 6 ? parseInt(day, 10) : 0;
            len = _day - day;
            return len == 0 ? 0 : len > 0 ? len : (7 + len);
        },
        /*
         *
         * 获取time在本月第几周（索引从0始）
         * time 时间
         * day 起始星期
         *
         */
        monthWeekIndex: function(time, day) {
            var count = 0,
                time = F.parseDate(time),
                year = time.getFullYear(),
                month = time.getMonth(),
                _time = F.parseDate(time, { days: 0 - this.weekIndex(time, day) - 1 });
            while (_time.getFullYear() == year && _time.getMonth() == month) {
                _time = F.parseDate(_time, { days: -7 });
                count++;
            }
            return count;
        },
        /*
         * 获取某一个月的天数（month从0开始）
         */
        monthLength: function(year, month) {
            return new Date(month == 11 ? year + 1 : year, month == 11 ? 0 : month + 1, 0).getDate();
        },
        /*
         *
         * 获取某一月共多少周（索引从0始）
         * year 年
         * month 月（从0开始）
         * day 起始星期
         *
         */
        monthWeekLength: function(year, month, day) {
            return this.monthWeekIndex(new Date(year, month, this.monthLength(year, month)), day) + 1;
        },
        // 获取某一个月下月（month从0开始）
        nextMonth: function(time) {
            time = F.parseDate(time);
            var year = time.getFullYear(),
                month = time.getMonth();
            return new Date(month == 11 ? year + 1 : year, month == 11 ? 0 : month + 1, 1);
        },
        // 获取某一月上月（month从0开始）
        prevMonth: function(time) {
            time = F.parseDate(time);
            var year = time.getFullYear(),
                month = time.getMonth();
            return new Date(month == 0 ? year - 1 : year, month == 0 ? 11 : month - 1, 1);
        },
        monthDays: function(year, month, day) { //获取每月具体天数
            var days = [],
                time = new Date(year, month, 1),
                count = 42;
            time = F.parseDate(time, { days: 0 - this.weekIndex(time, day) });
            while (count--) {
                days.push(time);
                time = F.parseDate(time, { days: 1 });
            }
            return days;
        },

        stringFormat: function() {
            if (arguments.length == 0)
                return "";
            var str = typeof arguments[0] === "string" ? arguments[0] : "";
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);
            }
            return str;
        }
    })

    F.extend({
        cruiseCal: Calendar
    });
    if (typeof define !== "undefined") {
        define([], function() {
            return Calendar;
        });
    }

}(fish, window, window.document);
