export default class BookItem {
    constructor( id ) {
        const $node = document.createElement('li');
        $node.className = 'list__item js-item';
        $node.setAttribute('data-id', id );
        $node.innerHTML = `<div class="list__actions">
                    <a class="list__button js-item-edit">Изменить</a>
                    <a class="list__button list__button--remove js-item-remove">Удалить</a>
                </div>
                <h5 class="list__title"></h5>
                <p class="list__subtitle"></p>`;
        $node._item = this;

        this.id = id;
        this.$node = $node;
        this.$title = $node.querySelector('.list__title');
        this.$author = $node.querySelector('.list__subtitle');
    }

    setTitle( title ) {
        this.$title.textContent = title;
    }

    setAuthor( author ) {
        this.$author.textContent = author;
    }
}
