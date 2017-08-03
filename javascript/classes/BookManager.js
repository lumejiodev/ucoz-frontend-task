import { Fields } from '../constants';
import escapeHtml from '../utils/escapeHtml';

export default class BookManager {
    constructor( node ) {
        this.node = node;
        this.$fields = this.getFieldNodes();
        this.$submit = node.querySelector('.js-book-submit');
        this.$list = node.querySelector('.js-book-list');

        this.idIterator = 0;

        this.attachEvents();
    }

    getFieldNodes() {
        let nodes = {};
        Fields.forEach( fieldName => {
            nodes[fieldName] = this.node.querySelector(`[name="${fieldName}"]`);
        });
        return nodes;
    }

    getIterationId() {
        this.idIterator++;
        // обновление в LocalStorage
        return this.idIterator;
    }

    createItemNode() {
        const bookTitle = escapeHtml( this.$fields.title.value );
        const bookAuthor = escapeHtml( this.$fields.author.value );

        let node = document.createElement('li');
            node.className = 'list__item';
            node.setAttribute('data-id', this.getIterationId() );
            node.innerHTML = `<div class="list__actions">
                    <a class="list__button">Изменить</a>
                    <a class="list__button list__button--remove">Удалить</a>
                </div>
                <h5 class="list__title">${bookTitle}</h5>
                <p class="list__subtitle">${bookAuthor}</p>`;
        return node;
    }

    validateFields() {
        return Fields.every( fieldName => this.$fields[fieldName].value != '' );
    }

    clearFields() {
        Fields.forEach( fieldName => this.$fields[fieldName].value = '' );
    }

    attachEvents() {
        this.$submit.addEventListener('click', this.submitHandler.bind( this ) );
    }

    submitHandler( e ) {
        if (this.validateFields()) {
            if (this.$fields.id.value == 0) {
                // добавление новой книги
                const $itemNode = this.createItemNode();
                this.$list.appendChild( $itemNode );
                this.clearFields();
            } else {
                // редактирование существующей книги
            }
        } else {
            alert('Не все поля заполнены');
        }
    }
}
