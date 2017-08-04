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

    raiseIterator() {
        this.idIterator++;
        // todo: обновление в LocalStorage
    }

    createItem() {
        this.raiseIterator();

        let book = this.books[this.idIterator] = new BookItem( this.idIterator );
            book.setTitle( this.$fields.title.value );
            book.setAuthor( this.$fields.author.value );

        this.$list.appendChild( book.$node );
    }

    updateItem( itemId ) {
        let book = this.books[itemId];
            book.setTitle( this.$fields.title.value );
            book.setAuthor( this.$fields.author.value );
    }

    removeItemNode( $itemNode, itemId = -1 ) {
        this.$list.removeChild( $itemNode );

        delete this.books[this.idIterator];

        if (itemId == this.idIterator) {
            // если удаляется последняя созданная книга, то ID освобождается
            this.idIterator--;
        }
    }

    validateFields() {
        return Fields.every( fieldName => this.$fields[fieldName].value != '' );
    }

    clearFields() {
        Fields.forEach( fieldName => this.$fields[fieldName].value = '' );
        this.$fields.id.value = 0;
    }

    attachEvents() {
        this.$submit.addEventListener('click', this.submitHandler.bind( this ) );
        this.$list.addEventListener('click', this.listClickHandler.bind( this ) );
    }

    submitHandler( e ) {
        if (this.validateFields()) {
            if (this.editMode) {
                // редактирование существующей книги
                const id = this.$fields.id.value;
                this.updateItem( id );
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

    listClickHandler( e ) {
        const classList = e.target.classList;
        if (classList.contains('js-item-edit') || classList.contains('js-item-remove')) {
            let $itemNode = e.target.parentNode;
            while ($itemNode.classList.contains('js-item') === false && $itemNode !== this.$list) {
                $itemNode = $itemNode.parentNode;
            }

            const itemId = $itemNode.getAttribute('data-id');

            if (classList.contains('js-item-remove')) {
                this.removeItemNode( $itemNode, itemId );
            } else {
                this.toggleEditMode( true, $itemNode, itemId );
            }
        }
        e.preventDefault();
    }

    toggleEditMode( state = !this.editMode, $itemNode = null, itemId = -1 ) {
        this.editMode = state;
        this.$formTitle.textContent = state ? Texts.EDIT_EXISTING_BOOK : Texts.ADD_NEW_BOOK;
        this.$submit.textContent = state ? Texts.SAVE : Texts.ADD;

        if (state) {
            this.$fields.id.value = itemId;
            this.$fields.title.value = $itemNode.querySelector('.list__title').textContent;
            this.$fields.author.value = $itemNode.querySelector('.list__subtitle').textContent;
        }
    }
}
