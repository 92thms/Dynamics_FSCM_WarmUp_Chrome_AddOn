document.addEventListener("DOMContentLoaded", function() {
    var openPagesButton = document.getElementById("openPages");
    var closePagesCheckbox = document.getElementById("closePagesCheckbox");
    var pagesToOpenList = document.getElementById("pagesToOpenList");
    var newPageInput = document.getElementById("newPageInput");
    var newCompanyInput = document.getElementById("newCompanyInput");
    var addPageButton = document.getElementById("addPage");
    var restoreDefaultsButton = document.getElementById("restoreDefaults");
    var exportPagesButton = document.getElementById("exportPages");
    var importPagesButton = document.getElementById("importPages");
    var importPagesFile = document.getElementById("importPagesFile");
    var prevPageButton = document.getElementById("prevPage");
    var nextPageButton = document.getElementById("nextPage");
    var pageInfo = document.getElementById("pageInfo");

    var defaultPagesToOpen = [
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

    var currentPage = 1;
    var itemsPerPage = 15;
    var pages = [];

    function updatePagesList() {
        pagesToOpenList.innerHTML = "";
        var start = (currentPage - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var paginatedPages = pages.slice(start, end);

        paginatedPages.forEach(function(entry, index) {
            var pageItem = document.createElement("div");
            pageItem.className = "page-item";
            pageItem.innerHTML = `
                <span>${entry.page} (Company: ${entry.company})</span>
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
        var newCompany = newCompanyInput.value.trim() || "USMF";
        if (newPage) {
            pages.push({ page: newPage, company: newCompany });
            chrome.storage.sync.set({ "pagesToOpen": pages });
            newPageInput.value = "";
            newCompanyInput.value = "";
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
        var pagesToExport = pages.map(entry => `${entry.page},${entry.company}`).join("\n");
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
                var importedPages = e.target.result.split("\n").map(function(line) {
                    var parts = line.split(",");
                    return { page: parts[0].trim(), company: parts[1] ? parts[1].trim() : "USMF" };
                }).filter(function(entry) {
                    return entry.page.length > 0;
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

    closePagesCheckbox.addEventListener("change", function() {
        chrome.storage.sync.set({ "shouldClosePages": closePagesCheckbox.checked });
    });
});
