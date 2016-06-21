! function(Rjs, R) {
    R.config({
    	baseUrl:"http://10.101.32.54/mdat/dist/common/curise-nav/scripts/",
        shim: {
            fish: { exports: 'fish' },
            "fish.once": ["fish"]/*,
            "a":["common-nav.3.1"],
            "b":["common-nav.3.1"],
            "c":["common-nav.3.1"],
            "d":["common-nav.3.1"]*/
        },
        paths: {
            "fish": "http://js.40017.cn/cn/min/??/cn/public/fish.1.4.7.js,/cn/public/fc.1.1.7.js?v=2015021101",
            "fish.once":"http://js.40017.cn/cn/min/??/cn/y/15/h/fish.once.js?v=2015121502",
            "curise.until": "http://js.40017.cn/cn/min/??/touch/cn/y/15/c/syt.js?v=2015121501"
        }
    });

    R(['fish',"common-nav.3.1","fish.once"],function(F){
    	R(["a","b","c","d"],function(A,B,C,D){
            F.one(".ylc-nav .ylc-gotop").once("ylcNavObj", function() {
                F.one(this).on("click",A.gotop);
            });
            
            F.one(window).on("scroll",B.isPosition);
            console.log(D);
        })
    })
}(requirejs, require);
