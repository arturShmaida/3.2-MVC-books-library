"use strict";
// import swal from 'sweetalert';
/* ----------------------------- begin view ----------------------------------*/
var view = {
    // 'title,author,year,pages,isbn,description
    fillFields: function (obj, fields, func) {
        let fieldsArr;
        if (typeof fields === "string") {
            fieldsArr = fields.split(/, */);
        }
        if (!fieldsArr) {
            return;
        }
        fieldsArr.map(function (field) {
            let element = $('#' + field);
            if (obj.hasOwnProperty(field)) {
                let key = field;
                element.html(obj[key]);
            }
        });
    },
    selectFields: function (fields, func) {
        let obj = {};
        if (typeof fields === "string") {
            fields = fields.split(/, */);
        }
        fields.map(function (field) {
            let v = ($('#' + field).html)();
            obj[field] = (v);
        });
        return obj;
    },
    showErrEmail: function () {
        var c = '.input-group';
        $(c).removeClass('has-success');
        $(c).addClass('has-error');
        view.hideElement('.glyphicon-ok');
        view.showElement('.glyphicon-remove');
    },
    showSuccessEmail: function () {
        var c = '.input-group';
        $(c).removeClass('has-error');
        $(c).addClass('has-success');
        view.hideElement('.glyphicon-remove');
        view.showElement('.glyphicon-ok');
    },
    addBookItem: function (book) {
        if (!!book) {
            if (typeof $('#pattern').html() !== "string") {
                console.log(typeof $('#pattern').html());
            }
            return $('#pattern').html()
                .replace(/{id}/g, book.id)
                .replace(/{title}/g, book.title)
                .replace(/{author}/g, book.author);
        }
    },
    addBooksItems: function (books, doClean) {
        var content = $('#content');
        var contentHTML = ((doClean) ? '' : content.html());
        console.group();
        for (var i in books) {
            contentHTML += view.addBookItem(books[i]);
        }
        console.log("books loaded: " + books.length);
        console.groupEnd();
        content.html(contentHTML);
        // $('.blockI').matchHeight(); // Aligns all the height of the book
    },
    showNot_found: function (searchText, pathUrl) {
        var contentNotFound = $('#not_found').html()
            .replace(/{searchText}/g, searchText);
        $('#content').html(contentNotFound);
    },
    /**
     * Turn missing string to dash
     *  */
    nullToDash: function (string) {
        return (((!string) || (string.length === 0)) ? '-' : string);
    },
    addBooksListRow: function (book) {
        var date;
        if (book.date) {
            date = new Date(book.date);
            date.setDate(date.getDate() + book.term);
            date = date.toDateString();
        }
        return $('#pattern').html()
            .replace(/{id}/g, book.id)
            .replace(/{title}/g, book.title)
            .replace(/{author}/g, book.author)
            .replace(/{name}/g, view.nullToDash(book.name))
            .replace(/{email}/g, view.nullToDash(book.email))
            .replace(/{phone}/g, view.nullToDash(book.phone))
            .replace(/{date}/g, view.nullToDash(date))
            .replace(/{pawn}/g, view.nullToDash(book.pawn));
    },
    addBooksList: function (res) {
        var content = $('#table_content');
        var contentHTML = '';
        console.log("Количество книг: " + res.data.books.length);
        for (var i in res.data.books) {
            contentHTML += view.addBooksListRow(res.data.books[i]);
        }
        content.html(contentHTML);
        $('.book_list_row').on("click", function () {
            $(location).attr('href', 'admin/book/' + $(this).attr('data-book-id'));
        });
    },
    fillBookInfo: function (book) {
        console.log("FillBookInfo");
        console.log(book);
        view.fillFields(book, 'title,author,year,pages,isbn,description', "html");
        $('#id').attr({
            'book-id': book.id,
            'busy': book.event
        });
        $('#bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
        $('.description').html(book.description);
    },
    normalDateFormat: function (date) {
        return date.toISOString().substring(0, 10);
    },
    addPopUpBlock: function (title, text) {
        $('#main').after('<div id="test-modal" class="mfp-hide white-popup-block"><h1>' + title + '</h1><p>' + text + '</p><p><a class="popup-modal-dismiss" href="#">X</a></p></div>');
    },
    showError: function (text) {
        swal('Ооопс!', text, 'error');
    },
    showSuccess: function (text) {
        // console.log(text);
        swal('Отлично!', text, 'success');
    },
    // showSubscribe: function (text: string, bookId: string) {
    //     swal({
    //         title: 'Хотите почитать?',
    //         text: text,
    //         icon: 'input',
    //         buttons: [true, false],
    //         closeOnConfirm: false,
    //         animation: 'slide-from-top',
    //         inputPlaceholder: 'Введите свой e-mail',
    //         confirmButtonColor: '#27AE60',
    //         showLoaderOnConfirm: true
    //     },
    //         function (inputValue: string | boolean) {  // What is it ?
    //             if (inputValue === false) {
    //                 return false;
    //             }
    //             if (!controller.validateEmail(inputValue)) {
    //                 swal.showInputError('Вы где-то ошиблись. Проверьте введенные данные.');
    //                 return false;
    //             }
    //             doAjaxQuery('GET', '/api/v1/books/' + bookId + '/order', {
    //                 'email': inputValue
    //             }, function (res: ResponseWithData) {
    //                 view.showSuccess('Ваш e-mail ' + inputValue + '\nдобавлен в список ожидания.');
    //             });
    //         });
    // },
    showConfirm: function (bookId) {
        swal({
            title: 'Вы уверены?',
            text: 'Согласие приведет к невозвратимому удалению книги',
            icon: 'warning',
            buttons: ['Льолик, не надо!', 'Да, уверен!'],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                doAjaxQuery('GET', '/admin/api/v1/books/delete/' + bookId, {}, function (res) {
                    swal({
                        title: 'Удалено!',
                        text: 'Надеюсь, вы осознаете что сейчас произошло ))',
                        icon: 'success'
                    }).then(() => {
                        window.location.href = '/admin';
                    });
                });
            }
        });
    },
    addMiniItemSearch: function (pathUrl, book) {
        var id = (book.id == 'no-cover') ? '#not_found' : '#miniItem';
        return $(id).html()
            .replace(/{id}/g, book.id)
            .replace(/{path}/g, pathUrl)
            .replace(/{title}/g, book.title)
            .replace(/{author}/g, book.author);
    },
    addMiniItemsSearch: function (pathUrl, books, text) {
        var content = $('#list');
        content.html('');
        var contentHTML = content.html();
        var limitImetsInSearch = 3;
        var n = 0;
        for (let i = 0; i < books.length; i++) {
            n++;
            if (i <= limitImetsInSearch) {
                contentHTML += view.addMiniItemSearch(pathUrl, books[i]);
                content.attr('size', n);
            }
        }
        if (n > limitImetsInSearch) {
            contentHTML += $('#more').html()
                .replace(/{text}/g, text)
                .replace(/{pathUrl}/g, pathUrl);
        }
        content.html(contentHTML);
        content.show('fast');
    },
    showElement: function (selector) {
        if (!!selector) {
            $(selector).show();
        }
    },
    hideElement: function (selector) {
        if (!!selector) {
            $(selector).hide();
        }
    }
};
/* ------------------------------- end view ----------------------------------*/
/* --------------------------- begin controller ------------------------------*/
var controller = {
    validateEmail: function (value) {
        var regex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,10}$/;
        return regex.test(value);
    }
};
function doAjaxQuery(method, url, data, callback) {
    $.ajax({
        type: method,
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        data: ((method == 'POST') ? JSON.stringify(data) : data),
        success: function (res) {
            if (!res.success) {
                console.log(res);
                view.showError(res.msg);
                return;
            }
            callback(res);
        },
        error: function (jqXHR, textStatus) {
            view.showError('Ошибка ' + textStatus);
        }
    });
}
var globalVar = {
    items_limit_on_page_load: 20,
    filter: 'new'
};
function htmlspecialchars(html) {
    html = html.replace(/&/g, "&amp;");
    html = html.replace(/</g, "&lt;");
    html = html.replace(/>/g, "&gt;");
    html = html.replace(/"/g, "&quot;");
    return html;
}
