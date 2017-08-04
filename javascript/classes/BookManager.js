import { Fields, Texts } from '../constants';
import StorageHelper from '../utils/StorageHelper';
import BookItem from './BookItem';

export default class BookManager {
    constructor( node ) {
        this.node = node;
        this.$fields = this.getFieldNodes();
        this.$submit = node.querySelector('.js-book-submit');
        this.$cancel = node.querySelector('.js-book-cancel');
        this.$list = node.querySelector('.js-book-list');
        this.$formTitle = node.querySelector('.js-form-title');

        this.idIterator = 0;
        this.editMode = false;

        this.books = {};

        this.attachEvents();
        this.initLocalStorage();
    }

    getFieldNodes() {
        let nodes = {};
        Fields.forEach( fieldName => {
            nodes[fieldName] = this.node.querySelector(`[name="${fieldName}"]`);
        });
        return nodes;
    }

    getFieldValues() {
        let values = {};
        Fields.forEach( fieldName => {
            if (fieldName === 'id') return;
            values[fieldName] = this.$fields[fieldName].value;
        });
        return values;
    }

    attachEvents() {
        this.$submit.addEventListener('click', this.submitHandler.bind( this ) );
        this.$cancel.addEventListener('click', this.cancelHandler.bind( this ) );
    }

    initLocalStorage() {
        this.idIterator = +StorageHelper.getOrSet('id-iterator', 0 );

        if (this.idIterator > 0) {
            for (let i = 1; i <= this.idIterator; i++) {
                const item = StorageHelper.getItem('book-' + i);
                if (item) { // проверка, что в ячейке не пусто
                    const book = JSON.parse( item );
                    this.createItemNode( i, book.title, book.author );
                }
            }
        }
    }

    raiseIterator() {
        StorageHelper.setItem('id-iterator', ++this.idIterator );
    }

    createItem() {
        this.raiseIterator();

        const { title, author } = this.$fields;
        this.createItemNode( this.idIterator, title.value, author.value );

        StorageHelper.setItem('book-' + this.idIterator, JSON.stringify( this.getFieldValues() ) );
    }

    createItemNode( id, title, author ) {
        let book = this.books[id] = new BookItem( id );
            book.setTitle( title );
            book.setAuthor( author );

        book.$edit.addEventListener('click', e => this.toggleEditMode( true, id ) );
        book.$remove.addEventListener('click', e => this.removeItem( id ) );

        this.$list.appendChild( book.$node );
    }

    updateItem( itemId ) {
        const { title, author } = this.$fields;
        let book = this.books[itemId];
            book.setTitle( title.value );
            book.setAuthor( author.value );

        StorageHelper.setItem('book-' + itemId, JSON.stringify( this.getFieldValues() ) );
    }

    removeItem( itemId ) {
        let book = this.books[itemId];
        this.$list.removeChild( book.$node );

        if (itemId == this.idIterator) {
            // если удаляется последняя созданная книга, то ID освобождается
            StorageHelper.setItem('id-iterator', --this.idIterator );
        }

        if (+this.$fields.id.value === itemId) {
            // сброс формы, если удалить редактирующуюся книгу
            this.cancelHandler();
        }

        delete this.books[itemId];
        StorageHelper.removeItem('book-' + itemId );
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

    cancelHandler() {
        this.toggleEditMode( false );
        this.clearFields();
    }

    toggleEditMode( state = !this.editMode, itemId = -1 ) {
        this.editMode = state;
        this.$formTitle.textContent = state ? Texts.EDIT_EXISTING_BOOK : Texts.ADD_NEW_BOOK;
        this.$submit.textContent = state ? Texts.SAVE : Texts.ADD;
        this.$cancel.style.display = state ? 'inline-block' : 'none';

        if (state) { // режим редактирования
            this.$fields.id.value = itemId;
            const item = StorageHelper.getItem('book-' + itemId );
            if (item) {
                const book = JSON.parse( item );
                Fields.forEach( fieldName => {
                    if (fieldName === 'id') return;
                    this.$fields[fieldName].value = book[fieldName];
                });
            }
        }
    }
}
