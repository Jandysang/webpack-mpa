define("b",["fish"],function(F) {
	function isPosition(){
		var scrollTop=F.one(window).scrollTop(),dest=F.one(window).height();

		if(scrollTop>dest){
			F.one(".ylc-nav .ylc-gotop").css("visibility:visible;")
		}else{
			F.one(".ylc-nav .ylc-gotop").css("visibility:hidden;")
		}
	}
	return {
		isPosition:isPosition
	};
})