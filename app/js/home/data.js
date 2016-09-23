//pc终页 抓取页面静态数据集合
;
! function(F, window, document, undefined) {
    define([], function() {
        function _fn(id) {
            return F.trim(F.one("#" + id).val());
        }
        return {
            lineId: _fn("hidLineId"), // 线路id
            lineDate: _fn("hidLineDate"), //航期
            transPort: _fn("hidTransport"), //途径港口
            cruiseId: _fn("hidCruiseId"), //邮轮id
            cruiseName: _fn("hidCruiseName"), //邮轮名称
            companyId: _fn("hidCompanyId"), //邮轮公司id
            companyName: _fn("hidCompanyName"), //邮轮公司名称
            routeId: _fn("hidRouteId"), //航线id
            dataSourceFrom: _fn("hidDataSourceFrom"), //数据来源 0:同程自制；1：icruises抓取（单船票）
            sourceType: _fn("hidSourceType"), //线路资源类型：0-无；1-包船；2-分销；
            tourType: _fn("hidTourType"), //出游类型：0,国内游；1出境游；2长线
            productType: _fn("hidProductType"), // 线路产品分类 22：团队游  23：单船票
            isUsedPriceInland: _fn("hidIsUsedPriceInland"), //是否启用国内价格 0:否 1：是
            isLYDedicated: _fn("hidIsLYDedicated"), // 是否同程专线 0:否  1：是
            isMoreLineDate: _fn("hidIsMoreLineDate"), // 是否多航期 0：否 1：是
            topicId: "285", //专题id
            moduleId: "800" //模块id
        }
    });


}(fish, window, window.document);
