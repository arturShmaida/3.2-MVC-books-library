"use strict";
$('.sidebar_item').on("click", function (event) {
    event.preventDefault();
    var filter = $(this).attr('data-filter');
    if (!filter) {
        filter = "";
        console.log("Filter is empty value");
    }
    console.log("sidebar interaction");
    $('#search').val('');
    setSidebarActiveButton($(this), filter);
    (function () {
        var data = {
            filter: filter || 'new',
            offset: getParameterByName('offset', undefined) || "",
            limit: globalVar.items_limit_on_page_load
        };
        loadIndexPage(data);
        isScrollRunning = false;
    }());
});
function changeHistoryStateWithParams(action, filter, count) {
    console.log("Change history");
    console.log(action, count, filter);
    if (action = '') {
        return;
    }
    if (typeof count === "string") {
        count = parseInt(count);
    }
    if (typeof count === "string") {
        count = parseInt(count);
    }
    var queryString = '?filter=' + filter + '&count=' + count;
    if (action === 'push') {
        window.history.pushState('', '', queryString);
    }
    else {
        window.history.replaceState('', '', queryString);
    }
}
