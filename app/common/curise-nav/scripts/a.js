define("a", ["fish"], function(F) {
    function goTop() {
        //alert("回到顶部事件");
        F.dom("body").scrollTop = 0;
        F.dom("html").scrollTop = 0;
    };
    return {
        gotop: goTop
    }
});
