"use strict";
var drawItemsOnScroll, drawItemsOnNextPage, drawItemsOnPreviousPage, isScrollRunning = false;
console.log(isScrollRunning);
$(function () {
    (function () {
        let filter = getParameterByName('filter', undefined);
        console.log("filter: " + filter);
        let data = {
            filter: getParameterByName('filter', undefined) || "new",
            offset: getParameterByName('offset', undefined) || 0,
            limit: globalVar.items_limit_on_page_load // Changed here
        };
        console.group("on load: ");
        setSidebarActiveButton(null, data.filter);
        console.log("sending:");
        console.log(data);
        doAjaxQuery('GET', 'http://localhost:3000/api/v1/books', data, function (res) {
            console.log('qindex');
            if (!!res.data) {
                console.log("receive: ");
                console.log(res);
                view.addBooksItems(res.data.books, false);
                changeHistoryStateWithParams('push', res.filter, res.offset + res.data.books.length);
                drawItemsOnNextPage = initDrawItemsOnNextPage(res.data.total.amount);
                drawItemsOnPreviousPage = initDrawItemsOnPreviousPage(res.data.total.amount);
                updatePageBtnState(res.offset, res.data.total.amount);
                // drawItemsOnScroll = initDrawItemsOnScroll(res.data.total.amount);
                if (localStorage.getItem('h')) {
                    $(window).scrollTop(Number(localStorage.getItem('h')));
                    localStorage.removeItem('h');
                }
            }
        });
    }());
    $('#content').on('click', '.book', function () {
        localStorage.setItem('h', String($(window).scrollTop()));
    });
    $("#page-controls").on('click', "#nextBtn", function () {
        if (!!drawItemsOnNextPage) {
            drawItemsOnNextPage();
        }
    });
    $("#page-controls").on('click', "#prevBtn", function () {
        if (!!drawItemsOnPreviousPage) {
            drawItemsOnPreviousPage();
        }
    });
    $(document).on("scroll", (function () {
        let documentHeight = $(document).height();
        let windowScrollTop = $(window).scrollTop();
        let windowHeight = $(window).height();
        if (!!documentHeight && !!windowScrollTop && !!windowHeight) {
            if (((documentHeight - windowScrollTop) < (2 * windowHeight)) && !isScrollRunning) {
                isScrollRunning = true;
                if (drawItemsOnScroll) {
                    drawItemsOnScroll();
                }
            }
        }
    }));
});
function getParameterByName(name, url) {
    if (!url) {
        url = $(location).attr('href');
    }
    console.log(url);
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results;
    if (url) {
        results = regex.exec(url);
    }
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function initDrawItemsOnNextPage(maxItems) {
    return function () {
        let offsetString = getParameterByName('count', undefined);
        console.log("OffsetString: " + offsetString);
        let offset;
        if (!!offsetString) {
            offset = parseInt(offsetString);
        }
        else {
            offset = globalVar.items_limit_on_page_load;
        }
        console.log(`Press next: 
        clean load, offset: ${offset}`);
        offset = offset;
        let limit = globalVar.items_limit_on_page_load;
        console.log("offset on next" + offset);
        if (offset < maxItems) {
            let requestData = {
                filter: getParameterByName("filter", undefined) || "new",
                limit: limit,
                offset: offset
            };
            doAjaxQuery('GET', '/api/v1/books', requestData, function (res) {
                let currentCountBooks = +res.offset + res.data.books.length;
                $("#loading").slideUp();
                isScrollRunning = false;
                view.addBooksItems(res.data.books, true); /// TODO: mb change back
                changeHistoryStateWithParams("replace", res.filter, currentCountBooks);
                updatePageBtnState(currentCountBooks, res.data.total.amount);
            });
            offset += limit;
        }
    };
}
function initDrawItemsOnPreviousPage(maxItems) {
    return function () {
        let countString = getParameterByName('count', undefined);
        let count;
        let offset;
        if (!!countString) {
            count = parseInt(countString);
        }
        else {
            count = 0;
        }
        let floatPage = count % globalVar.items_limit_on_page_load;
        console.log("floatPage: " + floatPage);
        console.log(floatPage);
        if (floatPage !== 0) {
            offset = count - floatPage;
            console.log("offset after calculation" + offset);
        }
        else {
            offset = count - globalVar.items_limit_on_page_load;
        }
        if (offset - globalVar.items_limit_on_page_load < globalVar.items_limit_on_page_load) {
            offset = 0;
        }
        else {
            offset = offset - globalVar.items_limit_on_page_load;
        }
        let requestData = {
            filter: getParameterByName("filter", undefined) || "new",
            limit: globalVar.items_limit_on_page_load,
            offset: offset
        };
        console.group("previous page request:");
        console.log(requestData);
        console.groupEnd();
        doAjaxQuery('GET', '/api/v1/books', requestData, function (res) {
            let currentCountBooks = offset + res.data.books.length;
            $("#loading").slideUp();
            isScrollRunning = false;
            view.addBooksItems(res.data.books, true); /// TODO: mb change back
            changeHistoryStateWithParams("replace", res.filter, currentCountBooks);
            updatePageBtnState(currentCountBooks, res.data.total.amount);
        });
    };
}
var initDrawItemsOnScroll = function (maxItems) {
    var maxNumOfItems = maxItems;
    let limit = 6;
    let offsetString = getParameterByName('count', undefined);
    let offset;
    if (!!offsetString) {
        offset = parseInt(offsetString);
    }
    else {
        offset = globalVar.items_limit_on_page_load;
    }
    return function () {
        if (offset < maxNumOfItems) {
            var data = {
                'filter': getParameterByName('filter', undefined) || "new",
                'limit': limit,
                'offset': offset
            };
            $("#loading").slideDown();
            doAjaxQuery('GET', '/api/v1/books', data, function (res) {
                console.log("ajax in drawon scroll");
                $("#loading").slideUp();
                isScrollRunning = false;
                view.addBooksItems(res.data.books, false); /// TODO: mb change back
                console.log("Before replacing history");
                changeHistoryStateWithParams("replace", res.filter, res.offset);
                console.log("After replacing history");
            });
            offset += limit;
        }
    };
};
function loadIndexPage(reqData) {
    doAjaxQuery('GET', 'http://localhost:3000/api/v1/books', reqData, function (res) {
        view.addBooksItems(res.data.books, true);
        changeHistoryStateWithParams('replace', res.filter, res.data.books.length);
        // drawItemsOnScroll = initDrawItemsOnScroll(res.data.total.amount);
        let totalCountBooks = res.data.total.amount;
        let currentCountBooks = getParameterByName("count", undefined);
        if (!!currentCountBooks) {
            currentCountBooks = parseInt(currentCountBooks);
        }
        else {
            currentCountBooks = 0;
        }
        updatePageBtnState(currentCountBooks, totalCountBooks);
    });
}
function updatePageBtnState(currentCount, totalCount) {
    if (currentCount < totalCount) {
        view.showElement("#nextBtn");
        if (currentCount <= globalVar.items_limit_on_page_load) {
            view.hideElement("#prevBtn");
        }
        else {
            view.showElement("#prevBtn");
        }
    }
    else if (currentCount === totalCount) {
        view.hideElement("#nextBtn");
        if (currentCount <= globalVar.items_limit_on_page_load) {
            view.hideElement("#prevBtn");
        }
    }
    else {
        view.showElement("#nextBtn");
        view.showElement("#prevBtn");
    }
}
function setSidebarActiveButton(activeElem, filterStringValue) {
    $('.sidebar_item').removeClass('active');
    if (activeElem) {
        activeElem.closest('a').addClass('active');
        return;
    }
    else {
        $('a[data-filter=' + filterStringValue + ']').addClass('active');
    }
}
