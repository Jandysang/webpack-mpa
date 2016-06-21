/*
 * @file fish.calendar.js
 *
 * 日历控件
 *
 * @code
 *   fish.one('.calendar_wrapper').calendar()
 * @endcode
 *
 * @author ghy
 * @date  2014-04-16
 * @version  1.0
 * @todo 重构(架构，renders系列，cache系列)，完善prev()方法,添加节日、setTime方法。。
 */
//判断是否为分享链接
;
(function() {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var orefid = GetQueryString("refid"),
        ip = GetQueryString("Ip"),
        olineid = fish.one("#HidLineid").val();
    if (orefid != null && ip != null) {
        fish.ajax({
            url: "/youlun/AjaxCall_Cruise.aspx?Type=AddMembersRecommendByCn",
            data: "lineId=" + olineid + "&ouserId=" + orefid + "&ShareIp=" + ip,
            type: "json",
            fn: function(data) {}
        })
    }
})();
(function() {
    current = 0;
    fish.extend({
        calendar: function(config) {
            if (!this || !this.length) return;

            config = config || {};
            config.target = this;

            return new calendar(config);
        }
    });
    var startT = fish.one("#calendar_wrapper").attr("attr_first"),
        cal_btn = false;

    function calendar(config) {
        this.DEFAULT = {
            // 开始时间
            startTime: startT ? startT : fish.one("#calendar_top li.on").attr("s_date"),
            // 结束时间
            endTime: '',
            // 选中的时间
            time: '',

            showing_time: '', // 当前展示的时间。
            showing_time_begin: '', // 当前展示的开始边界时间
            showing_time_end: '', // 当前展示的结束边界时间。

            prev_disabled: false,

            next_disabled: false,

            item_height: 0, // 日历元素的高度
            item_width: 0 // 日历元素的宽度
        }

        // 缓存异步数据，和天数的每个框。
        // data 为元数据，例如异步过来的数据。
        // days 则是每一天的数据。
        // @see this.updateCache(type, time, value)
        this.cache = { datas: {}, days: {}, items: {} };

        // 生成每月每天的Data。
        this.getMonthData = function(data, year, month) {
            return data.data;
        }

        // 生成每天的用户数据
        this.getDayData = function(data, year, month, day) {
            return '';
        }

        this.checkClickable = function(data, year, month, day) {
                var time = fish.parseTime(year + '-' + month + '-' + day);
                return (fish.parseDate(this.startTime).getTime() <= fish.parseDate(time).getTime()) && (this.endTime ? fish.parseDate(time).getTime() <= fish.parseDate(this.endTime).getTime() : true) && this.clickable(data, year, month, day);
            }
            // 该元素是否可定。
        this.clickable = function(data, year, month, day) {
            return true;
        }

        config = fish.lang.extend(this.DEFAULT, config);

        return this.init(config)
    }

    calendar.prototype = {
        init: function(config) {
            fish.lang.extend(this, config);
            this.render();
        },
        // 包裹层。
        target: null,
        // 日历实体。
        wrapper: null,
        render: function() {
            // 1. 生成外框。
            this.wrapper = fish.create('<div class="calendar"><div class="calendar_body"> <a href="#" class="btn prev"></a> <a href="#" class="btn next"></a><div class="calendar_items"> </div> </div> </div>');
            // 2. 生成单帧日历。
            // 开始显示的时间
            var time = this.time || this.startTime;

            if (this.time && !this.isSameMonth(this.time, this.startTime)) {
                var date = fish.parseDate(time);
                time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01';
            } else if (this.time && this.isSameMonth(this.time, this.startTime)) {
                time = this.startTime;
            }
            var start_t = fish.one("#calendar_top li.on").attr("s_date"),
                end_t = fish.one("#calendar_top li.on").attr("e_date");
            fish.all('.calendar_items', this.wrapper).append(this.renderItem(time, start_t, end_t));

            (function(that) {
                fish.all('.prev', that.wrapper).on('click', function(e) {
                    fish.preventDefault(e);
                    that.prev();
                })
                fish.all('.next', that.wrapper).on('click', function(e) {
                    fish.preventDefault(e);
                    that.next();
                })
            })(this);
            this.target.append(this.wrapper);
            this.setShowingTime(time);
            this.setBtnsStatus();
            this.setItemHeight();
        },
        // 输出一帧日历
        renderItem: function(time, s_time, e_time, i) {
            var wrapper = fish.create('<div class="calendar_item"></div>');
            return wrapper.append(this.renderMonths(time, s_time, e_time, i));
        },
        // 按开始日期，自动输出2个月还是1个月。
        renderMonths: function(time, s_time, e_time, i) {
            var wrapper = fish.create('<div class="calendar_months"></div>');
            // 单月模式
            var date = fish.parseDate(time);
            wrapper.append(this.renderMonth(date.getFullYear() + '-' + (date.getMonth() + 1) + '-01', i));
            this.updateCache('items', date.getFullYear() + '-' + (date.getMonth() + 1) + '-01', true);
            this.getData(date.getFullYear(), date.getMonth() + 1, s_time, e_time);
            return wrapper;
        },

        // 按开始日期和日否需要下月补齐来输出单月数据。
        // @param time 开始日期
        // @param full 日否需要下月数据补齐。默认不需要补齐,false,。
        // @param single 是否单月模式。默认非单月模式，true。
        //
        // @TODO 重构这一部分。
        renderMonth: function(time, i, full, single) {
            full = full || false;
            single = (single == undefined) ? true : single;
            date = fish.parseDate(time);

            var start_day = date.getDay(), // 开始星期。
                start_date = date.getDate(), // 开始日期。
                total_days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), // 该月总天数,
                year_1 = date.getFullYear(),
                month_1 = date.getMonth() + 1,
                year_2 = month_1 + 1 > 12 ? year_1 + 1 : year_1,
                year_3 = month_1 + 2 > 12 ? year_1 + 1 : year_1,
                year_4 = month_1 + 3 > 12 ? year_1 + 1 : year_1,
                month_2 = month_1 + 1 > 12 ? month_1 - 11 : month_1 + 1,
                month_3 = month_1 + 2 > 12 ? month_1 - 10 : month_1 + 2,
                month_4 = month_1 + 3 > 12 ? month_1 - 9 : month_1 + 3,
                calendar_left = '<table class="calendar_left"><tbody><tr><td attr="' + year_1 + '-' + month_1 + '-01" class="on">' + year_1 + '年' + month_1 + '月</td><td attr="' + year_2 + '-' + month_2 + '-01">' + year_2 + '年' + month_2 + '月</td><td attr="' + year_3 + '-' + month_3 + '-01">' + year_3 + '年' + month_3 + '月</td><td attr="' + year_4 + '-' + month_4 + '-01">' + year_4 + '年' + month_4 + '月</td></tr></tbody></table>',
                calendar_right = '',
                index = 0;


            //点击判断顶部四个月是否要切换
            var allTd = fish.all(".calendar_left td");
            for (var j = 0; j < 4; j++) {
                if (fish.one(allTd[j]).hasClass("on")) {
                    index = j + 1;
                }
            }
            if (i == 1) { //直接点击到月份
                var html = fish.dom(".calendar_left").outerHTML;
                calendar_left = html;
            }
            //点击判断顶部四个月是否要切换end

            // 开始输出日期格子 calendar_right。
            var day = start_date, // 当前输出的日期。
                day_added = 1, // 补齐的日期。
                total = 1; // 当前第几个方格。
            count_date = fish.parseTime(time, { days: -start_day }); // 当前渲染的日期。

            for (var i = 0; i < (single ? 6 : 3); i++) {
                // A. 每周
                var week = ''
                for (j = 0; j < 7; j++) {
                    // B. 每周的每天。
                    var week_day;
                    if (i == 0 && j < start_day) {
                        // B.1 还没开始日期
                        week_day = '<td></td>';
                    } else {
                        // B.2 进入有日期的状态。
                        if (total > start_day && day <= total_days) {
                            // 还没补齐。
                            week_day = '<td><a href="#" data-date="' + count_date + '"><span class="date">' + (this.renderDate(count_date) || day) + '</span><span class="data"></span></a></td>';
                            day++;
                        } else {
                            // 进入补齐。
                            if (!full) {
                                // 不需要补齐。
                                week_day = '<td class="out_of_month"></td>';
                            } else {
                                week_day = '<td class="out_of_month"><a href="#" data-date="' + count_date + '"><span class="date">' + (this.renderDate(count_date) || day_added) + '</span><span class="data"></span></a></td>';
                                day_added++;
                            }
                        }
                    }

                    count_date = fish.parseTime(count_date, { days: 1 });
                    total++;
                    week += week_day;
                }

                week = '<tr>' + week + '</tr>';
                calendar_right += week;
            }
            calendar_right = '<table class="calendar_right"><tbody><tr><th>日</th><th>一</th> <th>二</th> <th>三</th> <th>四</th> <th>五</th> <th>六</th></tr>' + calendar_right + '</tbody></table>';

            // 输出month.
            calendar_month = fish.create('<div class="calendar_month ' + (this.isCurrentMonth(time) ? 'current_month' : '') + ' ">' + calendar_left + calendar_right + '</div>');

            // 开始更新缓存。
            var days = fish.all('a', calendar_month);
            for (var i = 0; i < days.length; i++) {
                this.updateCache('day elem', fish.one(days[i]).attr('data-date'), fish.one(days[i]));
            }

            return calendar_month;
        },

        // 是否是当前月份。
        isCurrentMonth: function(time) {
            var date = fish.parseDate(time),
                now = fish.parseDate(this.startTime);

            return now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth() ? true : false;
        },

        // 根据时间看该时间下是单月模式还是双月模式。
        timeIsSingleMode: function(time) {
            var date = fish.parseDate(time),
                leftdays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate() + 1; // 剩下的天数。

            if (Math.ceil((leftdays + date.getDay()) / 7) > 3) {
                // 剩下不止三星期。
                return true;
            } else {
                // 剩下三星期以内。
                return false;
            }
        },

        // 更新缓存。
        updateCache: function(type, time, value) {
            var date = fish.parseDate(time),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();
            if (type == 'day elem') {
                // 更新对应日期的元素
                var key = year + '-' + month,
                    days = this.cache.days;
                days[key] = days[key] || {};
                days[key][day] = days[key][day] || { 'elems': [], 'data': {} };
                days[key][day]['elems'].push(fish.dom(value));
            } else if (type == 'day data') {
                // 更新对应日期的数据
                var key = year + '-' + month,
                    days = this.cache.days;
                days[key] = days[key] || {};
                days[key][day] = days[key][day] || { 'elems': [], 'data': {} };
                days[key][day]['data'].push(value);
                // type == 'datas'
            } else if (type == 'datas') {
                // 更新对应日期的元数据。
                var key = year + '-' + month,
                    datas = this.cache.datas;
                datas[key] = value;
            } else if (type == 'items') {
                this.cache.items[time] = value;
            }
        },

        getCache: function(type, time) {
            var date = fish.parseDate(time),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                data = null;

            if (type == 'datas') {
                data = this.cache['datas'][time];
            } else if (type == 'days') {
                if (this.cache['days'][year + '-' + month] && this.cache['days'][year + '-' + month][day]) {
                    data = this.cache['days'][year + '-' + month][day];
                }
            } else if (type == 'day elems') {
                if (this.cache['days'][year + '-' + month] && this.cache['days'][year + '-' + month][day]) {
                    data = this.cache['days'][year + '-' + month][day];
                    data = fish.all(data.elems);
                }
            } else if (type == 'day data') {
                if (this.cache['days'][year + '-' + month] && this.cache['days'][year + '-' + month][day]) {
                    data = this.cache['days'][year + '-' + month][day];
                    data = data.data;
                }
            } else if (type == 'items') {
                data = this.cache.items[time];
            }

            return data;
        },

        isEmpty: function() {},

        // 处理节日，特殊日期。
        renderDate: function(time) {
            var render = '';

            if (fish.parseTime() == fish.parseTime(time)) {
                render = '今天'
            }

            return render || this.timeToFestival(time);
        },

        // 由日期得到对应的节日。
        // @TODO 完善这个方法。
        timeToFestival: function(time) {
            var festival = ([{
                date: "2015-01-01",
                name: "元旦"
            }, {
                date: "2015-02-19",
                name: "春节"
            }, {
                date: "2015-04-04",
                name: "清明节"
            }, {
                date: "2015-05-01",
                name: "劳动节"
            }, {
                date: "2015-06-20",
                name: "端午节"
            }, {
                date: "2015-09-27",
                name: "中秋节"
            }, {
                date: "2015-10-01",
                name: "国庆节"
            }]);
            for (var i = 0; i < festival.length; i++) {
                if (festival[i].date == time) {
                    return festival[i].name;
                }
            }
            //return ''
        },

        // 获取数据。
        getData: function(year, month, s_time, e_time) {
            var url = this.url.replace('{startdate}', s_time).replace('{enddate}', e_time).replace('{year}', year).replace('{month}', month);
            // 查看在cache中是否有。
            var data = this.getCache('datas', year + '-' + month + '-01');
            if (data) {
                if (data == 'loading') return;
                this.processMonthData(this.getMonthData(data, year, month), year, month);
                return;
            }
            (function(that, year, month) {
                that.updateCache('datas', year + '-' + month + '-01', 'loading');
                fish.ajax({
                    url: url,
                    type: 'json',
                    fn: function(data) {
                        that.updateCache('datas', year + '-' + month + '-01', data);
                        that.processMonthData(that.getMonthData(data, year, month), year, month);
                        var saleUrl = fish.one("#calendar_wrapper").attr("attrpromotion-url"),
                            start_t = fish.one("#calendar_top li.on").attr("s_date"),
                            end_t = fish.one("#calendar_top li.on").attr("e_date");
                        fish.ajax({
                            url: saleUrl,
                            data: "startdate=" + start_t + "&enddate=" + end_t,
                            type: "json",
                            fn: function(data1) {
                                if (data1.PromotiondateList.length > 0) {
                                    for (var i = 0, d_length = data1.PromotiondateList.length; i < d_length; i++) {
                                        var saleDate = data1.PromotiondateList[i].Promotiondate;
                                        for (var j = 0, k = fish.all(".calendar_right a").length; j < k; j++) {
                                            if (saleDate == fish.one(fish.all(".calendar_right a")[j]).attr("data-date")) {
                                                var that = fish.one(fish.all(".calendar_right a")[j]);
                                                fish.one(".mcalpricebox", that).html("top", "<span class='sale'>惠</span>")
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        var length = fish.all("#calendar_top li").length;
                        for (var i = 0; i < length; i++) {
                            fish.all("#calendar_top li")[i].onclick = function(e) {
                                fish.preventDefault(e);
                                var target = fish.getTarget(e);
                                that.changeMonth(target);
                                fish.all("#calendar_top li").removeClass("on");
                                fish.one(this).addClass("on");
                            }
                        }
                        var pages = Math.ceil(fish.all("#calendar_top li").length / 4);

                        //点击切换下一页的月份
                        fish.one("#calendar_top .next")[0].onclick = function(e) {
                            if (!fish.one(this).hasClass("disabled")) {
                                if (current < pages - 1) {
                                    current++;
                                    fish.one("#calendar_top ul").anim("left:" + -483 * current + "px;");
                                    fish.one("#calendar_top .prev").removeClass("disabled");
                                    fish.all("#calendar_top li").removeClass("on");
                                    fish.preventDefault(e);
                                    var target = fish.all("#calendar_top li")[current * 4];
                                    that.changeMonth(target);
                                    fish.one(fish.all("#calendar_top li")[current * 4]).addClass("on");
                                }
                                if (current >= pages - 1) {
                                    fish.one(this).addClass("disabled");
                                }
                            }
                        }

                        //点击切换上一页的月份
                        fish.one("#calendar_top .prev")[0].onclick = function(e) {
                            if (!fish.one(this).hasClass("disabled")) {
                                if (current >= 0) {
                                    current--;
                                    fish.one("#calendar_top ul").anim("left:" + -483 * current + "px;");
                                    fish.one("#calendar_top .next").removeClass("disabled");
                                    fish.all("#calendar_top li").removeClass("on");
                                    fish.preventDefault(e);
                                    var target = fish.all("#calendar_top li")[current * 4];
                                    that.changeMonth(target);
                                    fish.one(fish.all("#calendar_top li")[current * 4]).addClass("on");
                                }
                                if (current == 0) {
                                    fish.one(this).addClass("disabled");
                                }
                            }
                        }

                    }
                })
            })(this, year, month);
        },

        // 处理每个月的数据
        processMonthData: function(data, year, month) {
            var days = new Date(year, month, 0).getDate();
            for (var i = 0; i < data.length; i++) {
                var day = i + 1;
                day_datas = this.cache['days'][year + '-' + month][day],
                    day_elems = null,
                    day_data = null;

                if (!day_datas) continue;

                day_elems = fish.all(day_datas.elems);
                day_data = day_datas.data = data[i];

                // 开始对每个元素注入数据，并且检测是否可被点击。
                for (var j = 0; j < day_elems.length; j++) {
                    var day_elem = fish.one(day_elems[j]);

                    this.processDayClass(day_elem, day_data, year, month, day);

                    fish.one('.data', day_elem).html(this.getDayData(day_data, year, month, day));

                    (function(that, elem) {
                        fish.one(elem).on('click', function(e) {
                            fish.preventDefault(e);
                            var time = fish.one(this).attr('data-date'),
                                date = fish.parseDate(time),
                                year = date.getFullYear(),
                                month = date.getMonth() + 1,
                                day = date.getDate(),
                                data = that.cache['days'][year + '-' + month][day]['data'];
                            if (that.beforeClick(data, year, month, day)) {
                                that.click(data, year, month, day);
                            }
                        })

                        fish.one(elem).hover(function() {
                            fish.one(this).addClass('hover');
                        }, function() {
                            fish.one(this).removeClass('hover')
                        })
                    })(this, day_elem);

                }

            }
        },

        processDayClass: function(elem, data, year, month, day) {
            if (this.checkClickable(data, year, month, day)) {
                elem.addClass('enabled').removeClass('disabled');
            } else {
                elem.addClass('disabled').removeClass('enabled');
            }

            var time = fish.parseTime(year + '-' + month + '-' + day),
                date = fish.parseDate(time);

            if (fish.parseTime() == time) {
                elem.addClass('today');
            }

            if (this.time == time) {
                elem.addClass('active');
            }
            if (date.getDay() == 0 || date.getDay() == 6) {
                elem.addClass('festival');
            }
            //添加节日的样式
            if (typeof(this.timeToFestival(time)) !== "undefined") {
                elem.addClass('chinfestival');
            }
        },

        beforeClick: function(data, year, month, day) {
            var time = fish.parseTime(year + '-' + month + '-' + day)
            if (!this.checkClickable(data, year, month, day)) {
                // 不可点击。
                return false;
            }

            // 获取上一个元素。
            if (this.time) {
                this.getCache('day elems', this.time).removeClass('active');
            }

            this.time = time;
            this.getCache('day elems', this.time).addClass('active');

            return true;
        },

        setShowingTime: function(time) {
            this.showing_time = time ? fish.parseTime(time) : this.startTime;
        },

        setItemHeight: function() {
            this.item_width = this.item_width || fish.one('.calendar_item', this.wrapper).width() || parseInt(fish.one('.calendar_item', this.wrapper).getCss('width'));
        },

        // 显示下个月份。
        next: function() {
            if (this.next_disabled) return;
            var time = this.showing_time,
                nd = time.split('-'),
                next_time = nd[0] + '-' + (parseInt(nd[1]) + 1) + '-01',
                calendar_items = fish.one('.calendar_items', this.wrapper),
                start_t = fish.one("#calendar_top li.on").attr("s_date"),
                end_t = fish.one("#calendar_top li.on").attr("e_date");
            calendar_items.html("").append(this.renderItem(next_time, start_t, end_t, 0));
            this.showing_time = next_time;
            this.setBtnsStatus();
        },
        //到当前月份
        goThatMonth: function(elem) {
            var thistime = fish.one(elem).attr("attr"),
                nd = thistime.split('-'),
                this_time = nd[0] + '-' + parseInt(nd[1]) + '-01',
                calendar_items = fish.all('.calendar_items', this.wrapper),
                start_t = fish.one("#calendar_top li.on").attr("s_date"),
                end_t = fish.one("#calendar_top li.on").attr("e_date");
            if (!fish.one(elem).hasClass("on")) {
                calendar_items.append(this.renderItem(this_time, start_t, end_t, 1));
                fish.one(".calendar_item").html("remove");
                this.showing_time = this_time;
                this.setBtnsStatus();
            }
        },
        // 显示上个月份。
        prev: function() {
            if (this.prev_disabled) return;
            var time = this.showing_time,
                prev_date = fish.parseDate(time, { months: -1 }),
                prev_time = '',
                calendar_items = fish.all('.calendar_items', this.wrapper),
                start_t = fish.one("#calendar_top li.on").attr("s_date"),
                end_t = fish.one("#calendar_top li.on").attr("e_date");
            if (prev_date.getFullYear() == fish.parseDate(this.startTime).getFullYear() && prev_date.getMonth() == fish.parseDate(this.startTime).getMonth() && !this.timeIsSingleMode(this.startTime)) {
                prev_time = this.startTime;
            } else {
                prev_time = prev_date.getFullYear() + '-' + (prev_date.getMonth() + 1) + '-01';
            }
            calendar_items.html("").append(this.renderItem(prev_time, start_t, end_t, 2));
            this.showing_time = prev_time;
            this.setBtnsStatus();
        },
        //新的可以跨月的切换
        changeMonth: function(elem) {
            var thistime = fish.one(elem).attr("s_date"),
                calendar_items = fish.all('.calendar_items', this.wrapper),
                start_t = fish.one(elem).attr("s_date"),
                end_t = fish.one(elem).attr("e_date");
            if (!fish.one(elem).hasClass("on")) {
                calendar_items.append(this.renderItem(thistime, start_t, end_t, 0));
                fish.one(".calendar_item").html("remove");
                this.showing_time = thistime;
                this.setBtnsStatus();
            }
        },

        setBtnsStatus: function() {
            fish.all('.calendar_right').children('tr').each(function(trem) {
                fish.one(trem).children('td').each(function(tdem) {
                    if (fish.one(trem).children('td').indexOf(this) == 0 || fish.one(trem).children('td').indexOf(this) == 6) {
                        fish.one(tdem).children('a').css('background:#f1f9ff');
                    }
                })
            });
            var prev = true,
                next = true,
                prevBtn = fish.all('.prev', this.wrapper),
                nextBtn = fish.all('.next', this.wrapper),
                showing_time_date = fish.parseDate(this.showing_time),
                start_time_date = fish.parseDate(this.startTime);

            if (showing_time_date.getTime() <= start_time_date.getTime()) {
                prev = false;
            }

            if (showing_time_date.getTime() > start_time_date.getTime() && showing_time_date.getFullYear() == start_time_date.getFullYear() && showing_time_date.getMonth() == start_time_date.getMonth() && this.timeIsSingleMode(this.startTime)) {
                prev = false;
            }

            if (this.endTime && this.isSameMonth(fish.parseDate(this.showing_time, { month: 1 }), fish.parseDate(this.endTime)) && this.timeIsSingleMode(this.showing_time)) {
                next = false;
            }

            prev ? prevBtn.removeClass('disabled') : prevBtn.addClass('disabled');
            next ? nextBtn.removeClass('disabled') : nextBtn.addClass('disabled');

            this.prev_disabled = !prev;
            this.next_disabled = !next;
        },
        isSameMonth: function(timeA, timeB) {
            dateA = fish.parseDate(timeA);
            dateB = fish.parseDate(timeB);
            return dateA.getFullYear() == dateB.getFullYear() && dateA.getMonth() == dateB.getMonth();
        },

        // 在当前帧后添加一帧。
        appendItem: function(time) {
            fish.all('.calendar_items', this.wrapper).append(this.renderItem(time));
        },

        // 在当前帧前添加一帧。
        insertItem: function(time) {
            fish.all('.calendar_items', this.wrapper).append(this.renderItem(time));
        }
    }

})();

//临时文件 买邮轮送体检 活动时间 6月30号
function hot520() {
    var tagstr = "";
    var date = new Date().getTime(),
        endDate = new Date("2016/07/01").getTime();
    if (date < endDate) {
        var th520 = '即日起至6月30日凡购买同程邮轮任意产品,成功付款购买后将获得孝心口令，凭该口令在善诊公众号可以免费预约价值235元的健康体检，快来送爸妈（45周岁以上）一份守护。<a href="http://www.ly.com/news/detail-64433.html" target="_blank">查看详情</a>';
        tagstr += '<p class="other_h"><span class="price_yh">促销优惠：<span class="other_a">买邮轮送体检' + getSpan(th520) + '</span></span></p>';
    }
    fish.one(".pr_mg").html("top", tagstr);

    function getSpan(txt) {
        return '<span class="comm_cut none"><span class="comm_mian"><span class="comm_s"></span><em>' + txt + '</em></span></span>';
    }
}
hot520();

//日历事件
;
(function() {
    fish.admin.config({
        Calendar: {
            v: "0.3",
            css: 1,
            g: 20140333106
        },
        mLogin: {
            v: '2.0',
            css: 1,
            g: 2012112073101
        }
    });
    var __v = {};
    __v.memberId = fish.cookie.get("cnUser", "userid") || fish.cookie.get("us", "userid") || 0;
    __v.oneCal = fish.one("#oneCal");
    __v.lineId = fish.one("#HidLineid").val();
    __v.collectLi = fish.one(".trip_msg li.collect_li");
    __v.isSaleEnd = fish.one("#hidIsValid").val(); //线路是否售罄 0 售罄
    if (__v.isSaleEnd && parseInt(__v.isSaleEnd, 10) == 1) {
        fish.ajax({
            url: "/youlun/AjaxCall_Cruise.aspx?Type=GetCruiseDate&lineid=" + __v.lineId,
            type: "json",
            sync: true,
            fn: function(data) {
                // console.log(data = JSON.parse(data));
                if (!data || !data.MouthList || data.MouthList.length <= 0) {
                    return;
                }
                var len = data.MouthList.length;
                getDateList(data.MouthList[0].startdate, data.MouthList[len - 1].enddate);
            }
        });
    }
    //日期异步
    function getDateList(s_time, e_time) {
        fish.ajax({
            url: __v.oneCal.attr("attr-url"),
            data: "lineid=" + __v.lineId + "&startdate=" + s_time + "&enddate=" + e_time,
            type: "json",
            sync: true,
            fn: function(data) {
                // console.log(data = JSON.parse(data))
                if (!data || !data.PriceList) {
                    return;
                }
                __v.page_cf = data.PriceList;
                if (data.PriceList.length > 1) {
                    __v.oneCal.addClass("act_date");
                    fish.one(".date_bg .data_input").val("查看更多航期").removeClass("no_act_date");
                    calendar();
                }
            }
        });
    }

    function calendar() {
        fish.require("Calendar", function() {
            var cal = new fish.Calendar({
                monthNum: 1,
                zIndex: 1000
            });
            var startDate = fish.parseDate(__v.page_cf[0].date),
                endDate = fish.parseDate(__v.page_cf[__v.page_cf.length - 1].date),
                sYY = startDate.getFullYear(),
                sM = startDate.getMonth() + 1,
                sD = startDate.getDate(),
                eYY = endDate.getFullYear(),
                eM = endDate.getMonth() + 1,
                eD = endDate.getDate();
            __v.oneCal.on("focus", function(e) {
                cal.pick({
                    elem: this, // 如果设置了elem的值，且elem参数为input框
                    startDate: sYY + "-" + sM + "-" + sD,
                    endDate: eYY + "-" + eM + "-" + eD,
                    mode: "rangeFrom",
                    fn: function(y, d, r, td) {
                        var objTd = fish.one(td);
                        setPriceHtml({
                            price: objTd.attr("_price"),
                            retail: objTd.attr("_retail"),
                            date: objTd.attr("_date"),
                            addDays: parseInt(fish.one("#hidDays").val()),
                            setWeek: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
                        });
                        fish.all("#HidDate,#HidCalendarDate").val(fish.one("#oneCal").val());
                        fish.one("#hidRate").val(objTd.attr("_price") || 0);
                        fish.one("#hidTjBeginDate").val(fish.one("#oneCal").val());
                        var ttime = new Date(fish.one("#oneCal").val().replace(/-/g, "/")).getTime() - (1000 * 60 * 60 * 24);
                        ttime = new Date(ttime);
                        ttime = ttime.getFullYear() + "-" + ((ttime.getMonth() + 1) > 9 ? (ttime.getMonth() + 1) : ("0" + (ttime.getMonth() + 1))) + "-" + (ttime.getDate() > 9 ? ttime.getDate() : ("0" + ttime.getDate()));
                        fish.one("#txtLeaveDate").val(ttime);
                        itinerary();
                        getPrice();
                    },
                    // currentDate: [new Date()],
                    buildContent: function(td, date, dateStr) {
                        var data = __v.page_cf;
                        __v.build(td, date, dateStr, data);
                    }
                });
            });

        });
    }

    __v.selPrice = fish.one(".pri_d span strong b");
    __v.prPrice = fish.one(".mark_p i");
    __v.disC = fish.one(".pri_dis");
    __v.d_back = fish.one(".date_box .back_date span");
    __v.d_actt = fish.one(".date_box .now_date span");
    __v.link_order = fish.one(".ele_topDom .link_order");
    __v.fix_order_link = fish.one(".fix_order .fix_order_link");
    __v.bait_f = fish.one(".bait_infro > span");
    __v.bait_fi = fish.one(".bait_infro .span2");
    //修改页面的价格等显示
    function setPriceHtml(param) {
        var param = {
            price: param.price,
            retail: param.retail,
            disCont: (Math.round(param.price / param.retail * 100) / 10.0).toFixed(1),
            date: param.date,
            addDays: param.addDays,
            setWeek: param.setWeek,
            mHref: function(href) {
                var that = this,
                    keyParam = href.split(/\.html\?/g)[1] || "", //获取链接之后的参数 Key=191205233002148100051079
                    nDate = that.date.replace(/-([0-9]{2})/g, function(a, b) {
                        return "-" + parseInt(b, 10);
                    }); // /youlun/linebook/72426_2015-9-23.html?Key=191205233002148100051079
                return "/youlun/linebook/" + __v.lineId + "_" + nDate + ".html?" + keyParam;

            },
            setActDate: function() {
                var that = this,
                    nDate = new Date(that.date.replace(/\-/gi, "/")),
                    yDate = nDate.getTime(),
                    backDate = new Date(yDate),
                    y = backDate.getFullYear(),
                    m = backDate.getMonth() + 1,
                    d = backDate.getDate();
                return y + "年" + m + "月" + d + "日" + " " + that.setWeek[backDate.getDay()]
            },
            setBackDate: function() {
                var that = this,
                    nDate = new Date(that.date.replace(/\-/gi, "/")),
                    yDate = nDate.getTime() + that.addDays * 24 * 3600 * 1000,
                    backDate = new Date(yDate),
                    y = backDate.getFullYear(),
                    m = backDate.getMonth() + 1,
                    d = backDate.getDate();
                return y + "年" + m + "月" + d + "日" + " " + that.setWeek[backDate.getDay()]

            }
        };

        if (jsonBlankStage.length > 0) {
            var n = 0,
                fag = false;
            for (var i = 0; i < jsonBlankStage.length; i++) {
                var date = jsonBlankStage[i].date;
                if (date == param.date) {
                    n = i;
                    fag = true;
                    break;
                }
            }
            if (fag) {
                fish.one(".bait_infro").removeClass("none");
                fish.one(".price_dom").removeClass("no_b_tip");
                __v.bait_f.html("可分" + jsonBlankStage[n].f + "期支付，出游更超值！");
                __v.bait_fi.html("免息" + jsonBlankStage[n].d + "期");
            } else {
                fish.one(".bait_infro").addClass("none");
                fish.one(".price_dom").addClass("no_b_tip");
            }
        }
        __v.selPrice.html(param.price);
        //给公共导航弹框-赋值，--判断是否存在公共弹框,并且公共弹框里的内容是否为0，然后赋值
        var $modalInput = fish.one(".ylc-modal .eve_yusuan input");
        if ($modalInput && $modalInput[0] && parseInt($modalInput.val(), 10) <= 0) {
            $modalInput.val(param.price);
            $modalInput.attr("_placeholder", param.price);
        }

        __v.prPrice.html(param.retail);
        if (param.disCont <= 0 || param.disCont >= 10) {
            __v.disC.addClass("none").html("");
        } else {
            __v.disC.removeClass("none").html(param.disCont + "折");
        }
        //出发返回日期
        __v.d_actt.html(param.setActDate());
        __v.d_back.html(param.setBackDate());
        __v.link_order.attr("href", param.mHref(__v.link_order.attr("href")));
        __v.fix_order_link.attr("href", param.mHref(__v.fix_order_link.attr("href")));
        var date = new Date(param.date.replace(/\-/gi, "/")).getTime();
        fish.all("#ins_shower .dayth em").each(function(elem, i) {
            fish.one(this).html("(" + (new Date(date + i * 1000 * 60 * 60 * 24).getMonth() + 1) + "月" + new Date(date + i * 1000 * 60 * 60 * 24).getDate() + "日)");
        });
    }

    // 生成日历每个单元格。
    __v.tmpl = '<span class="date">{dateStr}</span><a class="dayjh" href="javascript:void(0);"></a><span class="dataprice">{priceStr}</span>';
    __v.build = function(td, date, dateStr, data) {
        var dateTime = date.getTime(),
            item, info, htmlStr,
            place, classArr = [];
        for (var i = 0, len = data.length - 1; i <= len; i++) {
            item = data[i];
            //这里获得的是8点的毫秒数
            var _date = Date.parse(item.date.replace(/\-/gi, "/"));
            if (_date >= dateTime && _date < dateTime + 1000 * 60 * 60 * 24) {
                info = item;
                break;
            }
        }
        if (!info) {
            info = {};
        }
        info.dateStr = (dateStr ? dateStr : date.getDate());
        if (!info.date) {
            classArr.push("invalid-day");

        } else {
            info.priceStr = info.price + "元";
            for (key in info) {
                td.setAttribute("_" + key, info[key]);
            }
        }
        htmlStr = this.tmpl.replace(/{(\w+)}/g, function($0, $1) {
            return info[$1] || "";
        });
        td.innerHTML = htmlStr;
        fish.one(td).addClass(classArr.join(" "));
    };



    //是否已收藏
    function isCollected(callBack) {
        if (!__v.memberId) return false;
        fish.ajax({
            url: "/youlun/MemberFavoritesHandler.ashx?type=searchnew&productId=" + __v.lineId,
            openType: "get",
            type: "json",
            fn: function(data) {
                if (!data) return false;
                if (data.ResultFlag === true) {
                    __v.collectLi.addClass("collected")
                }
                callBack && callBack(data.ResultFlag);
            }
        });
    }
    isCollected();
    //点击收藏
    __v.collectLi.on("click", function() {
        if (!__v.memberId) {
            fish.mLogin({
                unReload: true,
                maskClose: true,
                loginSuccess: function() {
                    __v.memberId = fish.cookie.get("cnUser", "userid") || fish.cookie.get("us", "userid") || 0;
                    isCollected(function(resultFlag) {
                        if (resultFlag != true) {
                            //收藏
                            fish.ajax({
                                url: "/youlun/MemberFavoritesHandler.ashx?type=Addnew&productId=" + __v.lineId,
                                openType: "get",
                                type: "json",
                                fn: function(data) {
                                    if (!data) return false;
                                    if (data.ResultFlag === true) {
                                        __v.collectLi.addClass("collected");
                                    }
                                }
                            });
                        }
                    });
                }
            });
        } else {
            collectFn();
        }
    });

    //收藏
    function collectFn() {
        if (__v.collectLi.hasClass("collected")) {
            //取消
            fish.ajax({
                url: "/youlun/MemberFavoritesHandler.ashx?type=Delete&favoriteId=" + __v.lineId,
                openType: "get",
                type: "json",
                fn: function(data) {
                    if (!data) return false;
                    if (data.ResultFlag === true) {
                        __v.collectLi.removeClass("collected")
                    }
                }
            });
        } else {
            //收藏
            fish.ajax({
                url: "/youlun/MemberFavoritesHandler.ashx?type=Addnew&productId=" + __v.lineId,
                openType: "get",
                type: "json",
                fn: function(data) {
                    if (!data) return false;
                    if (data.ResultFlag === true) {
                        __v.collectLi.addClass("collected")
                    }
                }
            });
        }
    }
})()


/**
 * @file fish append insert 插件
 *
 * 允许向节点内前/后添加fish对象，保证事件的继承。
 * @code
 *    fish.one('.something').append('.otherthing');
 * @endcode
 *
 * @author 2997@17u.cn
 * @version 1.0  at 2013-6-28
 */
;
(function() {
    fish.extend({
        append: function(elem) {
            if (!this || !this.length || !elem || !elem.length) return this;
            this[0].appendChild(elem[0]);
            return this;
        }
    })

    fish.extend({
        insert: function(elem) {
            if (!this || !this.length || !elem || !elem.length) return this;

            var childnode = fish.dom(getChildNodes(fish.dom(this)));

            if (childnode.parentNode) {
                //insertBefore(newchild,refchild)  说明：newchild(插入的新结点) refchild(将新结点插入到此结点前)
                childnode.parentNode.insertBefore(elem[0], childnode);
            }
            //获取直接子元素，返回fish对象
            function getChildNodes(dom) {
                var nodes = [];
                for (var i = 0; i < dom.childNodes.length; i++) {
                    if (dom.childNodes[i].nodeType == 1) {
                        nodes.push(dom.childNodes[i]);
                    }
                }
                return fish.all(nodes);
            }
        }
    })
})();


function make_canael(obj) {
    var mcalurl = fish.one("#calendar_wrapper").attr("attr-url");
    fish.one(".calendar_wrapper").calendar({
        url: mcalurl + '&startdate={startdate}&enddate={enddate}&year={year}&month={month}',
        getMonthData: processData,
        getDayData: makeItem,
        click: function(data, year, month, day) {
            var lineid = fish.one("#HidLineid").val(),
                date = fish.one(this).attr("data-date"),
                openUrl = "/youlun/linebook/" + lineid + "_" + year + "-" + month + "-" + day + ".html";
            window.open(openUrl.addParams(obj));
        },
        clickable: function(data) {
            if (!data) {
                return false;
            } else {
                if (!data.price) {
                    return false;
                } // 无价格的，不可点击
                else if (parseInt(data.price, 10) == 0) {
                    return false;
                }
                return true;
            }
        }
    });
}

function processData(data) {
    var prices = [];
    for (var i = 1; i <= 31; i++) {
        prices.push({ price: 0, day: i, shipname: 0 });
    }
    var length = data.PriceList.length;
    for (var i = 0; i < length; i++) {
        var time = new Date(fish.parseDate(data.PriceList[i].date));
        var index = parseInt(time.getDate()) - 1; //索引在第几天传值 string 转 int
        prices[index].price = data.PriceList[i].price;
    }
    return prices;
}
// 创建、设置每个日期的格式
function makeItem(data) {
    var priceInfo = "";
    if (data && data.price) {
        if (parseInt(data.price, 10) != 0) {
            // 判断包船图标
            priceInfo = '<div class="mcalpricebox"><span class="Yday_price">&yen;<strong>' + parseInt(data.price) + '</strong></span>起</div>';
        }
    } else {
        priceInfo = "";
    }
    return priceInfo;
}

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
    return s + "";
};

//获取地址栏参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//json对象转化为fish的ajax所需的String格式
function stringFromJson(jsonObj) {
    var s = "";
    for (var i in jsonObj) {
        s += i + "=" + jsonObj[i] + "&";
    }
    return s.substring(0, s.length - 1);
}


/**
 * Created with JetBrains WebStorm.
 * User: ghy
 * Date: 15-3-23
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */
(function() {

    fish.admin.config({
        mScrollpane: { v: "0.1", css: "1", g: 2122 }
    })


    //  全局变量
    var __v = {};
    __v.rateOption = {}; //统计所需参数
    __v.cruiseId = fish.one("#HidCruiseId").val(); //船队ID
    __v.HidTransport = encodeURIComponent(fish.one("#HidTransport").val()); //途径港口
    var lineid = fish.one("#HidLineid").val();

    // <<<<<<<<<<<<<<<===   扩展start  ================
    fish.extend({
        block: function() {
            this.css("display:block;");
        },
        none: function() {
            this.css("display:none");
        }
    });
    //  =====================  扩展end   ======>>>>>>>>>>>>>>>>>>>>
    // <<<<<<<<<<============================== 事件绑定及委托部分 s    华丽的分割线   ===========================
    //  TopProductElem Click
    __v.usi = fish.cookie.get("us", "userid");
    fish.on("click", function(e) {
        var target = fish.getTarget(e);
        do {
            var cname = target.className;
            if (cname && cname.indexOf("enshrine") > -1) {
                var te = fish.one(target);
                if (te.hasClass("iscollect")) {
                    return;
                }
                if (__v.usi) {
                    collectLine(te.attr("attr-url"), "Addnew");
                } else {
                    fish.mLogin({
                        unReload: true,
                        loginSuccess: function() {
                            var newUrl = window.location.href;
                            window.location.href = newUrl + "?islogin=1";
                            collectLine(te.attr("attr-url"), "Addnew");
                        }
                    })
                }
                return;
            } else if (cname && cname.indexOf("top_proInfo") > -1) {
                return;
            }
        } while (target = target.parentNode);
    }, "#TopProductElem");
    //  TopProductElem Hover
    fish.on("mouseover", function(e) {
        var target = fish.getTarget(e);
        do {
            var cname = target.className;
            if (cname && cname.indexOf("up_price") > -1) { //  console.log("起价说明");
                __v.showC = true;
                var off = getOffset(target, 23, -8),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#upPriceInfo").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#upPriceInfo", target, ww);
                return;
            } else if (cname && cname.indexOf("up_baiti") > -1) { //  console.log("同程白条");
                __v.showC = true;
                var off = getOffset(target, 30, -227),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#upBitiaoInfo").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#upBitiaoInfo", target, ww);
                return;
            } else if (cname && cname.indexOf("tip_top") > -1) { //  console.log("分享返现");
                __v.showC = true;
                var off = getOffset(target, 23, -8),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#prizeRules").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#prizeRules", target, ww);
                return;
            } else if (cname && cname.indexOf("pre_t") > -1) { //  奖金规则
                __v.showC = true;
                var off = getOffset(target, 33, -8),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#prizeRules").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#prizeRules", target, ww);
                return;
            } else if (cname && cname.indexOf("usered") > -1) { //红包可用
                __v.showC = true;
                var off = getOffset(target, 33, -58),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#redpacket").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#redpacket", target, ww);
                return;
            } else if (cname && cname.indexOf("banked") > -1) { //银行优惠
                __v.showC = true;
                var off = getOffset(target, 33, -88),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#bankpacket").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#bankpacket", target, ww);
                return;
            } else if (cname && cname.indexOf("hot_train") > -1) { //火车票预订
                __v.showC = true;
                var off = getOffset(target, 33, 0),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#trainpacket").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#trainpacket", target, ww);
                return;
            } else if (cname && cname.indexOf("showsale") > -1) { //促销信息
                __v.showC = true;
                var off = getOffset(target, 33, 0),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#cuxiao").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#cuxiao", target, ww);
                return;
            } else if (cname && cname.indexOf("libao") > -1) { //礼包可用
                __v.showC = true;
                var off = getOffset(target, 33, -58),
                    ww = fish.one(window).width();
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules,#redpacket,#cuxiao,#libao,#write").none();
                fish.one("#libao").css("top:" + off.top + "px;left:" + off.left + "px;display:block;");
                cutOverstep("#libao", target, ww);
                return;
            } else if (cname && cname.indexOf("sale_active") > -1) { //优惠活动
                __v.showC = true;
                fish.all("#trainpacket,#bankpacket,#upBitiaoInfo,#upPriceInfo,#prizeRules").none();
                fish.all("#active span").css("font-size:12px;");
                fish.one("#active").css("top:" + (fish.one(".sale_active").offset().top - fish.one(".ul_list").offset().top + fish.one(".sale_active").height()) + "px;display:block;");
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
            if (cname && cname.indexOf("up_price") > -1) { //  console.log("起价说明");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#upPriceInfo").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("up_baiti") > -1) { //  console.log("同程白条");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#upBitiaoInfo").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("tip_top") > -1) { //  console.log("分享返现");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#prizeRules").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("pre_t") > -1) { //  console.log("奖金规则");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#prizeRules").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("usered") > -1) { //  console.log("红包可用");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#redpacket").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("banked") > -1) { //  console.log("银行优惠");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#bankpacket").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("hot_train") > -1) { //  console.log("火车票预订");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#trainpacket").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("showsale") > -1) { //  console.log("促销信息");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#cuxiao").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("libao") > -1) { //  console.log("礼包信息");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#libao").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("writeYouji") > -1) { //  console.log("写游记有奖");
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#write").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("sale_active") > -1) {
                __v.showC = false;
                setTimeout(function() {
                    if (!__v.showC) {
                        fish.one("#active").none();
                    }
                }, 100);
                return;
            } else if (cname && cname.indexOf("top_proInfo") > -1) {
                return;
            }
        } while (target = target.parentNode);
    }, ".content");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#upPriceInfo");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#upPriceInfo").none();
            }
        }, 100);
    }, "#upPriceInfo");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#upBitiaoInfo");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#upBitiaoInfo").none();
            }
        }, 100);
    }, "#upBitiaoInfo");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#prizeRules");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#prizeRules").none();
            }
        }, 100);
    }, "#prizeRules");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#redpacket");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#redpacket").none();
            }
        }, 100);
    }, "#redpacket");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#bankpacket");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#bankpacket").none();
            }
        }, 100);
    }, "#bankpacket");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#trainpacket");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#trainpacket").none();
            }
        }, 100);
    }, "#trainpacket");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#cuxiao");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#cuxiao").none();
            }
        }, 100);
    }, "#cuxiao");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#libao");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#libao").none();
            }
        }, 100);
    }, "#libao");
    fish.on("mouseover", function() {
        __v.showC = true
    }, "#write");
    fish.on("mouseout", function() {
        __v.showC = false;
        setTimeout(function() {
            if (!__v.showC) {
                fish.one("#write").none();
            }
        }, 100);
    }, "#write");
    fish.on("mouseover", function(e) {
        var target = fish.getTarget(e),
            off = getOffset(target, 80, -5),
            src = fish.one(target).attr("src");
        fish.all(".reviews_main li").removeClass("on");
        fish.one(this).parent().addClass("on");
        fish.one(".reviews_img").css("top:" + off.top + "px;left:" + off.left + "px;display:block;").html("<img src='" + src + "'/>");
    }, ".reviews_main .rev_img li img");
    fish.on("mouseout", function() {
        fish.all(".reviews_main li").removeClass("on");
        fish.one(".reviews_img").css("display:none;");
    }, ".reviews_main .rev_img li img");
    fish.all(".reviews_main dl ul").on("mouseover", function() {
        var length = fish.all("li.good", this).length,
            that = fish.one(this);
        fish.one(".star_con").html(length + "分,很满意</div>");
        fish.one(".star").css("top:" + (that.offset().top + that.height()) + "px;left:" + that.offset().left + "px;display:block;");
    }).on("mouseout", function() {
        fish.one(".star").css("display:none;");
    });
    fish.on("click", function(e) {
        var target = fish.getTarget(e);
        do {
            var cname = target.className;
            if (cname && cname.indexOf("reviewInput") > -1) { //  选择点评
                setTimeout(function() {
                    updateRecommandCont();
                }, 10);
                winScrollFn(10);
                return;
            } else if (cname && cname.indexOf("paixu") > -1) { //排序
                fish.all(".review_select span").removeClass("at");
                fish.one(target).addClass("at");
                setTimeout(function() {
                    updateRecommandCont();
                }, 10);
                winScrollFn(10);
                return;
            } else if (cname && cname.indexOf("link_quick") > -1) { //  快速提交
                fish.one(".linkName").val("请问如何称呼您").css("color:#999");
                fish.one(".linkPhone").val("请问如何联系您").css("color:#999");
                fish.all("#needElem .place_l").removeClass("place_at");
                fish.mPop({
                    content: fish.dom("#needElem"),
                    width: 636
                });
                return;
            } else if (cname && cname.indexOf("look") > -1) {
                window.scrollTo(0, fish.one(".calbox").offset().top - fish.one(".intr_tit").height());
            } else if (cname && cname.indexOf("top_proInfo") > -1) {
                return;
            }
        } while (target = target.parentNode);
    }, "body");

    //预订说明,高度大于100隐藏
    fish.all(".description_con p").css("font-family:'microsoft yahei';background:none;");
    fish.all(".con_height").each(function() {
        var elem = fish.one(this);
        if (elem.height() > 104) {
            var pre = elem.parent(".description"),
                child = fish.one(".c_btu", pre);
            child.removeClass("none");
            elem.css("height:100px; overflow:hidden");
        }
    });
    //默认显示签证和预订，其他超出100px隐藏
    fish.all(".c_btu span").on("click", function() {
        var elem = fish.one(this),
            parents = elem.parent(".description"),
            show = fish.one(".con_height", parents);
        show.css("height:auto;");
        var height = show.height();
        show.css("height:104px;");

        if (!elem.hasClass("ctrl_open")) {
            //  收起
            elem.addClass("ctrl_open").html("展开");
            show.anim("height: 104px;", 2000);
            var nHeight = show.height();
            window.scrollTo(0, show.offset().top - nHeight);
        } else {
            //  展开
            elem.removeClass("ctrl_open").html("收起");
            show.anim("height:" + height + "px;", 500);
        }
    });
    //终页的行前准备和预定条款修改成默认展开
    initOpen();

    function initOpen() {
        if (fish.all(".c_btu span")[1]) {
            fish.all(".c_btu span")[1].click();
        }
        if (fish.all(".c_btu span")[2]) {
            fish.all(".c_btu span")[2].click();
        }
    }

    fish.all(".visa li").each(function(elem, i) {
        var that = fish.one(this);
        that.on("click", function() {
            fish.all(".visa li").removeClass("on");
            that.addClass("on");
            fish.all(".visa_area").addClass("none");
            fish.one(fish.all(".visa_area")[i]).removeClass("none");
        })
    })

    fish.all(".visa_con_tab").each(function() {
        var tath = fish.one(this),
            parent = tath.parent(".visa_area");
        fish.all("a", tath).each(function(elem, i) {
            fish.one(elem).on("click", function() {
                fish.all("a", tath).removeClass("on");
                fish.one(elem).addClass("on");
                fish.all(".tab_table", parent).addClass("none");
                fish.one(fish.all(".tab_table", parent)[i]).removeClass("none");
            })
        })
    })

    fish.all(".description_tab li").each(function(elem, i) {
        var that = fish.one(this);
        that.on("click", function() {
            fish.all(".description_tab li").removeClass("at");
            that.addClass("at");
            fish.all(".description_con").addClass("none");
            fish.one(fish.all(".description_con")[i]).removeClass("none");
            window.scrollTo(0, fish.one(fish.dom(".description_con").parentNode.parentNode).offset().top - 36);
        })
    })

    // 如何预订
    function predictAdress() {
        var store = fish.all("#storeInfo .list_store li"),
            storeList = fish.all(".adress .adress_list"),
            atId = fish.one("#HidId").val(),
            isHas = false;

        store.each(function() {
            var dom = fish.one(this);
            if (atId == dom.attr("province-id")) {
                store.removeClass("active");
                dom.addClass("active");
                isHas = true;
            };
        }).on("click", function() {

            var _this = fish.one(this),
                provinceId = _this.attr("province-id");
            //  li 显示
            store.removeClass("active");
            _this.addClass("active");
            //  对应div显示
            storeList.each(function() {
                var dom = fish.one(this);
                if (provinceId == dom.attr("province-id")) {
                    storeList.addClass("none");
                    dom.removeClass("none");
                };
            });
        });
        if (!isHas) {
            //  定位上海
            store.each(function() {
                var dom = fish.one(this);
                if (dom.attr("province-id") == 25) {
                    store.removeClass("active");
                    dom.addClass("active");
                };
                storeList.each(function() {
                    var dom = fish.one(this);
                    if (dom.attr("province-id") == 25) {
                        storeList.addClass("none");
                        dom.removeClass("none");
                    };
                });
            });
        };
    }

    predictAdress();
    //侧边微信扫描
    fish.one(".weix_share").on("mouseover", function() {
        fish.one(".weix_share .wx_tip").removeClass("none");
    }).on("mouseout", function() {
        fish.one(".weix_share .wx_tip").addClass("none");
    });

    //滚动事件
    __v.itinerary = true;
    __v.commonFlag = true;
    __v.travels = true;

    function scrollPage() {
        window.onscroll = function() {
            var scroll = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop, //  滚动条高度
                fixElem = fish.one(".intr_tit"), //节点
                top = fixElem.offset().top; //   nav 节点top
            if (scroll > top) {
                fish.one(".f_tit").css({ "position": "fixed", "top": 0, "z-index": 11 });
                fish.one(".fix_order").removeClass("none");
            } else {
                fish.one(".f_tit").css({ "position": "" });
                fish.one(".fix_order").addClass("none");
            }
            //回到顶部
            if (fish.one(window).scrollTop() > 50) {
                fish.one(".top_link").removeClass("none");
            } else {
                fish.one(".top_link").addClass("none");
            }
            __v.windowHeight = window.screen.availHeight;

            if (scroll >= fish.one("#itinerary").offset().top + 20 - __v.windowHeight && __v.itinerary) { //行程信息
                __v.itinerary = false;
                //itinerary();
            }
            if (scroll >= fish.one("#visitorsCommElem").offset().top + 20 - __v.windowHeight && __v.commonFlag) { //点评
                __v.commonFlag = false;
                url = "/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=5&tagId=1&dpCruiseId=" + __v.cruiseId + "&SortType=0";
                commonAjaxFn(url);
            }
            if (scroll >= fish.one(".tra_main").offset().top + 110 - __v.windowHeight && __v.travels) { //游记
                __v.travels = false;
                travels();
            }
            fish.all(".detail_con").each(function(elem, i) {
                var top = fish.one(elem).offset().top,
                    height = fish.one(".intr_tit").height(),
                    marginTop = isNaN(parseInt(fish.all(".detail_con").getCss("margin-top"))) ? parseInt(fish.one(".detail_con").getCss("marginTop")) : parseInt(fish.all(".detail_con").getCss("margin-top"));
                if (scroll > (top - height - marginTop)) {
                    fish.all(".f_tit li").removeClass("at");
                    fish.one(fish.all(".f_tit li")[i]).addClass("at");
                }
            });

            var dayList = fish.one(".dayList"),
                dayListTop = dayList.offset().top, //行程天数
                dayListHeight = fish.one("#dayList").height(),
                routeDetailHeight = fish.one(".dayCon").height(),
                day_list = fish.all(".dayList_nav li").length, //总天数
                num1 = parseInt(day_list / 8, 10), //取整数
                num2 = day_list % 8, //取余数
                maxTtop = ((num1 - 1) * 8 + num2) * 35; //最大滚动距离
            fish.one(".dayList").css("height:" + routeDetailHeight + "px;");
            if (scroll >= dayListTop - 60 && scroll < dayListTop + routeDetailHeight - dayListHeight - 60) { //行程天数浮动
                fish.one("#dayList").css({ "position": "fixed", "top": "60px", "bottom": "", "z-index": 10 })
            } else if (scroll > dayListTop + routeDetailHeight - dayListHeight - 60) {
                fish.one("#dayList").css({ "position": "absolute", "top": "", "bottom": 0, "z-index": 10 })
            } else {
                fish.one("#dayList").css({ "position": "", "top": 0, "bottom": "", "z-index": 10 })
            }

            //行程天数内天数随屏幕滚动
            fish.all(".travel_day").each(function(elem, i) {
                var travel_dayTop = fish.one(elem).offset().top;
                if (scroll >= travel_dayTop - 60) {
                    fish.all(".dayList_nav ul li").removeClass("on");
                    fish.one(fish.all(".dayList_nav ul li")[i]).addClass("on");
                    var sliderTop = i * 35;
                    if (sliderTop == 0) {
                        fish.one(".up").removeClass("act");
                        fish.one(".down").addClass("act");
                    } else if (0 < sliderTop && sliderTop < maxTtop) {
                        fish.all(".up,.down").addClass("act");
                    } else {
                        sliderTop = maxTtop;
                        fish.one(".up").addClass("act");
                        fish.one(".down").removeClass("act");
                    }
                    if (!fish.all(".dayListArrow").hasClass("none")) {
                        fish.one(".dayList_nav ul").anim("top:-" + sliderTop + "px;", 500);
                    }
                }
            })
            if (scroll < dayListTop) {
                fish.all(".dayList_nav ul li").removeClass("on");
                fish.one(fish.all(".dayList_nav ul li")[0]).addClass("on");
            }
            DTFSBFn();
        }
        fish.all(".f_tit li").each(function(elem, i) {
            fish.one(elem).on("click", function() {
                if (i == 5 && fish.one(fish.all(".detail_con")[i]).offset().top == 0) {
                    i = 4;
                }
                var top = fish.one(fish.all(".detail_con")[i]).offset().top,
                    height = fish.one(".intr_tit").height(),
                    marginTop = isNaN(parseInt(fish.all(".detail_con").getCss("margin-top"))) ? parseInt(fish.one(".detail_con").getCss("marginTop")) : parseInt(fish.all(".detail_con").getCss("margin-top"));
                window.scrollTo(0, top - height - marginTop + 1);
            });
        });
        fish.one("#linkTravel").on("click", function() {
            var top = fish.one("#itinerary").offset().top,
                height = fish.one(".intr_tit").height(),
                marginTop = isNaN(parseInt(fish.all(".detail_con").getCss("margin-top"))) ? parseInt(fish.one(".detail_con").getCss("marginTop")) : parseInt(fish.all(".detail_con").getCss("margin-top"));
            window.scrollTo(0, top - height - marginTop + 1);
        });

    }

    function DTFSBFn() { //预订须知跟随滚动条事件--descriptionTabFollowScrollBarFn
        var $window = fish.one(window),
            $elemBox = fish.one(".description"),
            $elem = fish.one(".description_tab", $elemBox),
            $navBar = fish.one(".f_tit");
        DTFSBFn = function() {
            var ST = $window.scrollTop(),
                BT = $elemBox.offset().top,
                bHei = $navBar.height(),
                BPT = BT + $elemBox.height() - $elem.height();
            if (ST >= BT - bHei) {
                if (ST >= BPT - bHei) {
                    $elem.css("top:" + (BPT - BT > 0 ? BPT - BT : 0) + "px;");
                } else {
                    $elem.css("top:" + (ST - BT + bHei + 10) + "px;");
                }
            } else {
                $elem.css("top:0px;");
            }
        };
        DTFSBFn();
    }


    fish.one("#Transport").on("click", function() {
        var top = fish.one(fish.all(".detail_con")[parseInt((fish.one(this).attr("_num")), 10)]).offset().top,
            height = fish.one(".intr_tit").height(),
            marginTop = isNaN(parseInt(fish.all(".detail_con").getCss("margin-top"))) ? parseInt(fish.one(".detail_con").getCss("marginTop")) : parseInt(fish.all(".detail_con").getCss("margin-top"));
        window.scrollTo(0, top - height - marginTop + 1);
    });

    //email打印弹框20150104byzl
    fish.all('.cancelBt,.againBt').on('click', function() {
        fish.mPop.close();
        fish.one('.fail_tips').addClass('none');
        fish.one('.email_form').removeClass('none');
    });
    fish.one('.saveBt').on('click', function() {
        checkOfemailprint();
        if (fish.one(this).hasClass('busy')) {
            return;
        }
        if (fish.one('#uname').hasClass('err_input') || fish.one('#uemail').hasClass('err_input')) {
            return;
        } else {
            var ajaxUrl = fish.one('.email_pbt').attr('a-url') + "&email=" + fish.one('#uemail').val() + "&startTime=" + fish.one("#oneCal").val() + "&addDays=" + fish.one("#hidDays").val();
            fish.ajax({
                url: ajaxUrl, // 提交地址
                openType: "post", // 提交懂得格式
                type: "string", // 返回的数据格式
                fn: function(data) {
                    fish.one('.saveBt').removeClass('busy');
                    if (data) {
                        fish.mPop.close();
                    } else {
                        fish.one('.fail_tips').removeClass('none');
                        fish.one('.email_form').addClass('none');
                    }
                }
            });

        }
    });

    //打印行程点击事件
    //"&startTime=" + fish.one("#oneCal").val() + "&addDays=" + fish.one("#hidDays").val();
    //fish.one('.content').delegate('.email_pbt', 'click',
    fish.one('.content').delegate('.print_link', 'click', function(evt) {
        var that = fish.getTarget(evt),
            sHref = fish.one(that).attr("_href") + "&startTime=" + fish.one("#oneCal").val() + "&addDays=" + fish.one("#hidDays").val();
        window.open(sHref);
    });

    function checkOfemailprint() {
        var flag = false;
        if (fish.one('#uname').hasClass('err_input') || fish.one('#uemail').hasClass('err_input')) {
            flag = true;
        }
        var namev = fish.trim(fish.one('#uname').val()),
            emailv = fish.trim(fish.one('#uemail').val());
        var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (namev == '') {
            fish.one('#uname').addClass('err_input').html('after', '<span><em></em>请输入姓名</span>');
            flag = true;
        }
        if (namev != '' && !isName(namev)) {
            fish.one('#uname').addClass('err_input').html('after', '<span><em></em>姓名格式错误</span>');
            flag = true;
        }
        if (emailv == '') {
            fish.one('#uemail').addClass('err_input').html('after', '<span><em></em>请输入Email</span>');
            flag = true;
        }
        if (emailv != '' && !mailReg.test(emailv)) {
            fish.one('#uemail').addClass('err_input').html('after', '<span><em></em>邮箱格式错误</span>');
            flag = true;
        }
        if (flag) {
            fish.one(".saveBt").addClass('busy')
        } else {
            fish.one(".saveBt").removeClass('busy')
        }
    }

    fish.all('#uname,#uemail').on('focus', function() {
        fish.one(this).removeClass('err_input').next().html('remove');
    });
    /*姓名验证*/
    function isName(str) {
        var regex = /^[a-zA-Z\s\u4e00-\u9fa5]+$/

        // 英文合格
        if (/^[a-zA-Z\s]+$/.test(str)) {
            return true;
        }

        // 中文、大于1个汉字合格。
        if (/^[\u4e00-\u9fa5]+$/.test(str) && str.length > 1) {
            return true;
        }

        // 其他不合格
        return false;
    }

    //点击展开行程
    fish.one('.content').delegate('.email_pbt', 'click', function() {
        fish.all('#uname,#uemail').val('').removeClass('err_input').next().html('remove');
        fish.one('.email_form').removeClass('none');
        fish.one('.fail_tips').addClass('none');
        fish.mPop({
            title: "&nbsp;",
            content: fish.one(".email_pop"),
            dragable: false,
            width: 405
        });
    });

    //在线客服
    fish.one(".top_link").on("click", function() {
        window.scrollTo(0, 0);
    });




    //<<<<<<<<<<<<<<<<<<===============   通用方法 s   华丽的分割线  ============================
    //PV统计
    function rate() {
        var k = GetQueryString("Key"); //统计的Key值
        var s = GetQueryString("SearchCondition"); //线路统计（搜索页过来）所需的查询条件
        var l = GetQueryString("lid"); //lid
        var option = {
            "PageType": "DetailPage",
            "Userid": (typeof getMemberId === "undefined") ? 0 : getMemberId(),
            "Url": encodeURIComponent(location.href),
            "v": new Date().getTime()
        };
        if (k) {
            //有Key值，直接统计
            option.Key = __v.rateOption.Key = k;
            if (s) {
                option.SearchCondition = __v.rateOption.SearchCondition = s;
            }
            postRate(option);
            bindBtnKey();
        } else {
            //重新生成Key
            var obj = {} //生成Key所需参数
            obj.LineIds = fish.one('#HidLineid').val();
            if (l) {
                obj.Lid = GetQueryString("lid");
            }
            fish.ajax({
                url: "/youlun/AjaxCall_Cruise.aspx?Type=GenerateSpecialStatisticKey",
                openType: "post",
                data: stringFromJson(obj),
                type: "json",
                fn: function(data) {
                    //Key值正常返回，直接赋值并统计
                    if (data && data.length && data[0].Key) {
                        __v.rateOption.Key = option.Key = data[0].Key;
                        if (s) {
                            __v.rateOption.SearchCondition = option.SearchCondition = s;
                        }
                        postRate(option);
                        bindBtnKey();
                    }
                    //直接传LineId
                    else {
                        if (obj.LineIds) {
                            option.LineId = obj.LineIds;
                        }
                        if (obj.Lid) {
                            option.Lid = obj.Lid;
                        }
                        postRate(option);
                    }
                },
                err: function() {
                    if (obj.LineIds) {
                        option.LineId = obj.LineIds;
                    }
                    if (obj.Lid) {
                        option.Lid = obj.Lid;
                    }
                    postRate(option);
                }
            });
        }

        function postRate(o) {
            fish.ajax({
                url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseSpecialStatistic",
                openType: "post",
                data: stringFromJson(o),
                fn: function() {}
            });
        }
    }

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

    //  收藏航线
    function collectLine(url, type) {
        fish.ajax({
            url: url,
            data: "type=" + type,
            type: "json",
            fn: function(data) {
                if (data) {
                    if (data.ResultFlag === true || data.ResultMsg === "加入收藏夹") {
                        fish.one("#collectLine").attr("title", "可在“我的同程”查看和取消当前收藏").addClass("iscollect").html("已收藏");
                    } else {
                        fish.one("#collectLine").attr("title", "收藏该航线").removeClass("iscollect").html("收藏");
                    }
                }
            }
        });
    }

    //获取咨询热线
    function getPhone() {
        var url = "http://www.ly.com/AjaxHelper/TopLoginHandler.aspx?channel=YouLun&action=getTelephone",
            refid = getRefid();
        fish.ajax({
            url: url,
            data: "&asyncRefid=" + refid,
            type: "jsonp",
            fn: function(data) {
                var phone = data.telephone;
                // fish.all(".hot_line span,.zx_rx span").html(phone + "转7");
                fish.all(".hot_line span,.zx_rx span").html(phone);
            },
            err: function() {
                //fish.all(".hot_line span,.zx_rx span").html("4007-740-075");
                fish.all(".hot_line span,.zx_rx span").html("4007-740-075");
            }
        })
    }

    getPhone();


    //大小图片幻灯
    function slider(bigul, smallul, prev, next, left) {
        function Getid(s) {
            return document.getElementById(s);
        }

        function getStyle(obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return getComputedStyle(obj, false)[attr];
            }
        }

        function Animate(obj, json) {
            if (obj.timer) {
                clearInterval(obj.timer);
            }
            obj.timer = setInterval(function() {
                for (var attr in json) {
                    var iCur = parseInt(getStyle(obj, attr));
                    iCur = iCur ? iCur : 0;
                    var iSpeed = (json[attr] - iCur) / 3;
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                    obj.style[attr] = iCur + iSpeed + 'px';
                    if (iCur == json[attr]) {
                        clearInterval(obj.timer);
                    }
                }
            }, 30);
        }

        var oPic = Getid(bigul);
        var oList = Getid(smallul);

        var oPrev = Getid(prev);
        var oNext = Getid(next);

        var oPicLi = oPic.getElementsByTagName("li");

        var oListLi = oList.getElementsByTagName("li");
        var len1 = oPicLi.length;
        var len2 = oListLi.length;

        var oPicUl = oPic.getElementsByTagName("ul")[0];
        var oListUl = oList.getElementsByTagName("ul")[0];
        var w1 = oPicLi[0].offsetWidth;
        var w2 = oListLi[0].offsetWidth;
        w2 += left;
        oPicUl.style.width = w1 * len1 + "px";
        oListUl.style.width = w2 * len2 + "px";

        var index = 0;
        var num = 4;
        var num2 = Math.ceil(num / 3);

        // 添加自动播放
        function Change() {
            Animate(oPicUl, { left: -index * w1 });

            if (len2 > 3) {
                if (index < num2) {
                    Animate(oListUl, { left: 0 });
                } else if (index + num2 < len2) {
                    Animate(oListUl, { left: -(index - num2) * w2 });
                } else {
                    Animate(oListUl, { left: -(len2 - num) * w2 });
                }
            }


            for (var i = 0; i < len2; i++) {
                oListLi[i].className = "";
                if (i == index) {
                    oListLi[i].className = "current";
                }
            }
        }

        oNext.onclick = oNext.onclick = function() {
            index++;
            index = index == len2 ? 0 : index;
            Change();
        };
        oPrev.onclick = oPrev.onclick = function() {
            index--;
            index = index == -1 ? len2 - 1 : index;
            Change();
        };

        for (var i = 0; i < len2; i++) {
            oListLi[i].index = i;
            oListLi[i].onclick = function() {
                index = this.index;
                Change();
            };
            if (i < len2) {

            }
        }

        function goslider() {
            newtime = setInterval(function() {
                oListLi[index].index = index;
                oListLi[index].onclick = function() {
                    index = this.index;
                    Change();
                };
                oListLi[index].click();
                index++;
                if (index == len2) {
                    index = 0;
                }
            }, 3000);
        }

        oListLi[0].click();
        goslider();

        function stopslider(elem) {
            fish.one(elem).on("mouseover", function() {
                clearInterval(newtime);
            });
            fish.one(elem).hover(
                function() {
                    clearInterval(newtime);
                },
                function() {
                    goslider();
                }
            );
        }

        stopslider(oPic);
        stopslider(oList);
        stopslider(oPrev);
        stopslider(oNext);
    }

    //优惠说明
    function SpecialNote() {
        var elem = fish.one(".yhsm"),
            note_right = fish.one(".note_right", elem),
            note = fish.one(".note div", elem),
            note_more = fish.one(".note_more", elem);
        note.height() > 52 ? note_more.removeClass("none") : note_more.addClass("none");
        note_right.hover(function() {
            elem.addClass("note_active");
        }, function() {
            elem.removeClass("note_active");
        });
    }


    //  分享模块start
    var share = function(param) {
        var content = fish.all(param.elem),
            that = this,
            url, title, summary, wxurl, pic;
        title = param.title ? param.title : document.title + "@同程旅游";
        url = param.url ? param.url : document.location.href;
        summary = param.summary ? param.summary : "";
        wxurl = param.wxurl ? param.wxurl : document.location.href;
        pic = param.pic ? param.pic : "";
        fish.all("a", content).on("click", function() {
            var sType = this.getAttribute("share-data");
            ShareOpen[sType](url, title, summary, pic, wxurl);
        });
    };
    var ShareOpen = {
        sina: function(url, title, summary, pic, wxurl) {
            openShareUrl('http://v.t.sina.com.cn/share/share.php?', url, title, summary, pic, wxurl);
        },
        weixin: function(url, title, summary, pic, wxurl) {
            recGetScript("http://js.40017.cn/cn/min/??/cn/c/c/qrcode.js",
                function() {
                    if (!fish.dom(".tc_show_wx_w2m")) {
                        var div = document.createElement("div");
                        div.className = 'tc_show_wx_w2m';
                        div.innerHTML = '<p class="tc_weixin_pop_head"><span>分享到微信朋友圈</span><a class="tc_weixin_pop_close">×</a></p>' +
                            '<div class="qr_con"></div>' +
                            '<div class="tc_weixin_pop_foot">打开微信，点击“发现”，<br>使用“扫一扫”即可将网页分享至朋友圈。</div>';
                        document.body.appendChild(div);
                        fish.one(".tc_show_wx_w2m .tc_weixin_pop_close").on("click", function() {
                            fish.mPop.close();
                        });
                        fish.mPop({
                            content: fish.one(".tc_show_wx_w2m"),
                            width: 274,
                            height: 320,
                            afterOpen: function() {
                                var qrcode = new QRCode(fish.dom(".tc_show_wx_w2m .qr_con"), {
                                    width: 200,
                                    height: 200
                                });
                                qrcode.makeCode(wxurl)
                            }
                        });
                    } else {
                        fish.mPop({
                            content: fish.one(".tc_show_wx_w2m"),
                            width: 274,
                            height: 320
                        });
                    }
                }, true);
        },
        qzone: function(url, title, summary, pic) {
            openShareUrl('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', url, title, summary, pic);
        }
    };

    function openShareUrl(surl, url, title, summary, pic) {
        var e = encodeURIComponent;
        var f = surl;
        u = url,
            p = ['url=', e(u), '&title=', e(title), '&summary=', summary, '&pic=', e(pic)].join('');

        function a() {
            if (!window.open([f, p].join(''), 'mb', ['toolbar=0,status=0,resizable=1,width=620,height=450,left=', (screen.width -
                    620) / 2, ',top=', (screen.height - 450) / 2].join(''))) u.href = [f, p].join('');
        }

        if (/Firefox/.test(navigator.userAgent)) {
            setTimeout(a, 0);
        } else {
            a();
        }
    }

    function recGetScript(url, callback, realTime) {
        var allScript = fish.all("script");
        for (var i = 0, len = allScript.length; i < len; i++) {
            if (allScript[i].src.indexOf(url) >= 0) {
                if (typeof callback === "function") {
                    callback();
                }
                return allScript[i];
            }
        }
        var requestId = Math.floor(Math.random() * 1000000000000),
            script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        if (typeof callback === "function") {
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    script.onload = script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            realTime = callback;
        }
        script.src = url + (realTime ? ("?v=" + (requestId++)) : "");
        document.getElementsByTagName("script")[0].parentNode.appendChild(script);
        return script;
    }

    //  分享模块end

    //  快速下单验证
    function checkedInfoFn() {
        var lineT = true,
            nameT = true,
            phoneT = true;
        //  是否选择心愿航线
        var line = fish.all("#needElem .place_l"),
            atNum = 0;
        for (var n = 0, m = line.length; n < m; n++) {
            var thEle = fish.one(line[n]);
            if (thEle.hasClass("place_at")) {
                atNum++;
                __v.lineId = thEle.attr("_pId");
            }
        }
        if (atNum > 0) {
            fish.one("#needElem .errLine").css("display:none");
            lineT = true;
        } else {
            fish.one("#needElem .errLine").css("display:block");
            lineT = false;
        }

        //  姓名非空
        var lName = fish.trim(fish.one("#needElem .linkName").val());
        if (!lName || lName == "请问如何称呼您") {
            fish.one("#needElem .errName").css("display:block");
            nameT = false;
        } else {
            fish.one("#needElem .errName").css("display:none");
            nameT = true;
        }
        //  手机号验证
        var lPhone = fish.trim(fish.one("#needElem .linkPhone").val());
        if (!lPhone || lPhone == "请问如何联系您") {
            fish.one("#needElem .errPhone .tip_txt").html("请输入手机号码");
            fish.one("#needElem .errPhone").css("display:block");
            phoneT = false;
        } else if (!fish.valida.phone(lPhone)) {
            fish.one("#needElem .errPhone .tip_txt").html("请输入正确的手机号码");
            fish.one("#needElem .errPhone").css("display:block");
            phoneT = false;
        } else {
            fish.one("#needElem .errPhone").css("display:none");
            phoneT = true;
        }
        if (lineT & nameT & phoneT) {
            return true;
        } else {
            return false;
        }
    }

    //  分页异步
    fish.admin.config({ mPage: { v: '0.5.6', g: 2016022501, css: 1 } });
    fish.admin.config({ mLogin: { v: '2.0', css: 1, g: 2012112073101 } });
    var ele = fish.one("#visitorsCommElem"),
        url = ele.attr("attr-url");

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
            //	pageNO: "page",//页码的请求参数名,
            callback: function(data) {
                if (!data || !data.CountInfo) {
                    return;
                }

                var data1 = data.CountInfo,
                    data2 = data.CommentInfos;
                if ((!data2 || data2.length < 1) && fish.one(".satisfaction_wrap").html().length < 1) {
                    fish.one("#visitorsCommElem").html("remove");
                    fish.all(".f_tit li").each(function(elem) {
                        var id = fish.one(elem).attr("attr-id");
                        if (id == 5) {
                            fish.one(elem).html("remove");
                        }
                    });
                    scrollPage();
                    return;
                }
                var temp1 = '<div class="rates">\
                                <strong>{{=it[0].Satisfaction}}%</strong><span>满意度</span>\
                             </div>\
                             <div class="rates_list">\
                                <div class="line_dp clearfix">\
                                    <span class="r_position">好评率</span>\
                                    <div class="rates_box r_position">\
                                        <span class="pray_bg"><span class="yellow_bg" style="width: {{=it[0].GoodFaction}}%;"></span></span></span>\
                                </div>\
                                <span class="r_num r_position">{{=it[0].GoodFaction}}%</span>\
                                </div>\
                                <div class="line_dp clearfix">\
                                    <span class="r_position">中评率</span>\
                                    <div class="rates_box r_position">\
                                        <span class="pray_bg"><span class="yellow_bg" style="width: {{=it[0].ModeFaction}}%;"></span></span>\
                                    </div>\
                                    <span class="r_num r_position">{{=it[0].ModeFaction}}%</span>\
                                </div>\
                                <div class="line_dp bad_line_dp clearfix">\
                                    <span class="r_position">差评率</span>\
                                    <div class="rates_box r_position">\
                                        <span class="pray_bg"><span class="yellow_bg" style="width: {{=it[0].BadFation}}%;"></span></span>\
                                    </div>\
                                    <span class="r_num r_position">{{=it[0].BadFation}}%</span>\
                                </div>\
                             </div>\
                            <div class="scores">\
                                <strong class="s_num"><span class="s_text1">{{=it[0].ServiceScore > 0 ? it[0].CompositeScore : Math.round(((it[0].DinnerScore+it[0].PlayScore+it[0].TravelScore+5)/4)*100)/100}}</span>分</strong><span class="s_text2">综合得分</span>\
                            </div>\
                            <div class="scores_litem">\
                                <div class="s_list4">餐饮住宿<span>{{=it[0].DinnerScore}}</span></div>\
                                <div class="s_list4">娱乐活动<span>{{=it[0].PlayScore}}</span></div>\
                                <div class="s_list4">岸上观光<span>{{=it[0].TravelScore}}</span></div>\
                                <div class="s_list4">同程服务<span>{{=it[0].ServiceScore <= 0 ? 5.0 : it[0].ServiceScore}}</span></div>\
                            </div>\
                            <div class="rules">\
                                <p>您可对已购订单立刻发表点评</p>\
                                <a class="dp_link" href="http://member.ly.com/orderlist.aspx">立即点评</a>\
                                <span class="pre_t present_tip"><span></span>点评奖金规则</span>\
                            </div>',
                    temp2 = '<label for="reviewInt1" class="lab_sty"><input type="radio" id="reviewInt1" name="reviewType" checked="checked" class="reviewInput" attr-total="{{=it[0].all}}" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=5&tagId=1">所有点评({{=it[0].All}})</label>\
                               <label for="reviewInt2" class="lab_sty"><input type="radio" id="reviewInt2" name="reviewType" class="reviewInput" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=5&tagId=2">好评({{=it[0].Good}})</label>\
                               <label for="reviewInt3" class="lab_sty"><input type="radio" id="reviewInt3" name="reviewType" class="reviewInput" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=5&tagId=3">中评({{=it[0].Moderate}})</label>\
                               <label for="reviewInt4" class="lab_sty"><input type="radio" id="reviewInt4" name="reviewType" class="reviewInput" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=5&tagId=4">差评({{=it[0].Negative}})</label>\
                               <label for="reviewInt5" class="lab_sty"><input type="radio" id="reviewInt5" name="reviewType" class="reviewInput" sttr-url="/youlun/dsfgw/dsf/gw/exec?basename=FvBZ8ovxctQvyzrdTcPWJzw5xC6m5KaEJibOLXiAGdmzbMe0VqcjZ7XDwHMkJeiS&method=GetCommentList&version=Y2FiHRQP4cpDM_k0nC3icg==&pageSize=5&tagId=5">有图({{=it[0].Photo}})</label>\
                               <div class="review_select">\
                                    <span class="paixu at" attr-type="0">默认排序</span><span class="paixu" attr-type="1">最有价值 ↑</span><span class="paixu" attr-type="3">时间排序 ↑</span>\
                                </div>',
                    temp3 = '{{for(var n = 0,m = it.length;n < m; n++){ }}\
                              <div class="review_lists clearfix">\
                                  {{? it[n].IsElite == "1"}}<span class="essence_reviews"></span>{{?}}\
                                  <div class="author">\
                                      {{? it[n].UserAvatar == ""}}<span class="rev_tip user_0{{=it[n].Level + 1}}"></span>{{??}}<span class="rev_tip user_0{{=it[n].Level + 1}}"></span>{{?}}\
                                      <p class="">{{=it[n].NickName}}</p>\
                                      <img src="http://js.40017.cn/cn/public/module/memberLevel/0.4/lev{{=it[n].Level + 1}}.gif" class="rev_lev">\
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
                    fish.one(".dp_list").html(fish.template(temp3, data2));
                }


                //分页模块显示隐藏
                if (fish.one("#ctrlPager").html().length > 0 || (!data2)) {
                    fish.one("#ctrlPager").removeClass("none");
                } else {
                    fish.one("#ctrlPager").addClass("none");
                }

                scrollPage();


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
        fish.all("#visitorsCommElem .dp_tab input").each(function() {
            if (fish.dom(this).checked) {
                var _curl = fish.one(this).attr("sttr-url");
                _curl += "&dpCruiseId=" + __v.cruiseId + "&SortType=" + typeid;
                // _curl += "&lineId=" + lineid + "&cruiseId=" + __v.cruiseId + "&transport=" + __v.HidTransport + "&typeid=" + typeid;
                fish.mPop({
                    content: fish.one("#popOut #inline_example_load"),
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
                    content: fish.one("#popOut .photo-album"),
                    afterOpen: function() {
                        var totalage = Math.ceil(length / 4);
                        if (length < 5) {
                            fish.all(".pa-l,.pa-r").html("remove");
                        }
                        fish.one(".photo-list").css("width:" + (length * 184) + "px;");
                        fish.one(".photo-album .popName").html(fish.one("#HidShipName").val());
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
                        fish.one(".pa-r").on("click", function() { //点击右左滑
                            var page = parseInt(fish.one(".photo-list").attr("page"), 10);
                            if (page == totalage) return;
                            fish.one(".photo-list").anim("left:" + -(page * 736) + "px;", 100);
                            page = page + 1;
                            fish.one(".photo-list").attr("page", page);
                            chiocePic(((page * 4) - 4), length);
                        });
                    }
                });
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


    //  执行一下onscroll，触发onscroll方式
    function winScrollFn(num) {
        var scroll = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
        window.scrollTo(0, scroll + (num ? num : 1));
        setTimeout(function() {
            var scroll = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
            window.scrollTo(0, scroll - (num ? num : 1));
        });
    }

    //首屏幻灯图片
    function firstPic() {
        var url = fish.one("#mSlider").attr("attr-url");
        fish.ajax({
            url: url,
            type: "json",
            fn: function(data) {
                if (data) {
                    if (data.imgList == "") return;
                    var imgurl = data.imgList[0].imgurl,
                        imgname = data.imgList[0].name,
                        temp = '<img src="' + imgurl + '" alt="' + imgname + '"/>';
                    fish.one(".line_img").html(temp);
                }
            }
        })
    }

    //最低价，即显示的价格
    function getPrice() {
        var linedate = fish.one("#HidCalendarDate").val();
        fish.ajax({
            url: "/youlun/AjaxCall_Cruise.aspx?Type=GetFinalPrice&lineid=" + lineid + "&saildate=" + linedate,
            type: "json",
            fn: function(data) {
                if (data) {
                    fish.one(".pri_d").html("<span><strong>&yen;<b>" + data.calPrice + "</b></strong>起</span>");
                    //给公共导航弹框-赋值，--判断是否存在公共弹框,并且公共弹框里的内容是否为0，然后赋值
                    var $modalInput = fish.one(".ylc-modal .eve_yusuan input");
                    if ($modalInput && $modalInput[0] && parseInt($modalInput.val(), 10) <= 0) {
                        $modalInput.val(data.calPrice);
                        $modalInput.attr("_placeholder", data.calPrice);
                    }
                }
            }
        })
    }
    window.getPrice = getPrice;

    //线路特色异步（原来名称： 船长推荐）
    function recommend() {
        if (fish.trim(fish.one(".reason").html()) == "" || fish.trim(fish.one(".reason").html()).toUpperCase() == "<P><BR></P>" || fish.trim(fish.one(".reason").html()).toUpperCase() == "<P><BR/></P>") {
            fish.one("#recommend").addClass("none");
            fish.one(fish.all(".f_tit li")[0]).addClass("none");
        }
        scrollPage();
    }


    //预订舱房图片
    function allRoom() {
        var url = fish.one("#room").attr("attr-url");
        fish.ajax({
            url: url,
            type: "json",
            fn: function(data) {
                if (data) {
                    if (data.RoomPicList == "") return;
                    var temp = '<div id="r_slider" class="r_slider mSlider_con"><ul>{{for(var n = 0,m = it.length; n < m; n++){ }}<li><a href="/youlun/linebook/' + lineid + '.html" target="_blank"><img src="{{=it[n].ImgUrl}}"/><div class="minprice"><div><span>{{=it[n].roomname}}<em><b>&yen;</b><strong>{{=it[n].Minprice}}</strong></em><i>起</i></span></div></div></a></li>{{ } }}</ul></div><a id="room_prev" class=" btn prev" href="javascript:void(0)"></a><a id="room_next" class="btn next" href="javascript:void(0)"></a><div id="r_bottom" class="r_bottom"><ul>{{for(var n = 0,m = it.length; n < m; n++){ }}<li><img src="{{=it[n].ImgUrl}}"/><div></div><span>{{=it[n].roomname}}</span></li>{{ } }}</ul></div>',
                        data1 = data.RoomPicList;
                    fish.one("#room").html(fish.template(temp, data1));
                    fish.all(".minprice strong").each(function() {
                            if (fish.one(this).html() == 0 || fish.one(this).html() == undefined) {
                                fish.one(this).parent(".minprice").css("display:none");
                            }
                        })
                        //预订舱房
                    if (fish.trim(fish.one(".room").html())) {
                        slider("r_slider", "r_bottom", "room_prev", "room_next", 10);
                    }
                }
            }
        })
    }

    //航线日期月份异步
    function getMonths() {
        var url = fish.one("#calendar_top").attr("attr-url");
        fish.ajax({
            url: url,
            type: "json",
            fn: function(data) {
                if (data) {
                    if (data.MouthList == "") return;
                    var temp = '<a class="btn prev disabled"></a><div class="calendar_top_con"><ul>{{for(var n = 0,m = it.length; n < m; n++){ }}<li s_date="{{=it[n].startdate}}" e_date="{{=it[n].enddate}}">{{=it[n].data}}</li>{{ } }}</ul></div><a class="btn next disabled"></a>',
                        data1 = data.MouthList;
                    fish.one("#calendar_top").html(fish.template(temp, data1));
                    fish.one("#calendar_top li").addClass("on");
                    var length = fish.all("#calendar_top li").length;
                    if (length == 1) {
                        fish.all("#calendar_top li").css("width:100%");
                    } else if (length == 2) {
                        fish.all("#calendar_top li").css("width:50%");
                    } else if (length == 3) {
                        fish.all("#calendar_top li").css("width:33.33%");
                    } else {
                        fish.one("#calendar_top ul").css("width:" + 120 * length + "px;");
                        fish.all("#calendar_top li").css("width:120px;");
                        fish.one("#calendar_top .next").removeClass("disabled");
                    }
                    make_canael(__v.rateOption);
                }
            }
        })
    }


    //行程信息
    function itinerary() {
        //航班信息tab切换
        var airCon = fish.one("#airMsg");
        //请求航班信息
        fish.ajax({
            url: "/youlun/CruiseTours/CruiseToursAjax_Book.aspx?type=GetLineAirlinePrdouctInfo",
            data: "LineId=" + fish.trim(fish.one("#HidLineid").val()) + "&lineDate=" + fish.trim(fish.one("#oneCal").val()),
            type: "json",
            err: function() {},
            fn: function(data) {
                if (!data || data.length <= 0) {
                    airCon.addClass("none");
                    return;
                }
                var butStr = '',
                    htmlStr = '',
                    startStr = '',
                    backStr = '',
                    dataLen = data.length;
                for (var i = 0; i < dataLen; i++) {
                    var departData = data[i].CruiseFlightTicketDepartureModel,
                        arrivalData = data[i].CruiseFlightTicketArrivalModel;
                    butStr += '<li class="air_buts" _n="' + i + '">航班' + (i + 1) + '</li>';
                    startStr = '<div class="trip_con clearfix"><span class="trip_span"><em>去程</em></span>' + printAirData(departData) + '</div>';
                    backStr = '<div class="trip_con clearfix"><span class="trip_span"><em>返程</em></span>' + printAirData(arrivalData) + '</div>';
                    lineStr = '<div class="arrow_line"></div>';

                    if (!departData || departData.length <= 0) {
                        startStr = '';
                        lineStr = '';
                    }
                    if (!arrivalData || arrivalData.length <= 0) {
                        backStr = '';
                        lineStr = '';
                    }
                    htmlStr += '<div class="air_msg_con none" _n="' + i + '">' + startStr + lineStr + backStr + '</div>';
                    startStr = backStr = '';
                }
                airCon.html('<h4 class="air_tit"><span class="sp_t"><em></em>航班信息</span>（航班仅供参考，具体航班以出团通知书为准，起飞与抵达时间以当地时间为准）</h4>' + '<ul class="air_ul_tab' + (dataLen >= 2 ? " " : " none ") + '">' + butStr + '</ul>' + htmlStr).removeClass("none");
                //默认实行第一个点击事件
                fish.all(".airport_msg .air_buts")[0] && fish.all(".airport_msg .air_buts")[0].click();
            }

        });
        //打印数据
        function printAirData(data) {
            //<h4 class="tr_l_ports">{{=it.DepartureCityName}}-{{=it.ArrivalCityName}}</h4>\
            var temp = '{{?it.index > 0 && it.StayTimeDesc}}\
                            <div class="transfer_sit_line">\
                                <p><span><em class="e_l"></em>{{=it.DepartureCityName}}中转 停留{{=it.StayTimeDesc}}<em class="e_r"></em></span></p>\
                            </div>\
                        {{?}}\
                        <div class="air_tr_lines clearfix">\
                            <p class="air_p01">{{=it.AirlineName}}<br/><span class="m_l_0 sp0">{{=it.FlightNo}}</span><span class="sp0">{{=it.CraftType}}</span><span class="sp0">{{=it.ClassType}}</span></p>\
                            <p class="air_p02 "><span class="f_s_14">{{=it.DepartureTime.substr(0,16)}}<br/><span class="c_666">{{=it.DeparturePort}}</span></p>\
                            <div class="table_line"><span class="c_l"></span><span class="c_r"></span></div>\
                            <p class="air_p02 "><span class="f_s_14">{{=it.ArrivalTime.substr(0,16)}}<br/><span class="c_666">{{=it.ArrivalPort}}</span></p>\
                            <p class="air_p03"><span class="c_666">飞行时长：</span>约{{=it.DurationTimeDesc}}</p>\
                        </div>',
                conStr = '',
                titStr = '';
            for (var i = 0, len = data.length; i < len; i++) {
                data[i].index = i;
                if (data[i].ClassType == 0) {
                    data[i].ClassType = "经济舱";
                } else if (data[i].ClassType == 1) {
                    data[i].ClassType = "公务舱";
                } else if (data[i].ClassType == 2) {
                    data[i].ClassType = "头等舱";
                } else {
                    data[i].ClassType = "";
                }
                conStr += fish.template(temp, data[i]);
                titStr += '<span class="tit_span">' + data[i].DepartureCityName + '-' + data[i].ArrivalCityName + '</span>';
                // console.log(titStr)
            }
            // console.log('<div class="air_t_info">' + '<h4 class="tr_l_ports">' + titStr + '</h4>' +conStr + '</div>')
            return '<div class="air_t_info">' + '<h4 class="tr_l_ports">' + titStr + '</h4>' + conStr + '</div>';
        }

        //航班tab切换
        fish.all(".airport_msg").on("click", function(evt) {
            var target = fish.getTarget(evt),
                thisObj = fish.one(target);
            do {
                if (thisObj.hasClass("air_buts")) {
                    var airParent = thisObj.parent(".airport_msg")[0],
                        allBut = fish.all(".air_buts", airParent),
                        allCont = fish.all(".air_msg_con", airParent),
                        index = parseInt(fish.trim(thisObj.attr("_n")), 10);
                    allBut.removeClass("act");
                    thisObj.addClass("act");
                    allCont.addClass("none");
                    fish.one(allCont[index]).removeClass("none");
                    return;
                }
            } while (target = target.parentNode);
        });

        //行程信息
        var url = "/youlun/AjaxCall_Cruise.aspx?Type=TravelTripFinal&lineid=" + lineid + "&saildate=" + fish.one("#oneCal").val();
        fish.ajax({
            url: url,
            type: "json",
            fn: function(data) {
                if (data) {
                    data.Date = fish.one("#HidDate").val();
                    if (!data.SummayTravel) {
                        fish.one("#itinerary").html("remove");
                        fish.all(".f_tit li").each(function(elem) {
                            var id = fish.one(elem).attr("attr-id");
                            if (id == 1) {
                                fish.one(elem).html("remove");
                            }
                        });
                        scrollPage();
                        return;
                    }
                    var temp = '<h5>行程概述</h5>\
                                <div class="overviews">\
                                    <div class="routeMap"><img src="{{=it.TripImage}}" alt=""/></div>\
                                    {{var date = new Date(it.Date.replace(/\-/gi, "/")).getTime(),addenglish = 0;}}\
                                    {{? it.IsInterLine == 1}}\
                                    {{? it.IsLongLine == 1 && it.IsSinglePicket == 1}}{{addenglish = 1;}}{{?}}\
                                        <div class="routeTable">\
                                            <dl class="head">\
                                                <dd class="dayth">行程</dd>\
                                                <dd class="throuth">国家/城市</dd>\
                                                <dd class="arrive">抵达<span>当地时间</span></dd>\
                                                <dd class="sail">启航<span>当地时间</span></dd>\
                                            </dl>\
                                            <div id="ins_container">\
                                                <div id="ins_shower">\
                                                {{for(var a = 0,b = it.SummayTravel.CalendarTravelList,c = b.length; a < c; a++){ }}\
                                                    <dl {{? addenglish}}class="english {{? a%2 == 1}}even{{?}}"{{??}}class="{{? a%2 == 1}}even{{?}}"{{?}}>\
                                                        <dd class="dayth">第{{=b[a].Date}}天<em>({{=new Date(date+a*1000*60*60*24).getMonth() + 1}}月{{=new Date(date+a*1000*60*60*24).getDate()}}日)</em></dd>\
                                                        <dd class="throuth">{{=b[a].CountryOrSight}}{{?addenglish}}<br/>{{=b[a].CountryEn}}{{?}}</dd>\
                                                        <dd class="arrive">{{=b[a].ArrTime}}&nbsp;</dd>\
                                                        <dd class="sail">{{=b[a].SetUpTime}}</dd>\
                                                    </dl>\
                                                {{ } }}\
                                                </div>\
                                            </div>\
                                            <div id="ins_scroller">\
                                                <div  id="ins_scroll_bar"></div>\
                                            </div>\
                                        </div>\
                                    {{??}}\
                                        <div class="routeTable">\
                                            <dl class="head">\
                                                <dd class="dayth">行程</dd>\
                                                <dd class="throuth">途径景点</dd>\
                                                <dd class="arrive">入住</dd>\
                                                <dd class="sail"></dd>\
                                            </dl>\
                                            <div id="ins_container">\
                                                <div id="ins_shower">\
                                                {{for(var a = 0,b = it.SummayTravel.CalendarTravelList,c = b.length; a < c; a++){ }}\
                                                    <dl {{? a%2 == 1}}class="even" {{??}}{{?}}>\
                                                        <dd class="dayth">第{{=b[a].Date}}天<em>({{=new Date(date+a*1000*60*60*24).getMonth() + 1}}月{{=new Date(date+a*1000*60*60*24).getDate()}}日)</em></dd>\
                                                        <dd class="throuth">{{=b[a].CountryOrSight}}</dd>\
                                                        <dd class="arrive">{{=b[a].TravelLive}}&nbsp;</dd>\
                                                        <dd class="sail"></dd>\
                                                    </dl>\
                                                {{ } }}\
                                                </div>\
                                            </div>\
                                            <div id="ins_scroller">\
                                                <div  id="ins_scroll_bar"></div>\
                                            </div>\
                                        </div>\
                                    {{?}}\
                                    <p class="routeNote"><span style="color:#ff6600;">*</span>上述抵达与启航时间均为参考信息，具体信息请以邮轮实际行程为准</p>\
                                </div>\
                                {{? it.CruiseTravelAllModel.CruiseTravelDayModList.length > 0}}\
                                <h5> 行程详情\
                                    <div class="itinerary_print">\
                                        <span onclick="_tcTraObj._tcTrackEvent(\'click\',\'PCtours-xlts\',\'email\');" class="email_pbt" a-url="/youlun/CruiseTours/CruiseToursAjax.aspx?Type=GetEmailRoute&amp;lineid=printid">Email行程</span>\
                                        <a onclick="_tcTraObj._tcTrackEvent(\'click\',\'PCtours-xlts\',\'dayin\');" _href="/youlun/tour/GetourToMember.aspx?lineid=printid" class="print_link">打印行程</a>\
                                    </div>\
                                </h5>\
                                <div class="routeDetail">\
                                    <div class="dayList">\
                                        <div id="dayList">\
                                            <div class="dayListArrow up none"></div>\
                                            <div class="dayList_nav">\
                                                <ul attr-top="0">\
                                                {{for(var a = 1,b = it.CruiseTravelAllModel.CruiseTravelDayModList,c = b.length; a <= c; a++){ }}\
                                                    <li>第{{=a}}天</li>\
                                                {{ } }}\
                                                </ul>\
                                            </div>\
                                            <div class="dayListArrow down act none"></div>\
                                        </div>\
                                    </div>\
                                    {{? it.IsInterLine == 1}}\
                                        <div class="dayCon">\
                                            {{for(var a = 0,b = it.CruiseTravelAllModel.CruiseTravelDayModList,c = b.length; a < c; a++){ }}\
                                                <div class="travel_day" id="day{{=(a + 1)}}">\
                                                    <span class="travel_day_logo {{? b[a].IsTravelSea == 0}}shore {{??}}{{?}}"></span>\
                                                    <p class="travel_day_title"><span>第{{=(a + 1)}}天</span><span>{{=b[a].LineCity}}</span>{{? b[a].ArrTime != ""}}<span>抵达时间 {{=b[a].ArrTime}}</span>{{??}}{{?}}{{? b[a].SetUpTime !=""}}<span>启航时间 {{=b[a].SetUpTime}}</span>{{??}}{{?}}</p>\
                                                    <div class="travel_day_con">\
                                                        {{? b[a].EatModel != null || b[a].TravelLive !=""}}<p class="eat">{{? b[a].EatModel != null}}{{for(var i = 0, j = b[a].EatModel.length; i < j; i++){}}<span>邮轮{{=b[a].EatModel[i].EatName}}：{{=b[a].EatModel[i].IsContain}}</span>{{}}}{{??}}{{?}}{{? b[a].TravelLive != ""}}<span class="home">入住：{{=b[a].TravelLive}}</span>{{??}}{{?}}</p>{{??}}{{?}}\
                                                        <div class="route">{{=b[a].Description}}</div>\
                                                        <div class="route_img">\
                                                            <div class="mSlider_con">\
                                                                    <ul>\
                                                                    {{? b[a].SightCruiseTravelScenicImg}}\
                                                                        {{for(var x = 0,y = b[a].SightCruiseTravelScenicImg,z = y.length; x < z; x++){ }}\
                                                                            <li>\
                                                                                <img src="{{=y[x].ImgUrl}}"/>\
                                                                                <div class="layer">{{=y[x].Name}}</div>\
                                                                            </li>\
                                                                        {{ } }}\
                                                                    {{??}}{{?}}\
                                                                    </ul>\
                                                                </div>\
                                                            <a class="slider_left"></a>\
                                                            <a class="slider_right"></a>\
                                                        </div>\
                                                    </div>\
                                                    {{? b[a].CruiseTravelDetailMod.length > 0}}\
                                                        <div class="excusion">\
                                                            <p class="nochange"><span>岸上观光</span>（一条线路是贯穿整个旅行的，如选择A线，则所有岸上游都是A线的行程）</p>\
                                                            {{for(var x = 0,y = b[a].CruiseTravelDetailMod,z = y.length; x < z; x++){}}\
                                                                {{var time = y[x].DetailExcursion.CLTDETravelTime,hours = parseInt(time/60,10),minus = time%60,Breakfast = y[x].DetailExcursion.CLTDEIsIncludeBreakfast,Lunch = y[x].DetailExcursion.CLTDEIsIncludeLunch,Dinner = y[x].DetailExcursion.CLTDEIsIncludeDinner,foot = "岸上餐食：";}}\
                                                                {{? Breakfast == 0 && Lunch == 0 && Dinner == 0}}{{foot = "";}}{{??}}{{? Breakfast == 1}}{{foot += "早餐,";}}{{??}}{{?}}{{? Lunch == 1}}{{foot += "午餐,";}}{{??}}{{?}}{{? Dinner == 1}}{{foot += "晚餐,";}}{{??}}{{?}}{{foot = foot.replace(/,$/g,"")+"包含";}}{{?}}\
                                                                <div class="excusion_type">\
                                                                    <p class="vaca"><span>{{=y[x].TypeName}}</span><span>景点：{{for(var j = 0,k = y[x].VisitNameList,l = k.length;j < l; j++){}} {{? j != l-1}}{{=k[j]}}-{{??}}{{=k[j]}}{{?}}{{}}}</span><em></em></p>\
                                                                    <div class="scenic none">\
                                                                        {{? time > 0 || foot.length > 0}}<p class="scenic_time clearfix">{{? time > 0}}<span class="time">行程总时长约：{{? hours > 0}}{{=hours}}小时{{??}}{{?}}{{? minus > 0}}{{=minus}}分钟{{??}}{{?}}{{??}}{{?}}</span><span>{{=foot}}</span></p>{{??}}{{?}}\
                                                                        {{for(var j = 0,k = y[x].CruiseTravelSightDetailModList,l = k.length;j < l;j++){}}\
                                                                            <p class="scenic_name"><span>【{{=k[j].Name}}】</span>{{=k[j].Description == null ? "" : k[j].Description}}</p>\
                                                                        {{}}}\
                                                                        <p class="scenic_weath">以上岸上观光行程安排可能因天气、路况等原因做顺序上的相应调整，请您谅解。</p>\
                                                                        {{? y[x].CruiseTravelScenicImg.length > 0}}\
                                                                            <ul>\
                                                                            {{for(var j = 0,k = y[x].CruiseTravelScenicImg,l = k.length;j < l; j++){}}\
                                                                                <li><img src="{{=k[j].ImgUrl}}"><p>{{=k[j].Name}}</p></li>\
                                                                            {{}}}\
                                                                            </ul>\
                                                                        {{??}}{{?}}\
                                                                    </div>\
                                                                </div>\
                                                            {{ } }}\
                                                        </div>\
                                                    {{??}}{{?}}\
                                                </div>\
                                            {{ } }}\
                                        </div>\
                                        {{??}}\
                                            <div class="dayCon">\
                                                {{for(var a = 0,b = it.CruiseTravelAllModel.CruiseTravelDayModList,c = b.length; a < c; a++){ }}\
                                                    <div class="travel_day" id="day{{=(a + 1)}}">\
                                                        <span class="travel_day_logo {{? b[a].IsTravelSea == 0}}shore {{??}}{{?}}"></span>\
                                                        <p class="travel_day_title"><span>第{{=(a + 1)}}天</span><span>{{=b[a].LineCity}}</span></p>\
                                                        <div class="travel_day_con">\
                                                            {{? b[a].EatModel != null || b[a].TravelLive !=""}}<p class="eat">{{? b[a].EatModel != null}}{{for(var i = 0, j = b[a].EatModel.length; i < j; i++){}}<span>游轮{{=b[a].EatModel[i].EatName}}：{{=b[a].EatModel[i].IsContain}}</span>{{}}}{{??}}{{?}}{{? b[a].TravelLive != ""}}<span class="home">入住：{{=b[a].TravelLive}}</span>{{??}}{{?}}</p>{{??}}{{?}}\
                                                            <div class="route">{{=b[a].Description}}</div>\
                                                            <div class="route_img">\
                                                                <div class="mSlider_con">\
                                                                    <ul>\
                                                                    {{? b[a].SightCruiseTravelScenicImg}}\
                                                                        {{for(var x = 0,y = b[a].SightCruiseTravelScenicImg,z = y.length; x < z; x++){ }}\
                                                                            <li>\
                                                                                <img src="{{=y[x].ImgUrl}}"/>\
                                                                                <div class="layer">{{=y[x].Name}}</div>\
                                                                            </li>\
                                                                        {{ } }}\
                                                                    {{??}}{{?}}\
                                                                    </ul>\
                                                                </div>\
                                                                <a class="slider_left"></a>\
                                                                <a class="slider_right"></a>\
                                                        </div>\
                                                        </div>\
                                                        {{? b[a].CruiseTravelDetailMod.length > 0}}\
                                                            <div class="excusion">\
                                                                <p class="nochange"><span>岸上观光</span></p>\
                                                                {{for(var x = 0,y = b[a].CruiseTravelDetailMod,z = y.length; x < z; x++){}}\
                                                                    <div class="excusion_type">\
                                                                        <p class="vaca"><span>当日游玩景点</span><span>{{for(var j = 0,k = y[x].VisitNameList,l = k.length;j < l; j++){}} {{? j != l-1}}{{=k[j]}}-{{??}}{{=k[j]}}{{?}}{{}}}</span><em></em></p>\
                                                                        <div class="scenic none">\
                                                                            {{for(var j = 0,k = y[x].CruiseTravelSightDetailModList,l = k.length;j < l;j++){}}\
                                                                                <p class="scenic_name"><span>【{{=k[j].Name}}】</span>{{=k[j].Description}}</p>\
                                                                            {{}}}\
                                                                            <p class="scenic_weath">以上岸上观光行程安排可能因天气、路况等原因做顺序上的相应调整，请您谅解。</p>\
                                                                            {{? y[x].CruiseTravelScenicImg.length > 0}}\
                                                                                <ul>\
                                                                                {{for(var j = 0,k = y[x].CruiseTravelScenicImg,l = k.length;j < l; j++){}}\
                                                                                    <li><img src="{{=k[j].ImgUrl}}"><p>{{=k[j].Name}}</p></li>\
                                                                                {{}}}\
                                                                                </ul>\
                                                                            {{??}}{{?}}\
                                                                        </div>\
                                                                    </div>\
                                                                {{ } }}\
                                                            </div>\
                                                        {{??}}{{?}}\
                                                    </div>\
                                                {{ } }}\
                                            </div>\
                                        {{?}}\
                                </div>\
                                {{??}}{{?}}';


                    var temp2 = '<div class="route_infro">' +
                        '<em class="t_tit">行程概要：</em>';
                    var list = data.SummayTravel.CalendarTravelList;
                    for (var i = 0, j = list.length; i < j; i++) {
                        if (i < 5) {
                            temp2 += '<span>';
                            temp2 += i == 0 ? '' : '<em class="d_i"></em>';
                            temp2 += '&nbsp;D' + list[i].Date + '<em class="d_city">' + list[i].CountryOrSight
                                .replace(/飞机/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/动车/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/火车/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/汽车/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/巴士/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/邮轮/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/大巴/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">")
                                .replace(/轮船/g, "</em><em class=\"d_i\"></em><em class=\"d_city\">") + '</em></span>';
                        }
                    }
                    if (list.length > 5) {
                        temp2 += '<span class="detail_l"><em class="d_i"></em>&nbsp;D6<em>...</em><a id="linkTravel">详情</a></span></div>';
                    }
                    fish.all(".route_infro").html("remove");
                    fish.one(".trip_msg").html("after", temp2);
                    fish.all(".route_infro .d_city").each(function() {
                        var spanHtml = fish.one(this).html();
                        if (spanHtml.length > 5) {
                            spanHtml = spanHtml.substr(0, 5) + "...";
                        }
                        fish.one(this).html(spanHtml);
                    });


                    var data1 = fish.template(temp, data);
                    data1 = data1.replace(/printid/g, lineid);
                    fish.one(".specialty").html(data1);

                    fish.one(".travel_day").css("margin-top:0");
                    fish.one(".dayList_nav li").addClass("on");


                    //把每天行程标题内交通工具名称改为图标
                    fish.all(".travel_day_title span,.routeTable .throuth").each(function() {
                        var spanHtml = fish.one(this).html();
                        spanHtml = spanHtml.replace(/飞机/g, "<em class='plane'></em>")
                            .replace(/动车/g, "<em class='train'></em>")
                            .replace(/火车/g, "<em class='train'></em>")
                            .replace(/汽车/g, "<em class='bus'></em>")
                            .replace(/巴士/g, "<em class='bus'></em>")
                            .replace(/邮轮/g, "<em class='crise'></em>")
                            .replace(/大巴/g, "<em class='bus'></em>")
                            .replace(/轮船/g, "<em class='crise'></em>");
                        fish.one(this).html(spanHtml);
                    });

                    //处理无图片情况
                    fish.all(".travel_day_con").each(function() {
                        if (fish.all(".route_img li", this).length == 0) {
                            fish.one(".route_img", this).html("remove");
                            fish.one(".route", this).css("width:100%");
                        }
                    });
                    //屏幕滚动交互
                    scrollPage();
                    //简易行程滚动条
                    if (fish.all("#ins_shower dl").length > 5) {
                        fish.mScrollpane({
                            wheelNum: 10,
                            container: "#ins_container",
                            shower: "#ins_shower",
                            scroller: "#ins_scroller",
                            scroll_bar: "#ins_scroll_bar",
                            defaultStyle: true
                        });
                        fish.one("#ins_container").css("margin-top:33px;");
                    }

                    //点击上下箭头滚动
                    var day_list = fish.all(".dayList_nav li").length, //总天数
                        num1 = parseInt(day_list / 8, 10), //取整数
                        num2 = day_list % 8, //取余数
                        maxTtop = ((num1 - 1) * 8 + num2) * 35; //最大滚动距离
                    fish.all(".dayListArrow").on("click", function() {
                        var ulTop = parseInt(fish.one(".dayList_nav ul").attr("attr-top"), 10);
                        if (!fish.one(this).hasClass("act")) return;
                        fish.all(".dayListArrow").addClass("act");
                        if (fish.one(this).hasClass("up")) {
                            ulTop -= 175;
                            if (ulTop <= 0) {
                                ulTop = 0;
                                fish.one(this).removeClass("act");
                            }
                            fish.one(".dayList_nav ul").attr("attr-top", ulTop);
                        }
                        if (fish.one(this).hasClass("down")) {
                            ulTop += 175;
                            if (ulTop >= maxTtop) {
                                ulTop = maxTtop;
                                fish.one(this).removeClass("act");
                            }
                            fish.one(".dayList_nav ul").attr("attr-top", ulTop);
                        }
                        fish.one(".dayList_nav ul").anim("top:-" + ulTop + "px;", 500);
                    })


                    //点击具体天数
                    fish.all(".dayList_nav ul li").each(function(elem, i) {
                        fish.one(elem).on("click", function() {
                            var that = fish.one(this),
                                sliderTop = i * 35;
                            if (sliderTop == 0) {
                                fish.one(".up").removeClass("act");
                            } else if (0 < sliderTop && sliderTop < maxTtop) {
                                fish.all(".up,.down").addClass("act");
                            } else {
                                sliderTop = maxTtop;
                                fish.one(".down").removeClass("act");
                            }
                            if (!fish.all(".dayListArrow").hasClass("none")) {
                                fish.one(".dayList_nav ul").anim("top:-" + sliderTop + "px;", 500);
                            }
                            fish.all(".dayList_nav ul li").removeClass("on");
                            that.addClass("on");
                            window.scrollTo(0, fish.one(fish.all(".travel_day")[i]).offset().top - fish.one(".f_tit").height());
                        })
                    })


                    //大于8天才出现上下箭头
                    if (fish.all(".dayList_nav li").length <= 8) {
                        fish.all(".dayList_nav,.dayList ul").css("height:auto;");
                    } else {
                        fish.all(".dayListArrow").removeClass("none");
                    }


                    //行程岸上观光显示隐藏，好多显隐，呵呵哒
                    fish.all(".excusion_type").each(function() {
                        var that = fish.one(this);
                        fish.one("p", that).on("click", function() {
                            if (fish.one("em", this).hasClass("show")) {
                                fish.one("em", this).removeClass("show");
                                fish.one(".scenic", that).addClass("none");
                                var dayCon = fish.one(".dayCon").height();
                                fish.one(".dayList").css("height:" + dayCon + "px;");
                                if (fish.one("#dayList").offset().top > fish.one(".dayList").offset().top + fish.one(".dayList").height() - fish.one("#dayList").height()) {
                                    fish.one("#dayList").css({ "position": "absolute", "bottom": 0, "top": "auto" });
                                }
                            } else {
                                fish.one("em", this).addClass("show");
                                fish.one(".scenic", that).removeClass("none");
                            }
                        })
                    })


                    fish.all(".route_img").each(function() {
                        if (fish.all("li", this).length > 1) {
                            fish.one(this).mSlider({
                                autoScroll: true,
                                showNav: false,
                                circle: true,
                                arrows: true,
                                moveTime: 5000,
                                prevBtn: ".slider_left",
                                nextBtn: ".slider_right"
                            })
                        } else {
                            fish.all("a", this).css("display:none;");
                        }
                    })

                }
            }
        })
    }
    window.itinerary = itinerary;

    //给跳转地址绑定统计所需参数,现在查询条件
    function bindBtnKey() {
        var obj = __v.rateOption;
        var fTopBtn = fish.one("#TopProductElem .link_order");
        var fMidBtn = fish.one(".elem_intr .fix_order .fix_order_link");
        if (fish.one("#TopProductElem .link_order").length > 0) {
            fTopBtn.attr("href", fTopBtn.attr("href").addParams(obj));
        }
        if (fish.one(".elem_intr .fix_order").length > 0) {
            fMidBtn.attr("href", fMidBtn.attr("href").addParams(obj));
        }
    }

    //促销优惠信息
    function getRoomListAjax() {
        var HidLineid = fish.one("#HidLineid").val(),
            HidCalendarDate = fish.one("#oneCal").val();
        fish.ajax({
            url: fish.one("#contentRoomEle").attr("attr-url"),
            data: "lineid=" + HidLineid + "&Date=" + HidCalendarDate + "&IsSelectPromotion=1",
            type: "json",
            fn: function(data) {
                if (data && data.ProList && data.ProList.length > 0) {
                    ////临时文件 616周年庆 活动时间 5月25号到6月16号
                    var tagstr = "";
                    var date = new Date().getTime(),
                        hStartDate = new Date("2016/05/25").getTime(),
                        hEndDate = new Date("2016/06/20").getTime();
                    if (date >= hStartDate && date < hEndDate) {
                        tagstr = '<span class="hot616"></span>';
                    }
                    fish.one(".pro_tit .h2_title").html("bottom", tagstr);

                    var aHtml = "<span class='other_a showsale'>立减优惠</span>",
                        pHtml = "";
                    for (var i = 0; i < data.ProList.length; i++) {
                        pHtml += "<p>" + data.ProList[i] + "</p>";
                    }
                    fish.one(".other_h").removeClass("none");
                    fish.one(".pr_mg .price_yh").html("bottom", aHtml);
                    fish.one("#cuxiao .comm_mian").html("bottom", pHtml);
                    fish.one("#showsale").hover();
                }
                if (data && data.GiftList && data.GiftList.length > 0) {
                    var aHtml = "<span class='other_a libao'>礼包</span>",
                        pHtml = "";
                    for (var i = 0; i < data.GiftList.length; i++) {
                        pHtml += "<p>" + data.GiftList[i] + "</p>";
                    }
                    fish.one(".pr_mg .price_yh").html("bottom", aHtml);
                    fish.one("#libao .comm_mian").html("bottom", pHtml);
                    fish.one("#libao").hover();
                }
            }
        })
    }

    //游记
    function travels() {
        fish.ajax({
            url: "/youlun/CruiseShipTeam/CruiseShipTeamAjax.aspx?type=GetYouJiInfo",
            data: "shipName=" + encodeURIComponent(fish.one("#HidShipName").val()) + "&length=158",
            type: "json",
            fn: function(data) {
                if (data && data.length > 0) {
                    var mod = '{{for(var n = 0, m = it.length; n < m; n++ ){}}\
                                <div class="tra_list">\
                                    <div class="tra_list_l">\
                                        <img src="{{=it[n].RmAuthorHeadImg}}" alt=""/>\
                                        <a class="tra_mr" href="http://go.ly.com/user/{{=it[n].AesRmMemberId}}/" target="_blank">{{=it[n].RmUserName}}</a>\
                                        <span class="tra_num tra_mr">{{=it[n].ReviewCount}}</span>\
                                        <span class="tra_lnum tra_mr">{{=it[n].ReRecommendCount}}</span>\
                                    </div>\
                                    <div class="tra_list_r">\
                                        <a class="tra_tit" href="http://go.ly.com/youji/{{=it[n].RmId}}.html" target="_blank">{{=it[n].RmTitle}}</a>\
                                        <p class="tra_info"><a target="_blank" href="http://go.ly.com/youji/{{=it[n].RmId}}.html">{{=it[n].Contentxt}}<span style="color: #167cd8">详情&gt;&gt;</span></a></p>\
                                        {{? it[n].RmImageList.length > 0}}<ul>{{for(var i = 0, j = it[n].RmImageList.length > 5 ? 5 : it[n].RmImageList.length; i < j; i++){ }}<li><a class="tra_tit" href="http://go.ly.com/youji/{{=it[n].RmId}}.html" target="_blank"><img src="{{=it[n].RmImageList[i]}}" alt=""/></a></li>{{}}}</ul>{{??}}{{?}}\
                                    </div>\
                                </div>\
                                {{?n != m - 1}}\
                                <div class="tra_lsty"></div>\
                                {{?}}\
                                {{}}}',
                        len = data.length,
                        companyNameID = fish.one("#HidCompanyId").val() || "",
                        shipNameID = fish.one("#HidCruiseId").val() || "",
                        setHref = "/youlun/gonglve/",
                        isNone = fish.trim(fish.one("#HidYouJiType").val()) == "0" && len > 1 ? "" : " none ";
                    if (companyNameID && shipNameID) {
                        setHref = "/youlun/gonglve_" + companyNameID + "_" + shipNameID + "/"
                    }
                    fish.one(".tra_main").html(fish.template(mod, data) + '<a class="more_stra ' + isNone + '" target="_blank" href="' + setHref + '"></a>');
                } else {
                    fish.one("#travelsCommElem").html("remove");
                    fish.all(".f_tit li").each(function(elem) {
                        var id = fish.one(elem).attr("attr-id");
                        if (id == 6) {
                            fish.one(elem).html("remove");
                        }
                    });
                    scrollPage();
                    return;
                }
            },
            err: function() {}
        })
    }

    //船队入口统计
    function cruiseTrack() {
        fish.one(".boat_link").on("click", function() {
            var cid = fish.one("#HidCruiseId").val(),
                shref = window.location.href,
                surl = "/youlun" + shref.split("?")[0].split("&")[0].split("/youlun")[1];
            fish.ajax({
                url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseShipTeamStatistic",
                data: "Url=" + surl + "&cruiseid=" + cid + "&pagetype=1",
                type: "json",
                fn: function(data) {}
            });
        })
    }

    //顶部广告
    function topAdvert() {
        /*这一段五一来删掉start*/
        var nowTime = new Date(),
            startTime = new Date("2016/04/18 00:00:00"),
            endTime = new Date("2016/04/30 00:00:00");
        if (fish.one("#HidLineid").val() == 72517 && nowTime.getTime() > startTime.getTime() && nowTime.getTime() < endTime.getTime()) {
            fish.one("#bannerImg").html('<a href="https://www.lancai.cn/?cid=108002" target="_blank"><img src="http://img1.40017.cn/cn/y/16/p/lancai.png"></a>');
            fish.one("#bannerImg").anim("height:90px", 1000);
            return false;
        }
        /*这一段五一来删掉end*/

        fish.ajax({
            url: "/youlun/CruiseTours/CruiseToursAjax.aspx",
            data: "Type=GetCruiseSliderPicList&num=1",
            type: "json",
            fn: function(data) {
                if (!data || !data[0] || !data[0].LineUrl) return false;
                data ? fish.one("#bannerImg").html('<a href="' + data[0].LineUrl + '" target="_blank"><img src="' + data[0].ImgUrl + '"></a>') : "";
                fish.one("#bannerImg").anim("height:90px", 1000);
            },
            err: function() {
                fish.one("#bannerImg").anim("height:90px", 1000);
            }
        });
    }

    fish.ready(function() {
        //顶部广告
        topAdvert();
        //获取价格
        getPrice();
        //预订说明模块字体设为微软雅黑
        fish.all(".description span").css("font-family:'microsoft yahei'");
        // 首屏滚动、线路特色和预订舱房懒加载
        fish.all(".mSlider_con ul li img").lazyLoad({ attr: "data-img-src", preSpace: 50 });
        //
        if (fish.one("#visaCommElem").length <= 0) {
            fish.all(".f_tit li").each(function(elem) {
                var id = fish.one(elem).attr("attr-id");
                if (id == 3) {
                    fish.one(elem).html("remove");
                }
            });
        }
        //首屏幻灯
        firstPic();
        //优惠说明
        SpecialNote();
        //线路特色（原来名称： 船长推荐）
        recommend();
        //线路行程
        itinerary();
        //促销优惠信息
        getRoomListAjax();
        //预订仓房图片
        allRoom();
        //航线日期
        getMonths();
        //  触发onscroll事件
        winScrollFn();
        //PV统计
        rate();
        //船队统计
        cruiseTrack();
        //红包
        workendactive();
        //  页面加载检测收藏
        __v.usi ? collectLine(fish.one("#collectLine").attr("attr-url"), "searchnew") : "";
        //  分享
        var ip = fish.one("#ip").attr("val"),
            cnUserUserId = fish.cookie.get("us", "userid"),
            CurrentUrl = fish.one("#CurrentUrl").attr("val"),
            shareText = fish.one("#shareText").attr("val"),
            sharesummary = fish.one("#sharesummary").attr("val"),
            shareUrl = "";
        if (cnUserUserId) {
            shareUrl = CurrentUrl + "?refid=" + cnUserUserId + "&Ip=" + ip;
        } else {
            shareUrl = CurrentUrl;
        }
        /*
         elem 固定不变，除非dom元素改了。
         url : 表示分享出去的链接. 默认当前页面url
         title 表示分享内容，默认是（页面标题 + @同程网）
         summary 是QQ空间特有的，在QQ空间分享里面 title表示标题，summary 表示分享内容。
         pic 表示默认分享的图片，可不传。
         */
        share({
            elem: fish.one("#shareContent .share_d"),
            url: shareUrl,
            title: shareText,
            summary: sharesummary,
            wxurl: shareUrl
        });

    })

    fish.loaded(function() {
        //  触发onscroll事件
        winScrollFn();
    });

    //判断手机号码格式
    function isPhone(str) {
        return /^1[3,4,5,7,8]\d{9}$/i.test(str);
    }

    //红包
    function workendactive() {
        //页面底部横幅控制
        if (setTime("2016/06/02 00:00:00", "2016/06/20 00:00:00")) {
            fish.one(".workendactive").removeClass("none");
            var lastTime = localStorage.lastOpenTime || 0;
            if (lastTime == 0 || lastTime != fish.parseDate()) {
                localStorage.lastOpenTime = fish.parseDate();
                fish.one(".bonus_box").css({ "left": 0 });
                fish.one(".aside_tag").css({ "left": "-136px;" });
            } else {
                fish.one(".bonus_box").css({ "left": "-100%;" });
                fish.one(".aside_tag").css({ "left": 0 });
            }
        }
        //搜索框右边的图片控制
        if (setTime("2016/06/02 00:00:00", "2016/06/09 00:00:00")) {
            fish.one(".searchSale").attr("href", "http://www.ly.com/zhuanti/youlundashiji");
            fish.one(".searchSale img").attr("src", "http://img1.40017.cn/cn/y/16/h/3.0.3/dashijian.gif");
        }
        //领红包
        fish.one(".bonus_form a").on("click", function() {
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
                fn: function(data) {
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
        fish.all(".phone,.code").on("focus", function() {
            fish.one(".bonus_tip").addClass("none");
        });
        //*刷新验证码
        fish.one(".bonus_form img").on('click', function() {
            fish.one(".code").val("");
            var url = '/youlun/CruiseRedPacket/CruiseRedPacketajax.aspx';
            fish.one(".bonus_form img").attr('src', url + '?type=GetRedPackCheckCode&module=1&height=40&width=60&r=' + Math.random());
        });


        //  红包弹层关闭
        fish.all(".bonus_suc .close,.use").on("click", function() {
            fish.all(".bonus_bg,.bonus_box").anim("left:-100%", 800, function() {
                fish.one(".aside_tag").anim("left:0px;", 200);
            });
            fish.all(".bonus_mask,.bonus_suc").addClass("none");
        });


        fish.one(".bonus_box .close").on("click", function() {
            fish.all(".bonus_bg,.bonus_box").anim("left:-100%", 800, function() {
                fish.all(".bonus_bg,.bonus_box").addClass("none");
                fish.one(".aside_tag").anim("left:0px;", 200);
            });
        });
        fish.one(".aside_tag").on("click", function() {
            var _width = fish.one(this).width();
            fish.one(".aside_tag").anim("left:-" + _width + "px;", 200, function() {
                fish.all(".bonus_bg,.bonus_box").removeClass("none").anim("left:0%", 800);
            });
        });


        if (fish.browser("ms")) {
            fish.all(".bonus_box input").each(function() {
                var placeholder_val = fish.one(this).attr("placeholder");
                fish.one(this).val(placeholder_val).css({ "color": "#666" }).on("focus", function() {
                    if (fish.one(this).val() == placeholder_val) {
                        fish.one(this).val("");
                    }
                }).on("blur", function() {
                    if (!fish.one(this).val() == "") {
                        fish.one(this).css({ "color": "#333" });
                    } else {
                        fish.one(this).val(placeholder_val);
                    }
                });
            })
        } else {}
    }
    //最近时间配置的东西比较多,是时候弄个配时间的方法了
    function setTime(startTime, endTime) {
        var nowT = new Date(),
            startT = new Date(startTime),
            endT = new Date(endTime),
            nowTime = nowT.getTime(),
            startTime = startT.getTime(),
            endTime = endT.getTime();
        if (nowTime > startTime && nowTime < endTime) {
            return true;
        } else {
            return false;
        }
    }

})();

/*** 降价提醒 start ***/
fish.admin.config({
    Calendar: { v: "0.3", css: "0.3", g: 2015032101 }
});
! function(fish, window, document) {
    var jjtxObj = jjtxObj || {};
    fish.lang.extend(jjtxObj, {
        init: function() {
            this.bindEvent();
        },
        bindEvent: function() {
            function _inputIn(e) {
                var $tar = fish.one(this),
                    val = $tar.val();
                if ($tar && $tar[0] && val.length) $tar.removeClass("placeholder");
            }

            function _inputOut(e) {
                var $tar = fish.one(this),
                    val = $tar.val();
                if ($tar && $tar[0] && !val.length) $tar.addClass("placeholder");
            }
            fish.all("#TopProductElem .prn-btn").once("jjtxObj", function() {
                fish.one(this).on("click", function() {
                    var elem = fish.one(this).parent(".p_infro");
                    elem = fish.one(".pri_d b", elem[0]).html();
                    elem = parseInt(elem, 10);
                    elem = isNaN(elem) ? 1 : elem < 1 ? 1 : elem > 999999 ? 999999 : elem;
                    fish.one(".ylc-modal-priceremind #iptPrnPrice").val(elem);
                    fish.mPop({
                        content: fish.one(".pri-rem-notice"),
                        beforeClose: function() {
                            jjtxObj.$cal.hide();
                        }
                    });
                    fish.ajax({ url: "/youlun/AjaxCall_Cruise.aspx?Type=CruiseHomePageWindowStatistic&value=CutPriceNotifyClick" });
                });
            });
            fish.all(".ylc-modal-priceremind .ylc-m-close").once("jjtxObj", function() {
                fish.one(this).on("click", function() {
                    fish.mPop.close();
                });
            });
            fish.all(".ylc-modal-priceremind #iptPrnPrice").once("jjtxObj", function() {
                function fn(e) {
                    var val,
                        $tar = fish.one(this);
                    val = parseInt(fish.trim($tar.val()), 10);
                    val = isNaN(val) ? 1 : val < 1 ? 1 : val > 999999 ? 999999 : val;
                    $tar.val(val);
                }
                fish.one(this).on("change", fn).on("blur", fn);
                fn.call(this, fish.getEvent());
            });
            //日历
            fish.all(".ylc-modal-priceremind #iptPrnStartTime").once("jjtxObj", function() {
                var startTime = new Date(),
                    endTime = new Date();
                endTime = new Date(endTime.setFullYear(endTime.getFullYear() + 5));
                fish.require("Calendar", function() {
                    var $cal = new fish.Calendar({
                        skin: "white",
                        startDate: fish.parseTime(startTime),
                        endDate: fish.parseTime(endTime)
                    });
                    jjtxObj.$cal = $cal;
                    fish.one(".ylc-modal-priceremind #iptPrnStartTime").on("click", function() {
                        fish.one(this).addClass("ylc-calendar-target");
                        var _endTime = fish.trim(fish.one(".ylc-modal-priceremind #iptPrnEndTime").val());
                        if (_endTime.length) endTime = fish.parseDate(_endTime, { days: -1 });
                        $cal.pick({
                            elem: this,
                            currentDate: startTime,
                            startDate: new Date(),
                            endDate: endTime,
                            fn: function(year, month, date, td, input) {
                                fish.one(this.elem).removeClass("placeholder");
                                fish.one(".ylc-modal-priceremind #iptPrnEndTime").removeClass("placeholder");
                                var _startTime = fish.parseTime(fish.one(input).val(), { days: 1 });
                                var _endTime = new Date();
                                endTime = new Date(_endTime.setFullYear(_endTime.getFullYear() + 5));
                                $cal.pick({
                                    elem: fish.dom(".ylc-modal-priceremind #iptPrnEndTime"),
                                    startDate: _startTime,
                                    currentDate: [_startTime],
                                    endDate: endTime
                                });
                            }
                        });
                    });
                    fish.one(".ylc-modal-priceremind #iptPrnEndTime").on("click", function() {
                        fish.one(this).addClass("ylc-calendar-target");
                        var _startTime = fish.trim(fish.one(".ylc-modal-priceremind #iptPrnStartTime").val());
                        if (_startTime.length) startTime = fish.parseDate(_startTime, { days: 1 });
                        var _endTime = new Date();
                        endTime = new Date(_endTime.setFullYear(_endTime.getFullYear() + 5));
                        $cal.pick({
                            elem: this,
                            startDate: startTime,
                            endDate: endTime,
                            fn: function(year, month, date, td, input) {
                                fish.one(this.elem).removeClass("placeholder");
                            }
                        });
                    })
                });
            });
            fish.all(".ylc-modal-priceremind #iptPrnName").once("jjtxObj", function() {
                function isNameOk() {
                    var regex = /^[^@\/\'\\\"#$%&\^\*\(!\^\*\;\:\>\<\-\|]+$/;
                    return regex.test(arguments[0]);
                };
                fish.one(this).on("focus", _inputIn).on("input", _inputIn)
                    .on("keydown", _inputIn).on("keyup", _inputIn)
                    .on("blur", _inputOut).on("change", _inputOut)
                    .on("change", function() {
                        var val = fish.trim(fish.one(this).val() || "");
                        fish.one(this).removeClass("error");
                        if (val.length) {
                            if (val.length > 30 || !isNameOk(val)) {
                                fish.one(this).addClass("error");
                            }
                        }
                    });
            });
            fish.all(".ylc-modal-priceremind #iptPrnPhone").once("jjtxObj", function() {
                function isMobile() {
                    var regex = /^1[34578][0-9]\d{8,8}$/;
                    return regex.test(arguments[0]);
                }
                fish.one(this).on("focus", _inputIn).on("input", _inputIn)
                    .on("keydown", _inputIn).on("keyup", _inputIn)
                    .on("blur", _inputOut).on("change", _inputOut)
                    .on("change", function() {
                        var val = fish.trim(fish.one(this).val() || "");
                        fish.one(this).removeClass("error");
                        fish.one(".prn-err", this.parentNode).css("display:none;");
                        if (!(val.length && val.length < 31 && isMobile(val))) {
                            fish.one(this).addClass("error");
                            fish.one(".prn-err", this.parentNode).css("display:block;");
                        }
                    });
            });
            fish.one(".pri-rem-notice .ylc-m-ok").once("jjtxObj", function() {
                fish.one(this).on("click", function() {
                    jjtxObj.submitFn.call(jjtxObj);
                });
            });
            fish.one(".pri-rem-ok .ylc-m-ok").once("jjtxObj", function() {
                fish.one(this).on("click", function() {
                    fish.mPop.close();
                });
            });
            fish.one(".pri-rem-fail .ylc-m-ok").once("jjtxObj", function() {
                fish.one(this).on("click", function() {
                    fish.mPop.close();
                    fish.mPop({
                        content: fish.one(".pri-rem-notice"),
                        beforeClose: function() {
                            jjtxObj.$cal.hide();
                        }
                    });
                    //jjtxObj.submitFn.call(jjtxObj);
                });
            });
            fish.one(".pri-rem-notice").once("jjtxObj", function() {
                fish.one(this).on("click", function(e) {
                    var $tar = fish.one(fish.getTarget(e)),
                        flag = false,
                        $cal = jjtxObj.$cal;
                    flag = flag || $tar.hasClass("ylc-calendar-target");
                    flag = flag || $tar.hasClass("calendar-panel");
                    flag = flag || $tar.parent(".calendar-panel").length > 0;
                    flag = flag && $tar.parent(".ylc-modal-priceremind").length > 0;
                    if (!flag && $cal && $cal.hide) $cal.hide();
                });
            });
        },
        submitFn: function() {
            function isNameOk() {
                var regex = /^[^@\/\'\\\"#$%&\^\*\(!\^\*\;\:\>\<\-\|]+$/;
                return regex.test(arguments[0]);
            };

            function isMobile() {
                var regex = /^1[34578][0-9]\d{8,8}$/;
                return regex.test(arguments[0]);
            };
            var settings = "expectedPrice={0}&startDate={1}&endDate={2}&customerName={3}&customerMobile={4}",
                arr = [],
                flag = true;
            var elem = fish.one(".ylc-modal-priceremind #iptPrnPrice").val();
            elem = isNaN(elem) ? 1 : elem < 1 ? 1 : elem > 999999 ? 999999 : elem;
            arr.push(elem);
            elem = fish.trim(fish.one(".ylc-modal-priceremind #iptPrnStartTime").val());
            arr.push(elem);
            elem = fish.trim(fish.one(".ylc-modal-priceremind #iptPrnEndTime").val());
            arr.push(elem);
            elem = fish.trim(fish.one(".ylc-modal-priceremind #iptPrnName").val());
            fish.one(".ylc-modal-priceremind #iptPrnName").removeClass("error");
            if (elem.length) {
                if (elem.length > 30 || !isNameOk(elem)) {
                    flag = false;
                    fish.one(".ylc-modal-priceremind #iptPrnName").addClass("error");
                    arr.push("-");
                } else {
                    arr.push(elem);
                }
            } else {
                arr.push("-");
            }
            elem = fish.trim(fish.one(".ylc-modal-priceremind #iptPrnPhone").val());
            fish.one(".ylc-modal-priceremind #iptPrnPhone").removeClass("error");
            fish.one(".prn-err", fish.dom(".ylc-modal-priceremind #iptPrnPhone").parentNode).css("display:none;");
            if (!(elem.length && elem.length < 31 && isMobile(elem))) {
                flag = false;
                fish.one(".ylc-modal-priceremind #iptPrnPhone").addClass("error");
                fish.one(".prn-err", fish.dom(".ylc-modal-priceremind #iptPrnPhone").parentNode).css("display:block;");
                arr.push("-");
            } else {
                arr.push(elem);
            }
            if (!flag) return false;
            if (this.submitFn.ajaxObj) this.submitFn.ajaxObj.abort();
            this.submitFn.ajaxObj = fish.ajax({
                url: "/youlun/CruiseRequireOrder/FinalPageRequireOrder.ashx",
                openType: "post",
                data: settings.format.apply(settings, arr),
                fn: function(data) {
                    fish.mPop.close();
                    if (data == "suc") {
                        fish.mPop({
                            content: fish.one(".pri-rem-ok")
                        });
                    }
                    if (data.indexOf("fail") >= 0) {
                        fish.mPop({
                            content: fish.one(".pri-rem-fail")
                        });
                    }
                },
                err: function() {
                    fish.mPop.close();
                    fish.mPop({
                        content: fish.one(".pri-rem-fail")
                    });
                }
            });
        }
    });
    fish.ready(function() {
        jjtxObj.init();
    });
}(fish, window, document);

/*** 降价提醒 end ***/




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
            fish.one(".dl_tj_cos dl.is_adjust dd span.is_check_adjust").removeClass("is_checked");
            fish.one(".dl_tj_cos dl dd input.input_is_adjust").val(0);
            fish.all(".dl_tj_cos dl dd").removeClass("has_error");


            //重置验证码
            this.codeObj.resetCode();
        },
        //绑定全局事件
        bindEvent: function() {
            var that = this,
                $subBut = fish.one(".dl_tj_cos a.sub_data"),
                $allInput = fish.all(".dl_tj_cos dl.eve_yusuan dd input,.dl_tj_cos dl.cust_name dd input,.dl_tj_cos dl.cust_mobile dd input,.dl_tj_cos dl.code dd input"),
                $otherButFlag = fish.one(".dl_tj_cos dl.is_adjust dd span.is_check_adjust"),
                $otherButInput = fish.one(".dl_tj_cos dl dd input.input_is_adjust");
            this.inputObj.bindPlaceHolder($allInput);
            //出游人数
            this.inputObj.filterKeyUp(fish.one(".dl_tj_cos dl.travel_num dd input"), "[^\\d]", 3);
            //人均预算
            this.inputObj.filterKeyUp(fish.one(".dl_tj_cos dl.eve_yusuan dd input"), "[^\\d]", 13);
            //提交数据
            $subBut.on("click", function() {
                if ($subBut.hasClass("sub_no_act")) return false;
                if (that.subCheck()) {
                    fish.one("#hidFinalLineId").val(fish.one("#HidLineid").val());
                    // fish.one("#hidTjBeginDate").val(fish.one("#HidDate").val());
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
            fish.one(".price_btn .but_tjyy").on("click", function() {
                // console.log(this)
                //弹出新框....统计保留 如果公共导航条不存在，继续获取以前的

                var $sPrice = fish.dom(".ylc-nav .ylc-special-price");
                if ($sPrice) {
                    $sPrice.click();
                    that.statcClick();
                    return false;
                }

                var priceInput = fish.one(".dl_tj_cos dl.eve_yusuan dd input"),
                    showPrice = fish.one("#hidRate").val();
                if (priceInput.hasClass("place_holder") && priceInput.val() == priceInput.attr("_placeholder")) {
                    priceInput.val(showPrice);
                }
                priceInput.attr("_placeholder", showPrice);
                that.formConBox.show();
                that.statcClick();
            });

            //是否接受其他航次
            $otherButFlag.on("click", function() {
                if ($otherButFlag.hasClass("is_checked")) {
                    $otherButFlag.removeClass("is_checked");
                    $otherButInput.val(0);
                } else {
                    $otherButFlag.addClass("is_checked");
                    $otherButInput.val(1);
                }
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
                str += '&' + thisName + '=' + encodeURIComponent(fish.trim(thisVal));
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

//邮轮终页埋点统计
;
(function(win) {
    //埋点事件
    function detialTrackEvent(sLabel, sValueObj) {
        //因为汉字无需URI编码 故还原回去
        sValueObj.k && (sValueObj.k = decodeURIComponent(sValueObj.k));
        sValueObj.ct && (sValueObj.ct = decodeURIComponent(sValueObj.ct));
        if (!sLabel || !sLabel.trim()) return false;
        var str = "";
        for (key in sValueObj) {
            if (sValueObj[key] !== null && sValueObj[key] !== undefined && sValueObj[key] !== "") {
                str += "|*|" + key + ":" + sValueObj[key];
            }
        }
        try {
            str.length > 0 && (str = str + "|*|");
            _tcTraObj._tcTrackEvent("search", "/cruises/detail", sLabel, str);
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
                detialTrackEvent(g.lable, g.value);
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


    var goLineId = fish.one("#HidLineid").val();

    //详情显示事件
    trackEventUseCookie({
        lable: "/show",
        type: 2,
        value: {
            resId: goLineId
        }
    });
    //点击进预订页面
    fish.all(".ele_topDom .link_order,.fix_order .fix_order_link").each(function(elem, i) {
        elem.index = i;
        fish.one(elem).on("click", function(evt) {
            detialTrackEvent("/book", {
                pos: this.index - 0 + 1,
                pjId: "2007",
                resId: goLineId
            });
        });
    });
    win.searchTrackEvent = detialTrackEvent;
    win.trackEventUseCookie = trackEventUseCookie;
})(window);
