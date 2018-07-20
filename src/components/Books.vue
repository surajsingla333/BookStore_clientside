<template>
    <div class="container ">
        <div class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">Books</h1>
                </div>
            </div>
        </div><br><br>
        <alert :message="message" v-if="showAlert" style="background-color: rgb(125, 144, 41)"></alert><br>
        <div>
            <button class="button is-primary is-medium" v-on:click="addModal()">Add New Book</button>
        </div><br><br><br>
        <div class="container">
            <div class="modal" id="modal" >
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title" v-if="add">Add Book</p>
                        <p class="modal-card-title" v-else>Update Book</p>
                        <button class="delete" aria-label="close" v-on:click="closeModal()"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field">
                            <label class="label">Title</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="title" v-model="addTitle" value="addTitle">
                            </div>
                            <p class="help is-danger" v-if="titleError">Please enter Book's Title.</p>
                        </div>
                        <div class="field">
                            <label class="label">Author</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="author" v-model="addAuthor" value="addAuthor">
                            </div>
                            <p class="help is-danger" v-if="authorError">Please enter Book's Author.</p>
                        </div>
                        <div class="field">
                            <label class="checkbox">
                                <input type="checkbox" id="checkbox" v-model="readBook" value="readBook">
                                Read?
                            </label>
                        </div>        
                    </section> 
                    <footer class="modal-card-foot">
                        <button class="button is-success" v-if="add" v-on:click="onSubmit()"> {{todo}} </button>
                        <button class="button is-success" v-else v-on:click="onUpdate(indi)"> {{todo}} </button>
                        <button class="button in-warning" v-on:reset="resetBook()"> Reset </button>
                    </footer>
                </div>    
            </div>
        </div>
        <div class="container" v-if="delBook">
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head is-danger">
                        <h1> Delete Book !? </h1>
                    </header>
                    <section class="modal-card-body">
                        <p> This will delete all the content and data of the book as if it never existed </p>
                    </section>
                    <footer class="modal-card-foot is-danger">
                        <button class="is-medium is-danger" v-on:click="deleteConfirm(indi, 'yes')">Yes</button>
                        <button class="is-medium is-warning" v-on:click="deleteConfirm(indi, 'no')">No</button>
                    </footer>
                </div>
            </div>
        </div>
        <table class="table is-striped is-fullwidth">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Read?</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in books" v-bind:key="index">
                    <td>{{book.title}}</td>
                    <td>{{book.author}}</td>
                    <td>
                        <span v-if='book.read'>Yes</span>
                        <span v-else>No</span>
                    </td>
                    <td>
                        <button class="button is-warning is-small" v-on:click="updateModal(index)">Update</button>
                        <button class="button is-danger is-small" v-on:click="deleteModal(index)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>    
    </div>
</template>

<script>
import axios from 'axios'
import Alert from './Alerts'
export default {
    name: 'Books',
    data(){
        return {
            books: [],
            el: null,
            addTitle: null, 
            addAuthor: null,
            readBook: false,
            e: null,
            titleError: false,
            authorError: false,
            message: null,
            showAlert: false,
            todo: null,
            add:true,
            indi: 0,
            delBook: false
        }
    },
    components: {
        alert: Alert
    },
    methods: {

    //modals open and close    
        addModal(){
            this.el = document.getElementById("modal");
            this.el.classList.add("is-active");
            this.add = true
            this.todo = "Add Book"
            this.addTitle = null
            this.addAuthor = null
            this.readBook = false        
        },
        updateModal(index){
            this.el = document.getElementById("modal");
            this.el.classList.add("is-active");
            this.add = false
            this.todo = "Update Book"
            this.indi = index
            console.log(index)
            this.addTitle = this.books[index].title
            this.addAuthor = this.books[index].author
            this.readBook = this.books[index].read
        },
        deleteModal(index) {
            console.log(this.books[index])
            this.indi = index
            this.delBook = true;
        },
        closeModal(){
            this.el = document.getElementById("modal");
            this.el.classList.remove("is-active");
            this.titleError = false
            this.authorError = false
        },

    //axios ajax functions
        getBooks() {
            const path = 'http://localhost:3000/';
            axios.get(path)
                .then((res) => {
                    this.books = res.data.books;
                })
                .catch((error) => {
                    console.error(error)
                })
        },
        addBook(payload) {
            const path = 'http://localhost:3000/';
            axios.post(path, payload)
            .then(() => {
                this.getBooks()
                this.closeModal()
                this.showAlert = true
                this.message = 'Book added!';
            })
            .catch((error) => {
                console.error(error)
                this.getBooks()
            })
        },
        updateBook(payload, bookTitle) {
            const path = 'http://localhost:3000/book/'+bookTitle;
            axios.put(path, payload)
            .then(() => {
                this.getBooks()
                this.closeModal()
                this.showAlert = true
                this.message = 'Book updated!';
            })
            .catch((error) => {
                console.error(error)
                this.getBooks();
            })
        },
        deleteBook(bookTitle) {
            const path = 'http://localhost:3000/book/'+bookTitle
            axios.delete(path)
            .then(() => {
                console.log("this")
                this.getBooks()
                this.showAlert = true
                this.delBook = false
                this.message = 'Book deleted!';
            })
            .catch((error) => {
                console.log(error)
                this.getBooks();
            })
        },

    //form functions    
        initForm(){
            this.addAuthor = null;
            this.addTitle = null;
            this.readBook = false;
        },
       

    //in modal functions    
        deleteConfirm(indi, value) {
            if (value == 'yes') {
                // alert("You sure want to delete the book!?")
                this.deleteBook(this.books[indi].title);
            }
            else if (value == 'no') {
                this.showAlert = true
                this.delBook = false
                this.message = 'Book not deleted!'
            }
        },
        resetBook() {
            console.log("reset book?")
            this.initForm()
        },
        onSubmit() {
            console.log("submit book?")
            this.readBook = false
            this.titleError = false
            this.authorError = false
            if (document.getElementById("checkbox").checked == true ) this.readBook = true;
            if (this.addTitle == null && this.addAuthor != null)
                this.titleError = true
            else if (this.addAuthor == null && this.addTitle != null)
                        this.authorError = true
            else if (this.addAuthor == null && this.addTitle == null) {
                        this.authorError = true
                        this.titleError = true
                }
            else {    
                this.authorError = false
                this.titleError = false
                const payload = {
                    title: this.addTitle,
                    author: this.addAuthor,
                    read: this.readBook,
                };
                this.addBook(payload);
            }
        },
        onUpdate(indi) {
            console.log("inUpdate",indi, indi+1)
            if (document.getElementById("checkbox").checked == true ) this.readBook = true;
            else this.readBook = false;
            if (this.addTitle == null && this.addAuthor != null)
                this.titleError = true
            else if (this.addAuthor == null && this.addTitle != null)
                this.authorError = true
            else if (this.addAuthor == null && this.addTitle == null) {
                this.authorError = true
                this.titleError = true
            }
            else {    
                this.authorError = false
                this.titleError = false
                const payload = {
                    title: this.addTitle,
                    author: this.addAuthor,
                    read: this.readBook,
                };
                this.updateBook(payload, this.books[indi].title);
            }   
            this.initForm();
        }
    },
    created(){
        this.getBooks()
    }
}
</script>
