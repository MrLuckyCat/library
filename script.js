let library = document.querySelector(".library"),
    addBookBtn = document.querySelector(".add-book"),
    editBookBtn = document.querySelector(".edit-book-btn"),
    favorBtn = document.querySelector(".favorite-icon"),
    readBtn = document.querySelector(".is-read-icon"),
    trashBtn = document.querySelector(".trash-icon"),
    editBtn = document.querySelector(".edit-icon"),
    chosenBook = "aymen",
    books = [];

function Book(bookName, author, pages, isRead, image, isFavorite, description) {
    this.bookName = bookName;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.image = image;
    this.isFavorite = isFavorite;
    this.description = description;
    this.isEdited = false;
}

Book.prototype.createBookElement = function () {
    let bookContainer = document.createElement("div"),
        bookText = document.createElement("div"),
        bookTitle = document.createElement("h3"),
        bookAuthor = document.createElement("span"),
        bookPages = document.createElement("h3"),
        bookDescription = document.createElement("p"),
        favoriteIcon = favorBtn.cloneNode(true),
        isReadIcon = readBtn.cloneNode(true),
        trashIcon = trashBtn.cloneNode(true),
        editIcon = editBtn.cloneNode(true);

    if (this.isFavorite === "yes-favorite") {
        favoriteIcon.querySelector(".no-heart").style.display = "none";
        favoriteIcon.querySelector(".red-heart").style.display = "initial";
    } else {
        favoriteIcon.querySelector(".red-heart").style.display = "none";
        favoriteIcon.querySelector(".no-heart").style.display = "initial";
    }

    if (this.isRead === "yes-read") {
        isReadIcon.querySelector(".no-reading").style.display = "none";
        isReadIcon.querySelector(".yellow-reading").style.display = "initial";
    } else {
        isReadIcon.querySelector(".yellow-reading").style.display = "none";
        isReadIcon.querySelector(".no-reading").style.display = "initial";
    }

    trashIcon.onmouseover = changeTrashColor;
    trashIcon.onmouseleave = changeTrashColor;
    editIcon.onmouseover = changePenColor;
    editIcon.onmouseleave = changePenColor;
    editIcon.onclick = openForm;
    favoriteIcon.onclick = toggleFavorite;
    isReadIcon.onclick = toggleRead;
    trashIcon.onclick = removeBook;

    bookContainer.setAttribute("class", "book");
    bookText.setAttribute("class", "text");
    bookTitle.setAttribute("class", "title");
    bookAuthor.setAttribute("class", "author");
    bookPages.setAttribute("class", "pages");
    bookDescription.setAttribute("class", "description");

    bookContainer.style.backgroundImage = `url(${this.image})`;
    bookTitle.innerText = this.bookName;
    bookAuthor.innerText = this.author;
    bookPages.innerText = this.pages + " pages";
    bookDescription.innerText = this.description;

    bookText.append(bookTitle, bookAuthor, bookPages, bookDescription);
    bookContainer.append(
        editIcon,
        trashIcon,
        isReadIcon,
        favoriteIcon,
        bookText
    );

    if (this.isEdited) {
        library.insertBefore(bookContainer, chosenBook);
        chosenBook.remove();
        this.isEdited = false;

        for (let book of books) {
            if (
                book.bookName ===
                    chosenBook.querySelector(".title").innerText &&
                book.author === chosenBook.querySelector(".author").innerText
            ) {
                books[books.indexOf(book)] = this;
            }
        }

        localStorage.setItem("books", JSON.stringify(books));
    } else library.insertBefore(bookContainer, addBookBtn);
};

Book.prototype.displayBook = function () {
    let reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            localStorage.setItem("image", reader.result);
            this.image = localStorage.image;
            if (!this.isEdited) this.addToBooks();
            this.createBookElement();
        },
        false
    );

    reader.readAsDataURL(this.image);
};

Book.prototype.addToBooks = function () {
    books.push(this);
    localStorage.setItem("books", JSON.stringify(books));
};

function addBookToLibrary(e) {
    e.preventDefault();

    let bookName = document.getElementById("book-name").value,
        bookAuthor = document.getElementById("book-author").value,
        bookPages = document.getElementById("pages").value,
        isRead = document.querySelector('[name="read"]:checked').value,
        image = document.getElementById("book-image").files[0],
        isFavorite = document.querySelector('[name="favorite"]:checked').value,
        description = document.getElementById("book-description").value;

    let newBook = new Book(
        bookName,
        bookAuthor,
        bookPages,
        isRead,
        image,
        isFavorite,
        description
    );

    newBook.displayBook();
    closeForm();
    form.reset();
}

