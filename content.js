(function() {
    var environment = window.location.href;
    var pagesToOpen = [];

    chrome.storage.sync.get("pagesToOpen", function(data) {
        if (data.pagesToOpen) {
            pagesToOpen = data.pagesToOpen;
        } else {
            pagesToOpen = [
                { page: "EcoResProductDetailsExtendedGrid", company: "USMF" },
                { page: "CaseListPage", company: "USMF" },
                { page: "smmActivitiesListPage", company: "USMF" },
                { page: "PurchTableListPage", company: "USMF" },
                { page: "VendTableListPage", company: "USMF" },
                { page: "CustTableListPage", company: "USMF" },
                { page: "SalesQuotationListPage", company: "USMF" },
                { page: "SalesTableListPage", company: "USMF" },
                { page: "LedgerJournalTable3", company: "USMF" },
                { page: "WHSLoadPlanningListPage", company: "USMF" },
                { page: "SalesOrderProcessingWorkspace", company: "USMF" },
                { page: "WHSShipPlanningListPage", company: "USMF" },
                { page: "WHSWorkTableListPage", company: "USMF" },
                { page: "WMSArrivalOverview", company: "USMF" },
                { page: "InventOnhandItem", company: "USMF" },
                { page: "SalesReleaseOrderPicking", company: "USMF" },
                { page: "WMSPickingRegistration", company: "USMF" },
                { page: "ProdTableListPage", company: "USMF" },
                { page: "ReqPOGridView", company: "USMF" },
                { page: "ReqSupplyDemandSchedule", company: "USMF" },
                { page: "ProjProjectsListPage", company: "USMF" },
                { page: "SalesQuotationsListPage_Proj", company: "USMF" },
                { page: "SMAServiceOrderTableListPage", company: "USMF" },
                { page: "SMAAgreementTableListPage", company: "USMF" },
                { page: "ReqCreatePlanWorkspace", company: "USMF" },
                { page: "SalesOrderProcessingWorkspace", company: "USMF" },
                { page: "CostAnalysisWorkspace", company: "USMF" },
                { page: "JmgShopSupervisorWorkspace", company: "USMF" },
                { page: "ProjManagementWorkspace", company: "USMF" },
                { page: "HcmEmployeeSelfServiceWorkspace", company: "USMF" }
            ];
        }

        chrome.storage.sync.get("shouldClosePages", function(data) {
            var shouldClosePages = data.shouldClosePages || false;
            pagesToOpen.forEach(function(entry) {
                var pageUrl = environment + "&mi=" + entry.page + "&cmp=" + entry.company;
                var openedWindow = window.open(pageUrl, "_blank");
                if (shouldClosePages) {
                    openedWindow.addEventListener('load', function() {
                        openedWindow.close();
                    });
                }
            });
        });
    });
})();
