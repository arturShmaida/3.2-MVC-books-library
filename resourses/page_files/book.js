var pathname = window.location.pathname;
var bookIdPosition = pathname.lastIndexOf("/") + 1;

var bookId;


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
