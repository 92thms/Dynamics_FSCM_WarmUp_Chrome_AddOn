document.addEventListener("DOMContentLoaded", function() {
    var openPagesButton = document.getElementById("openPages");
    var closePagesCheckbox = document.getElementById("closePagesCheckbox");
    var pagesToOpenList = document.getElementById("pagesToOpenList");
    var newPageInput = document.getElementById("newPageInput");
    var addPageButton = document.getElementById("addPage");
    var restoreDefaultsButton = document.getElementById("restoreDefaults");
    var exportPagesButton = document.getElementById("exportPages");
    var importPagesButton = document.getElementById("importPages");
    var importPagesFile = document.getElementById("importPagesFile");
    var prevPageButton = document.getElementById("prevPage");
    var nextPageButton = document.getElementById("nextPage");
    var pageInfo = document.getElementById("pageInfo");

    var defaultPagesToOpen = [
        "EcoResProductDetailsExtendedGrid",
        "CaseListPage",
        "smmActivitiesListPage",
        "PurchTableListPage",
        "VendTableListPage",
        "CustTableListPage",
        "SalesQuotationListPage",
        "SalesTableListPage",
        "LedgerJournalTable3",
        "WHSLoadPlanningListPage",
        "SalesOrderProcessingWorkspace",
        "WHSShipPlanningListPage",
        "WHSWorkTableListPage",
        "WMSArrivalOverview",
        "InventOnhandItem",
        "SalesReleaseOrderPicking",
        "WMSPickingRegistration",
        "ProdTableListPage",
        "ReqPOGridView",
        "ReqSupplyDemandSchedule",
        "ProjProjectsListPage",
        "SalesQuotationsListPage_Proj",
        "SMAServiceOrderTableListPage",
        "SMAAgreementTableListPage",
        "ReqCreatePlanWorkspace",
        "SalesOrderProcessingWorkspace",
        "CostAnalysisWorkspace",
        "JmgShopSupervisorWorkspace",
        "ProjManagementWorkspace",
        "HcmEmployeeSelfServiceWorkspace"
    ];

    var currentPage = 1;
    var itemsPerPage = 15;
    var pages = [];

    function updatePagesList() {
        pagesToOpenList.innerHTML = "";
        var start = (currentPage - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var paginatedPages = pages.slice(start, end);

        paginatedPages.forEach(function(page, index) {
            var pageItem = document.createElement("div");
            pageItem.className = "page-item";
            pageItem.innerHTML = `
                <span>${page}</span>
                <button class="removePage" data-index="${start + index}">X</button>
            `;
            pagesToOpenList.appendChild(pageItem);
        });

        document.querySelectorAll(".removePage").forEach(function(button) {
            button.addEventListener("click", function() {
                var index = this.getAttribute("data-index");
                pages.splice(index, 1);
                chrome.storage.sync.set({ "pagesToOpen": pages });
                updatePagesList();
                updatePagination();
            });
        });

        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(pages.length / itemsPerPage)}`;
    }

    function updatePagination() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(pages.length / itemsPerPage);
    }

    chrome.storage.sync.get(["shouldClosePages", "pagesToOpen"], function(data) {
        closePagesCheckbox.checked = data.shouldClosePages || false;
        pages = data.pagesToOpen || defaultPagesToOpen;
        updatePagesList();
        updatePagination();
    });

    openPagesButton.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.storage.sync.set({ "shouldClosePages": closePagesCheckbox.checked });
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
            });
        });
    });

    addPageButton.addEventListener("click", function() {
        var newPage = newPageInput.value.trim();
        if (newPage) {
            pages.push(newPage);
            chrome.storage.sync.set({ "pagesToOpen": pages });
            newPageInput.value = "";
            updatePagesList();
            updatePagination();
        }
    });

    restoreDefaultsButton.addEventListener("click", function() {
        pages = defaultPagesToOpen;
        chrome.storage.sync.set({ "pagesToOpen": pages });
        updatePagesList();
        updatePagination();
    });

    exportPagesButton.addEventListener("click", function() {
        var pagesToExport = pages.join("\n");
        var blob = new Blob([pagesToExport], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "pagesToOpen.txt";
        a.click();
        URL.revokeObjectURL(url);
    });

    importPagesButton.addEventListener("click", function() {
        importPagesFile.click();
    });

    importPagesFile.addEventListener("change", function() {
        var file = importPagesFile.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var importedPages = e.target.result.split("\n").map(function(page) {
                    return page.trim();
                }).filter(function(page) {
                    return page.length > 0;
                });
                pages = importedPages;
                chrome.storage.sync.set({ "pagesToOpen": pages });
                updatePagesList();
                updatePagination();
            };
            reader.readAsText(file);
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        var url = activeTab.url;
        if (url.includes("dynamics.com")) {
            openPagesButton.disabled = false;
            closePagesCheckbox.disabled = false;
        }
    });

    prevPageButton.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagesList();
            updatePagination();
        }
    });

    nextPageButton.addEventListener("click", function() {
        if (currentPage < Math.ceil(pages.length / itemsPerPage)) {
            currentPage++;
            updatePagesList();
            updatePagination();
        }
    });

    // Speichern Sie den Zustand des Kontrollkästchens sofort, wenn es geändert wird
    closePagesCheckbox.addEventListener("change", function() {
        chrome.storage.sync.set({ "shouldClosePages": closePagesCheckbox.checked });
    });
});
