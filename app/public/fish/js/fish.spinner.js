/*
 * file fish.spinner.js  fish.spinner是基于fish的微调器
 * require fish.js
 * description 邮轮项目研发部 营销组的微调器
 * Author syt4528@ly.com
 * time 2016-07-24
 * 
 */
;
! function(F, window, document, undefined) {
    var settings = {
        name: '',
        min: 0, //默认最小值
        max: 99, //默认最大值
        readonly: false, //是否可以手动修改
        value: 1, //默认值
        increase: 1, //每次加或减的变化量（不满就用最大值）
        //回调
        minus: false,
        plus: false,
        change: false,
        init: false
    };
    var Spinner = function(target, options) {
        this.$target = F.all(target);
        try {
            this.opts = this.opts || {};
            F.lang.extend(this.opts, settings);
            F.lang.extend(this.opts, options);
            this.opts.min = insureInt(this.opts.min);
            this.opts.max = insureInt(this.opts.max);
            this.opts.value = insureInt(this.opts.value);
            this.opts.increase = insureInt(this.opts.increase);
            if (this.$target[0]) this.init();
        } catch (ex) {
            console.error("Spinner>init", ex.message);
        }
    }
    Spinner.prototype.init = function() {
        var that = this,
            minusBtn, valueInput, plusBtn, val;
        F.all(".ui-spinner", this.$target).html("remove");
        this.$target.html("bottom", "<div class='ui-spinner'>" +
            "<a href='javascript:;' class='ui-spinner-btn ui-spinner-minus'><i></i></a>" +
            "<input type='text' class='ui-spinner-input'>" +
            "<a href='javascript:;' class='ui-spinner-btn ui-spinner-plus'><i></i></a></div>");
        minusBtn = F.all(".ui-spinner .ui-spinner-btn.ui-spinner-minus", this.$target);
        valueInput = F.all(".ui-spinner .ui-spinner-input", this.$target);
        plusBtn = F.all(".ui-spinner .ui-spinner-btn.ui-spinner-plus", this.$target);
        if (this.opts.min <= this.opts.max) {
            if (this.opts.min >= this.opts.value)
                minusBtn.addClass("ui-spinner-minus-disabled disabled");
            if (this.opts.max <= this.opts.value)
                plusBtn.addClass("ui-spinner-plus-disabled disabled");
            val = Math.min(Math.max(this.opts.min, this.opts.value), this.opts.max);
            valueInput.attr("val-attr", val).val(val);
            this.opts.value = val;
        } else {
            minusBtn.addClass("ui-spinner-minus-disabled disabled");
            plusBtn.addClass("ui-spinner-plus-disabled disabled");
            val = Math.min(this.opts.min, this.opts.max, this.opts.value);
            valueInput.attr("val-attr", val).val(val);
            valueInput.addClass("disabled");
            this.opts.value = val;
        }
        valueInput.attr("min-attr", this.opts.min).attr("max-attr", this.opts.max).attr("name", this.opts.name);
        if (this.opts.readonly) valueInput.attr("readonly", "readonly");
        F.lang.extend(this, { minusBtn: minusBtn, valueInput: valueInput, plusBtn: plusBtn });
        this.minusBtn.on("click", function() {
            var $this = F.one(this),
                val;
            if ($this.hasClass("disabled")) return;

            val = insureInt(that.valueInput.val());
            val -= that.opts.increase;
            val = Math.min(Math.max(that.opts.min, val), that.opts.max);
            that.valueInput.val(val);
            that.change.call(that);
            if (that.opts.minus && isFunction(that.opts.minus)) {
                that.opts.minus.call(that, $this);
            }
        });
        this.plusBtn.on("click", function() {
            var $this = F.one(this),
                val;
            if ($this.hasClass("disabled")) return;

            val = insureInt(that.valueInput.val());
            val += that.opts.increase;
            val = Math.min(Math.max(that.opts.min, val), that.opts.max);
            that.valueInput.val(val);
            that.change.call(that);
            if (that.opts.plus && isFunction(that.opts.plus)) {
                that.opts.plus.call(that, $this);
            }
        });

        this.valueInput.on("blur", function() {
            var $this = F.one(this);
            if ($this.hasClass("disabled")) {
                that.valueInput.val(that.valueInput.attr("val-attr"));
                return;
            }
            that.change.call(that);
        });
        if (this.opts.init && isFunction(this.opts.init)) {
            this.opts.init.call(this);
        }
        return this;
    };
    Spinner.prototype.change = function() {
        var val = insureInt(this.valueInput.val()),
            _val = insureInt(this.valueInput.attr('val-attr'));
        if (val == _val) return;
        val = Math.min(Math.max(this.opts.min, val), this.opts.max);
        this.opts.value = val;
        this.valueInput.attr("val-attr", val);
        this.valueInput.val(val);
        if (this.opts.min >= this.opts.value)
            this.minusBtn.addClass("ui-spinner-minus-disabled disabled");
        else
            this.minusBtn.removeClass("ui-spinner-minus-disabled disabled");

        if (this.opts.max <= this.opts.value)
            this.plusBtn.addClass("ui-spinner-plus-disabled disabled");
        else
            this.plusBtn.removeClass("ui-spinner-plus-disabled disabled");
        if (this.opts.change && isFunction(this.opts.change)) {
            this.opts.change.call(this);
        }
    };
    Spinner.prototype.set = function() {
        if (!this.valueInput) return false;
        if (this.valueInput.hasClass("disabled")) return;
        val = isNaN(parseInt(val)) ? 0 : parseInt(val);
        this.valueInput.val(val);
        this.change();
    };
    Spinner.prototype.get = function() {
        if (!this.opts) return NaN; //容错作用域
        return this.opts.value;
    }
    Spinner.prototype.reset = function(options) {
        if (!this.opts) return false; //容错作用域
        F.lang.extend(this.opts, options);
        if (this.$target[0]) this.init();
    };

    function insureInt(arg) {
        return isNaN(parseInt(arg)) ? 0 : parseInt(arg);
    };

    function isFunction(fn) {
        return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + "");
    };

    F.extend({
        spinner: Spinner
    });
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return Spinner;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Spinner;
    }

}(fish, window, document)
