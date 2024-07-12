(function() {
    var environment = window.location.href;
    var pagesToOpen = [];

    chrome.storage.sync.get("pagesToOpen", function(data) {
        if (data.pagesToOpen) {
            pagesToOpen = data.pagesToOpen.map(page => "&mi=" + page);
        } else {
            pagesToOpen = [
                "&mi=EcoResProductDetailsExtendedGrid",
                "&mi=CaseListPage",
                "&mi=smmActivitiesListPage",
                "&mi=PurchTableListPage",
                "&mi=VendTableListPage",
                "&mi=CustTableListPage",
                "&mi=SalesQuotationListPage",
                "&mi=SalesTableListPage",
                "&mi=LedgerJournalTable3",
                "&mi=WHSLoadPlanningListPage",
                "&mi=SalesOrderProcessingWorkspace",
                "&mi=WHSShipPlanningListPage",
                "&mi=WHSWorkTableListPage",
                "&mi=WMSArrivalOverview",
                "&mi=InventOnhandItem",
                "&mi=SalesReleaseOrderPicking",
                "&mi=WMSPickingRegistration",
                "&mi=ProdTableListPage",
                "&mi=ReqPOGridView",
                "&mi=ReqSupplyDemandSchedule",
                "&mi=ProjProjectsListPage",
                "&mi=SalesQuotationsListPage_Proj",
                "&mi=SMAServiceOrderTableListPage",
                "&mi=SMAAgreementTableListPage",
                "&mi=ReqCreatePlanWorkspace",
                "&mi=SalesOrderProcessingWorkspace",
                "&mi=CostAnalysisWorkspace",
                "&mi=JmgShopSupervisorWorkspace",
                "&mi=ProjManagementWorkspace",
                "&mi=HcmEmployeeSelfServiceWorkspace"
            ];
        }

        chrome.storage.sync.get("shouldClosePages", function(data) {
            var shouldClosePages = data.shouldClosePages || false;
            pagesToOpen.forEach(function(page) {
                var openedWindow = window.open(environment + page, "_blank");
                if (shouldClosePages) {
                    openedWindow.addEventListener('load', function() {
                        openedWindow.close();
                    });
                }
            });
        });
    });
})();
