"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("Form control downloaded");
const form = document.querySelector("#bookAdd");
console.log(form);
function sendData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!form || !(form instanceof HTMLFormElement)) {
            return;
        }
        const formData = new FormData(form);
        try {
            const response = fetch("/admin/api/v1/bookUpload", {
                method: "POST",
                body: formData
            });
            console.log((yield response).json());
        }
        catch (error) {
            console.log(error);
        }
    });
}
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
    console.log("// Take over form submission");
    e.preventDefault();
    sendData();
});
function logout() {
    $.ajax({
        async: false,
        url: '/admin',
        type: 'GET',
        username: 'logout'
    });
    setTimeout(function () {
        window.location.href = '/';
    }, 200);
}
$(".btnBookDelete").on("click", function (event) {
    let bookIdAttr = event.target.attributes.getNamedItem("book-id");
    if (bookIdAttr === null) {
        alert("Invalid id. Can't delete the book");
    }
    let bookId = bookIdAttr === null || bookIdAttr === void 0 ? void 0 : bookIdAttr.nodeValue;
    if (bookId === null || typeof bookId === "undefined") {
        return;
    }
    console.dir(bookId);
    // doAjaxQuery("PATCH", "/admin/api/v1/delete/" + bookId, null, function (res) {
    // 	// if (res.data.event) {
    // 	// 	isBookInUse = true;
    // 	// 	bookId = res.data.id; 
    // 	// }
    // 	alert(
    // 		"The book was deleted"
    // 	);
    // });
    view.showConfirm(bookId);
});
