var pathname = window.location.pathname;
var bookIdPosition = pathname.lastIndexOf("/") + 1;
console.log(bookIdPosition)
// var isBookInUse = false;
var bookId;

// doAjaxQuery("PATCH", "/api/v1/books/" + bookIdPosition, null, function (res) {
// 	console.lof("Views: " + res.views, "Clicks: " + res.clicks);
// 	// if (res.data.event) {
// 	// 	isBookInUse = true;
// 	// 	bookId = res.data.id;
// 	// }
// });

/* --------------------Show the result, for sending the -----------------------
----------------------email in the queue for the book ---------------------- */
// var showResultSendEmailToQueue = function(email, result) {
//     var busy = $('#bookID').attr('busy');
//     $('.form-queue', '.btnBookID', (busy === null) ? '.freeBook' : '.busyBook').css('display', 'none');
//     $('.response').css('display', 'block');
//     $('span.youEmail').text(' ' + email);
// };

// /*--------------- Send email. Get in Queue in for a book ---------------------*/
// var sendEmailToQueue = function(id, email) {
//     doAjaxQuery('PATCH', '/api/v1/books/' + id, null, function(res) {
//         showResultSendEmailToQueue(email, res.success);
//     });
// };

/* --------------- Checking validity of email when typing in input -----------*/
// $('.orderEmail').keyup(function(event) {
//     var email = $(this).val();
//     var isEmail = controller.validateEmail(email);
//     if (email === '') {
//         $('.input-group').removeClass('has-error has-success');
//         view.hideElement('.glyphicon-remove', '.glyphicon-ok');
//     } else {
//         if (isEmail) {
//             view.showSuccessEmail();
//             if (event.keyCode == 13) {
//
//                 var id = $('#bookID').attr('book-id');
//                 sendEmailToQueue(id, email);
//             }
//         } else {
//             view.showErrEmail();
//         }
//     }
// });
function doAjaxQuery(method, url, data, callback) {
	$.ajax({
		type: method,
		url: url,
		contentType: "application/json",
		dataType: "json",
		data: method == "POST" ? JSON.stringify(data) : data,
		success: function (res) {
			if (!res.success) {
				console.log(res);
				return;
			}
			callback(res);
		},
		error: function (jqXHR, textStatus) {
			console.log("Ошибка " + textStatus);
		},
	});
}

/*------------------ Sending email by clicking on the button ----------------*/
$(".btnBookID").on("click", function (event) {
    let bookId = $("#id").attr("book-id")
    console.log(bookId)
	doAjaxQuery("PATCH", "/book/" + bookId, null, function (res) {
		console.log("Views: " + res.views, "Clicks: " + res.clicks);
		// if (res.data.event) {
		// 	isBookInUse = true;
		// 	bookId = res.data.id;
		// }
		alert(
			"Книга свободна и ты можешь прийти за ней." +
				" Наш адрес: г. Кропивницкий, переулок Васильевский 10, 5 этаж." +
				" Лучше предварительно прозвонить и предупредить нас, чтоб " +
				" не попасть в неловкую ситуацию. Тел. 099 196 24 69" +
				" \n\n" +
				"******************\n"
		);
	});
});
