import Vue from 'vue';
import { Component, watch } from 'vue-property-decorator';
import { Logger } from '../../util/log';

import { server } from '../../api';
import { EntityType } from '../../model';
import * as utils from '../../utils';
import Service from '../../services/appService';
import { PanelComponent } from '../../common/panel';

const service = new Service();
const entityType: EntityType = 'department';

@Component({
    template: require('./list.html'),
    components: {
        'panel': PanelComponent,
    }
})
export class CompanysComponent extends Vue {

    name: 'department-index';

    protected logger: Logger;

    entityType = entityType;

    id = 0;

    loading = false;

    object: { default: string } = { default: 'Default object property!' }; // objects as default values don't need to be wrapped into functions

    data() {
        return { 
            list: [],
            entityType: entityType,
            header: {
                title: 'Companys',
                icon: 'sitemap',
                hidden: false,
                viewPath: '<small><span class="c-white">Companys</span></small>'
            },
        };
    }

    mounted() {
        console.log('Companys', this.$el.textContent); // I'm text inside the component.
        service.init(this);
        service.getList(this);    
    }
}


// export default {
//     components: {
//         ViewHeader,
//         Panel,
//         Button,
//         Link,
//     },
//     data() {
//         return { 
//             list: [],
//             entityType: entityType,
//             header: {
//                 title: 'Companys',
//                 icon: 'sitemap',
//                 hidden: false,
//                 viewPath: '<small><span class="c-white">Companys</span></small>'
//             },
//         }
//     },
//     oncreate() {
//         service.init(this);
//         service.initHeader(this);
//         service.getList(this);         
//     },
//     methods: {
//         createNew: function(e) {
//             window.location.href = '#departments';
//         } 
//     },
//     helpers: {
//         formatDate: utils.formatDate
//     }
// }