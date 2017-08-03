import { Fields } from '../constants';

export default class BookManager {
    constructor( node ) {
        this.node = node;
        this.fields = this.getFieldNodes();
    }

    getFieldNodes() {
        let nodes = {};
        Fields.forEach( fieldName => {
            nodes[fieldName] = this.node.querySelector(`[name="${fieldName}"]`);
        });
        return nodes;
    }
}
