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

    raiseIterator() {
        this.idIterator++;
        // todo: обновление в LocalStorage
    }

    createItemNode() {
        const bookTitle = escapeHtml( this.$fields.title.value );
        const bookAuthor = escapeHtml( this.$fields.author.value );

        this.raiseIterator();

        let node = document.createElement('li');
            node.className = 'list__item js-item';
            node.setAttribute('data-id', this.idIterator );
            node.innerHTML = `<div class="list__actions">
                    <a class="list__button js-item-edit">Изменить</a>
                    <a class="list__button list__button--remove js-item-remove">Удалить</a>
                </div>
                <h5 class="list__title">${bookTitle}</h5>
                <p class="list__subtitle">${bookAuthor}</p>`;
        return node;
    }

    removeItemNode( $trigger ) {
        let $itemNode = $trigger.parentNode;
        while ($itemNode.classList.contains('js-item') === false && $itemNode !== this.$list) {
            $itemNode = $itemNode.parentNode;
        }
        this.$list.removeChild( $itemNode );

        const itemId = $itemNode.getAttribute('data-id');
        // todo: обновление в LocalStorage

        if (itemId == this.idIterator) {
            this.idIterator--;
            // если удаляется последняя созданная книга, то ID освобождается
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

    listClickHandler( e ) {
        if (e.target.classList.contains('js-item-edit')) {
            // редактирование книги
        } else if (e.target.classList.contains('js-item-remove')) {
            // удаление книги
            this.removeItemNode( e.target );
        }
        e.preventDefault();
    }
}
