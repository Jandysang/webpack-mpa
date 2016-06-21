define("a", ["fish"], function (F) {
    function goTop() {
        //alert("回到顶部事件");
        F.dom("body").scrollTop = 0;
        F.dom("html").scrollTop = 0;
    };
    return {
        gotop: goTop
    };
});;define("b", ["fish"], function (F) {
	function isPosition() {
		var scrollTop = F.one(window).scrollTop(),
		    dest = F.one(window).height();

		if (scrollTop > dest) {
			F.one(".ylc-nav .ylc-gotop").css("visibility:visible;");
		} else {
			F.one(".ylc-nav .ylc-gotop").css("visibility:hidden;");
		}
	}
	return {
		isPosition: isPosition
	};
});;define('c', ["fish"], function (F) {
	return {
		timer: 1000 * 10,
		anthor: "syt4528"
	};
});;define("d", ["fish"], function (F) {
	return "123123123";
});