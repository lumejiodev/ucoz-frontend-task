import { Fields, Texts } from '../constants';
import BookItem from './BookItem';

export default class BookManager {
    constructor( node ) {
        this.node = node;
        this.$fields = this.getFieldNodes();
        this.$submit = node.querySelector('.js-book-submit');
        this.$list = node.querySelector('.js-book-list');
        this.$formTitle = node.querySelector('.js-form-title');

        this.idIterator = 0;
        this.editMode = false;

        this.books = {};

        this.attachEvents();
    }

    getFieldNodes() {
        let nodes = {};
        Fields.forEach( fieldName => {
            nodes[fieldName] = this.node.querySelector(`[name="${fieldName}"]`);
        });
        return nodes;
    }

    attachEvents() {
        this.$submit.addEventListener('click', this.submitHandler.bind( this ) );
    }

    raiseIterator() {
        this.idIterator++;
        // todo: обновление в LocalStorage
    }

    createItem() {
        this.raiseIterator();

        let book = this.books[this.idIterator] = new BookItem( this.idIterator );
            book.setTitle( this.$fields.title.value );
            book.setAuthor( this.$fields.author.value );

        book.$edit.addEventListener('click', e => this.toggleEditMode( true, book.id ) );
        book.$remove.addEventListener('click', e => this.removeItem( book.id ) );

        this.$list.appendChild( book.$node );
    }

    updateItem( itemId ) {
        let book = this.books[itemId];
            book.setTitle( this.$fields.title.value );
            book.setAuthor( this.$fields.author.value );
    }

    removeItem( itemId ) {
        let book = this.books[itemId];
        this.$list.removeChild( book.$node );

        if (itemId == this.idIterator) {
            // если удаляется последняя созданная книга, то ID освобождается
            this.idIterator--;
        }

        if (+this.$fields.id.value === itemId) {
            // сброс формы, если удалить редактирующуюся книгу
            this.toggleEditMode( false );
            this.clearFields();
        }

        delete this.books[itemId];
    }

    validateFields() {
        return Fields.every( fieldName => this.$fields[fieldName].value != '' );
    }

    clearFields() {
        Fields.forEach( fieldName => this.$fields[fieldName].value = '' );
        this.$fields.id.value = 0;
    }

    submitHandler( e ) {
        if (this.validateFields()) {
            if (this.editMode) {
                // редактирование существующей книги
                this.updateItem( this.$fields.id.value );
                this.toggleEditMode( false );
            } else {
                // добавление новой книги
                this.createItem();
            }
            this.clearFields();
        } else {
            alert( Texts.ALL_FIELDS_ARE_REQUIRED );
        }
    }

    toggleEditMode( state = !this.editMode, itemId = -1 ) {
        this.editMode = state;
        this.$formTitle.textContent = state ? Texts.EDIT_EXISTING_BOOK : Texts.ADD_NEW_BOOK;
        this.$submit.textContent = state ? Texts.SAVE : Texts.ADD;

        if (state) { // режим редактирования
            let book = this.books[itemId];
            this.$fields.id.value = itemId;
            this.$fields.title.value = book.title;
            this.$fields.author.value = book.author;
        }
    }
}
