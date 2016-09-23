    //点评埋点统计
;
! function(R,F, window, document, undefined) {
    define([], function() {
        //点评埋点
        function dpFnTrackEvent(sLabel,sValue){
            try{
                _tcTraObj._tcTrackEvent("309","6",sLabel,sValue);
            }catch(ex){
                
            }
        }
        return {
            dpFnTrackEvent:dpFnTrackEvent
        }
    });
}(requirejs,fish, window, window.document);