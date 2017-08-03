import { Fields } from '../constants';

export default class BookManager {
    constructor( node ) {
        this.node = node;
        this.$fields = this.getFieldNodes();
        this.$submit = node.querySelector('.js-book-submit');
        this.$list = node.querySelector('.js-book-list');

        this.attachEvents();
    }

    getFieldNodes() {
        let nodes = {};
        Fields.forEach( fieldName => {
            nodes[fieldName] = this.node.querySelector(`[name="${fieldName}"]`);
        });
        return nodes;
    }

    validateFields() {
        return Fields.every( fieldName => this.$fields[fieldName].value != '' );
    }

    attachEvents() {
        this.$submit.addEventListener('click', this.submitHandler.bind( this ) );
    }

    submitHandler( e ) {
        if (this.validateFields()) {
            // proceed
        } else {
            alert('Не все поля заполнены');
        }
    }
}
