import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { LoggerService } from '../logger.service';
import { SearchService } from '../search.service';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
    books: { title: string; author: string }[] = [];
    newBook = { title: '', author: '' };
    searchQuery: string = '';
    isSearching = false;
    searchResults: { title: string; author: string }[] = [];

    constructor(
        private bookService: BookService,
    private loggerService: LoggerService,
    private searchService: SearchService
) {}

ngOnInit(): void {
    this.books = this.bookService.getAllBooks();
}

addBook(): void {
    const title = this.newBook.title?.trim();
    const author = this.newBook.author?.trim();

    if (!title || !author) {
    this.loggerService.logError('Title and author are required');
    return;
}

this.bookService.addBook({ title, author });
this.loggerService.logInfo(`Added ${title}`);
this.books = this.bookService.getAllBooks();
this.newBook = { title: '', author: '' };
}

removeBook(index: number): void {
    const current = this.bookService.getAllBooks();

    if (index < 0 || index >= current.length) {
    this.loggerService.logError('Tried to remove non-existing book');
    return;
}

const removedTitle = current[index].title;
this.bookService.removeBook(index);
this.loggerService.logInfo(`Removed ${removedTitle}`);
this.books = this.bookService.getAllBooks();
}

searchBooks(): void {
    const query = this.searchQuery ?? '';

    if (!query.trim()) {
    this.searchResults = [];
    return;
}

this.isSearching = true;
this.searchResults = [];

this.searchService
    .searchBooks(query)
    .then(results => {
        this.searchResults = results;
        this.isSearching = false;
    })
    .catch(() => {
        this.loggerService.logError('Search failed');
        this.isSearching = false;
    });
}
}
