const Books = require("../models/Books");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async (req, res) => {
    try {
        const books = await Books.find({});
        res.status(200).json(books);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.getSeveral = async (req, res) => {
    try {
        let books = await Books.find({});
        const startPosition = Number(req.query.pos);
        const searchName = req.query.search;
        const quantity = Number(req.query.q);
        const fieldForSort = req.query.fieldname;
        const direction = req.query.direction;
        let severalBooks = [];
        let sortedBooks = [];
        let filteredBooks = [];
        if (direction === "reverse") {
            sortedBooks = [...books].sort( (a, b) => {
                if(a[fieldForSort] < b[fieldForSort]) {
                    return 1;
                }
                if(a[fieldForSort] > b[fieldForSort]) {
                    return -1;
                }
                return 0;
            });

            filteredBooks = searchName === "" ? sortedBooks : sortedBooks.filter( (book) => {
                return new RegExp(searchName.toLowerCase()).exec(book.name.toLowerCase());
            });
            severalBooks = filteredBooks.slice(startPosition, quantity);
            res.status(200).json({
                    books: severalBooks,
                    collectionSize: searchName === "" ? books.length : filteredBooks.length
                });
        } else {
            sortedBooks = [...books].sort( (a, b) => {
                if(a[fieldForSort] > b[fieldForSort]) {
                    return 1;
                }
                if(a[fieldForSort] < b[fieldForSort]) {
                    return -1;
                }
                return 0;
            });
            filteredBooks = searchName === "" ? sortedBooks : sortedBooks.filter( (book) => {
                return new RegExp(searchName.toLowerCase()).exec(book.name.toLowerCase());
            });
            severalBooks = filteredBooks.slice(startPosition, quantity);
            res.status(200).json({
                books: severalBooks,
                collectionSize: searchName === "" ? books.length : filteredBooks.length
            });
        }
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.getById = async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        res.status(200).json(book);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.delete = async (req, res) => {
    try {
        await Books.remove({_id: req.params.id});
        res.status(200).json({
            message: "Книга удалена."
        })
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.create = async (req, res) => {
    try {
        const books = await new Books ({
            name: req.body.name,
            author: req.body.author,
            description: req.body.description,
            year: req.body.year,
            rate: req.body.rate,
            genres: req.body.genres,
            imgUrl: req.body.imgUrl,
            tags: req.body.tags
        }).save();
        res.status(201).json(books);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = async (req, res) => {
    try {
        const books = await Books.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
            );
        res.status(200).json(books);
    } catch (e) {
        errorHandler(res, e);
    }
}
