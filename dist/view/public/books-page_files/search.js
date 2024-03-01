"use strict";
var pathNameUrl;
let search;
console.log("location: " + location);
if (!!location) {
    pathNameUrl = window.location.pathname;
    search = window.location.search;
    console.log("pathNameUrl: " + pathNameUrl, "search:" + search);
    if (!!pathNameUrl) {
        pathNameUrl = pathNameUrl.split('/');
    }
    console.log("pathNameUrl after split: " + pathNameUrl);
}
let getPathUrl = (pathNameUrl) => {
    if (Array.isArray(pathNameUrl) && pathNameUrl[1] === 'admin') {
        return '/admin';
    }
    return "";
};
var pathUrl = getPathUrl(pathNameUrl);
/* ------------- The result of the search in autocomplete list --------------*/
var callbackQueryMiniItemsSearch = function (res, text) {
    $('.loader').show();
    if (res.data.total.amount > 0) {
        var books = res.data.books;
        view.addMiniItemsSearch(pathUrl, books, text);
    }
    else {
        view.addMiniItemsSearch(pathUrl, [{
                id: 'no-cover',
                title: 'По запросу "' + text + '" ничего не найдено :(',
                author: 'Миллионы натренированных обезьян облазили всю библиотеку и не нашли ничего подходящего, что могло бы соответствовать Вашему запросу.'
            }], "-");
    }
    setTimeout(function () {
        $('.loader').hide();
    }, 200);
};
/*-------------------The message on the search result -----------------------*/
var msgResultSearchText = function (text, number_found) {
    $('.text_found').text(text);
    var titles = ['совпадение', 'совпадения', 'совпадений'];
    var cases = [2, 0, 1, 1, 1, 2];
    var coincidence = titles[(number_found % 100 > 4 && number_found % 100 < 20) ? 2 :
        cases[(number_found % 10 < 5) ? number_found % 10 : 5]];
    $('.number_found').text(number_found + " " + coincidence);
};
/* ----------------------- Search result on the page ------------------------*/
var callbackQueryItemsSearch = function (res, text) {
    view.addBooksItems(res.data.books);
    $('.breadcrumb .active').text('поиск');
    msgResultSearchText(text, res.data.books.length);
};
/* ------------------- Get the query in database searching -------------------*/
var requestBooksSearch = function (callback) {
    var text = htmlspecialchars(String($('#search').val()));
    if (text.length > 0) {
        text = text.replace(/(^\s+|\s+$)/g, '');
        var textEncode = encodeURIComponent(text); // shielding request
        doAjaxQuery('GET', '' + pathUrl + '/api/v1/books?search=' + textEncode + '', {}, function (res) {
            callback(res, text);
        });
    }
    else {
        $('#list').html('').hide();
    }
};
/* ------------------------------- Hide auto search -------------------------*/
$('body').on("click", function (event) {
    if ($(event.target).attr('id') !== 'search' && $(event.target).attr('id') !== 'list') {
        $('#list').hide(200);
    }
});
/* ---------- Live search if the search did not introduced n time ----------- */
$("#search").on("keypress", function (event) {
    var text = String($(this).val());
    console.log("Search interaction");
    if (event.code === "Enter") {
        console.log("enter pressed");
        event.preventDefault();
        if (!!text && text.length > 0) {
            var encodeText = encodeURIComponent(String($('#search').val()));
            if (pathUrl == '/admin') {
                requestBooksSearch(function (res) {
                    view.addBooksList(res);
                    msgResultSearchText(text, res.data.books.length);
                    $('.found').show();
                    $('#list').hide(200);
                });
            }
            else {
                var url = 'http://' + window.location.host + pathUrl + '/search?search=' + encodeText + '';
                window.location.assign(url);
            }
        }
    }
    if (text.length > 0) {
        if (!(event.keyCode >= 33 && event.keyCode <= 40) &&
            !(event.keyCode >= 16 && event.keyCode <= 20) &&
            (event.keyCode !== 27) &&
            (event.keyCode !== 13)) {
            var task = setTimeout(function () {
                requestBooksSearch(callbackQueryMiniItemsSearch);
            }, 500);
            if (pathUrl == '/admin') {
                $('#eAutoComplete_itemMore').find('a').on('click', function (event) {
                    event.preventDefault();
                    alert('yes');
                });
            }
        }
        $('#search').on("keydown", function (event) {
            if (!(event.keyCode >= 33 && event.keyCode <= 40) &&
                !(event.keyCode >= 16 && event.keyCode <= 20)) {
                clearTimeout(task);
            }
        });
    }
    else {
        $('#list').hide();
    }
});
/**
 * Scanning for active search
 */
$(function () {
    (function () {
        if (typeof pathNameUrl === "undefined") {
            console.log("pathNameUrl is undefined while: Scanning for active search");
            return;
        }
        if (!!search) {
            console.log("search found");
            var search_text;
            if (!!location) {
                search_text = search;
                if (!!search_text) {
                    search_text = search_text.split('=');
                }
            }
            else {
                search_text = null;
            }
            let search_string = decodeURIComponent((!search_text) ? ' ' : search_text[1]);
            $('#search').val(htmlspecialchars(search_string));
            search_string = search_string.replace(/(^\s+|\s+$)/g, '');
            var textEncode = encodeURIComponent(search_string); // shielding request
            console.log("textEncode: " + textEncode);
            if (window.location.pathname == '/') {
                doAjaxQuery('GET', '' + pathUrl + '/api/v1/books?search=' + textEncode + '', {}, function (res) {
                    console.log("callbackQueryItemsSearch fire");
                    callbackQueryItemsSearch(res, search_string);
                });
            }
            else if (pathNameUrl[1] == 'admin' && pathNameUrl[2] == 'search') {
                requestBooksSearch(function (res) {
                    view.addBooksList(res);
                    msgResultSearchText(search_string, res.data.books.length);
                    $('.found').show();
                    $('#list').hide(200);
                });
            }
        }
    }());
});