function editBookInformation(e) {
    e.preventDefault();

    let bookName = document.getElementById("book-name").value,
        bookAuthor = document.getElementById("book-author").value,
        bookPages = document.getElementById("pages").value,
        isRead = document.querySelector('[name="read"]:checked').value,
        image = document.getElementById("book-image").files[0],
        isFavorite = document.querySelector('[name="favorite"]:checked').value,
        description = document.getElementById("book-description").value;

    let editedBook = new Book(
        bookName,
        bookAuthor,
        bookPages,
        isRead,
        image,
        isFavorite,
        description
    );

    editedBook.isEdited = true;
    editedBook.displayBook();
    closeForm();
    form.reset();
}

function toggleFavorite(e) {
    let noHeart = e.target.querySelector(".no-heart"),
        redHeart = e.target.querySelector(".red-heart");

    if (noHeart.style.display !== "none") {
        noHeart.style.display = "none";
        redHeart.style.display = "initial";
    } else {
        redHeart.style.display = "none";
        noHeart.style.display = "initial";
    }

    saveFavorite(e);
}

function saveFavorite(e) {
    let currentBook = e.target.parentNode;

    for (let book of books) {
        if (
            book.bookName === currentBook.querySelector(".title").innerText &&
            book.author === currentBook.querySelector(".author").innerText
        ) {
            switch (book.isFavorite) {
                case "not-favorite":
                    book.isFavorite = "yes-favorite";
                    break;

                case "yes-favorite":
                    book.isFavorite = "not-favorite";
            }
        }
    }

    localStorage.setItem("books", JSON.stringify(books));
}

function toggleRead(e) {
    let noReading = e.target.querySelector(".no-reading"),
        yellowReading = e.target.querySelector(".yellow-reading");

    if (noReading.style.display !== "none") {
        noReading.style.display = "none";
        yellowReading.style.display = "initial";
    } else {
        yellowReading.style.display = "none";
        noReading.style.display = "initial";
    }

    saveRead(e);
}

function saveRead(e) {
    let currentBook = e.target.parentNode;

    for (let book of books) {
        if (
            book.bookName === currentBook.querySelector(".title").innerText &&
            book.author === currentBook.querySelector(".author").innerText
        ) {
            switch (book.isRead) {
                case "not-read":
                    book.isRead = "yes-read";
                    break;

                case "yes-read":
                    book.isRead = "not-read";
            }
        }
    }

    localStorage.setItem("books", JSON.stringify(books));
}

function changeTrashColor(e) {
    let normalTrash = e.target.querySelector(".normal-trash"),
        redTrash = e.target.querySelector(".red-trash");

    if (normalTrash.style.display !== "none") {
        normalTrash.style.display = "none";
        redTrash.style.display = "initial";
    } else {
        redTrash.style.display = "none";
        normalTrash.style.display = "initial";
    }
}

function changePenColor(e) {
    let normalPen = e.target.querySelector(".normal-pen"),
        greenPen = e.target.querySelector(".green-pen");

    if (normalPen.style.display !== "none") {
        normalPen.style.display = "none";
        greenPen.style.display = "initial";
    } else {
        greenPen.style.display = "none";
        normalPen.style.display = "initial";
    }
}

function removeBook(e) {
    let currentBook = e.target.parentNode;

    books = books.filter(
        (book) =>
            book.bookName !== currentBook.querySelector(".title").innerText &&
            book.author !== currentBook.querySelector(".author").innerText
    );

    localStorage.setItem("books", JSON.stringify(books));
    currentBook.remove();
}

function retrieveLibrary() {
    if (localStorage.books) {
        books = JSON.parse(localStorage.books);
    }

    for (let book of books) {
        Object.setPrototypeOf(book, Book.prototype);
        book.createBookElement();
    }
}

addBookBtn.onclick = openForm;
addImageBtn.onclick = () => imageInput.click();
submitBtn.onclick = addBookToLibrary;
closeBtn.onclick = closeForm;
favorBtn.onclick = toggleFavorite;
readBtn.onclick = toggleRead;
trashBtn.onmouseover = changeTrashColor;
trashBtn.onmouseleave = changeTrashColor;
editBtn.onmouseover = changePenColor;
editBtn.onmouseleave = changePenColor;
editBtn.onclick = openForm;
editBookBtn.onclick = editBookInformation;
window.onload = retrieveLibrary;
