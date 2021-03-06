import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Logger } from '../../util/log';

import { EntityType } from '../../model';
import * as utils from '../../utils';
import Service from '../../services/appService';
import { PanelComponent } from '../../common/panel';
import grid from '../../services/data-grid';
import { API_URL } from '../../api/server';

const service = new Service();
const entityType: EntityType = 'employee';

@Component({
    template: require('./list.html'),
    components: {
        'panel': PanelComponent,
    }
})
export class EmployeesComponent extends Vue {

    name: 'employee-index';

    protected logger: Logger;

    entityType = entityType;

    id = 0;

    loading = false;

    object: { default: string } = { default: 'Default object property!' }; // objects as default values don't need to be wrapped into functions

    data () {
        return grid.data({   
            departmentList: [],
            tableName: '',
            url: API_URL + entityType,
            description: 'Each list you can customize by standard css styles. Each element is responsive so you can add to it any other element to improve functionality of list.',
            header: {
                title: 'Employees',
                icon: 'users',
                hidden: false,
                viewPath: '<small><span class="c-white">Employees</span></small>'
            },
        });
    }

    @Watch('dataSource')
    dataChanged(data) {
        grid.updateTable(this, data);
    }

    async mounted() {
        // console.log('Employees', this.$el.textContent); // I'm text inside the component.
        service.init(this);
        await service.getLookups(this, ['department']);
        grid.oncreate(this);
    }

    initTable() {
        const options = {
            processing: true,
            select: true,
            searching: true,
            data: this.$data['dataSource'],  // (this.$data as any).tableInstance,// this.$get('dataSource'),
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'title' },
                { data: (data, type, row, meta) => {
                    return '<a href="#departments/' + data.departmentId + '">' + this.getDepartmentName(data.departmentId) + '</a>';
                } },
                { data: 'rate' },
                { data: function (data, type, row, meta) {
                    return '<a href="#/employees/' + data.id + '" class="btn btn-default btn-xs">Edit</a>';
                } },
            ],
        };
        const table = grid.initTable(this, options);        
        table.on('select', (e, dt, type, indexes) => {
            // event handling for jquery.dataTables
            // see: https://datatables.net/examples/advanced_init/dt_events.html
            console.log('Select Employee', e, dt, type, indexes);
        });
    }
    
    getDepartmentName (id) {
        const department = this.$data['departmentList'].find(x => x.id === id);
        return department ? department.name : '';
    }
}

/*
    import grid from '../../services/data-grid';
    import Button from '../../components/Button.html';
    import ViewHeader from '../../components/ViewHeader.html';
    import Panel from '../../components/Panel.html';
    import { API_URL } from '../../api/server';
    import Service from './service';

    const service = new Service();
    const entityType = 'employee';

    export default {
        components: {
            ViewHeader,
            Panel,
            Button,
        },
        data: () => grid.data({   
            departmentList: [],
            tableName: '',
            url: API_URL + entityType,
            description: 'Each list you can customize by standard css styles. Each element is responsive so you can add to it any other element to improve functionality of list.'
        }),
        methods: {
            getDepartmentName: function (id) {
                const department = this.get('departmentList').find(x => x.id === id);
                return department ? department.name : '';
            },
            getTable: function () {
                return $(this.refs.rtable);
            },
            initTable: function () {
                const options = {
                    processing: true,
                    // select: true,
                    searching: true,
                    data: this.get('dataSource'),
                    columns: [
                        { data: 'id' },
                        { data: 'name' },
                        { data: 'title' },
                        { data: (data, type, row, meta) => {
                            return '<a href="#departments/' + data.departmentId + '">' + this.getDepartmentName(data.departmentId) + '</a>';
                        } },
                        { data: 'rate' },
                        { data: function (data, type, row, meta) {
                            return '<a href="#employees/' + data.id + '" class="btn btn-default btn-xs">Edit</a>';
                        } },
                    ],
                };
                const table = this.getTable().DataTable(options);
                this.set({ tableInstance: table }); // // https://svelte.technology/guide#component-set-data-
                table.on('select', (e, dt, type, indexes) => {
                    // event handling for jquery.dataTables
                    // see: https://datatables.net/examples/advanced_init/dt_events.html
                });
                // console.log('refs', this.refs);
            },
            initHeader() {			
				const headerData = {
					title: 'Employees',
					icon: 'users',
                    hidden: false,
					viewPath: '<small><span class="c-white">Employees</span></small>'
				};
				this.get('pageHeader').set(headerData);
			},
            updateTable: grid.methods.updateTable,
            loadData: grid.methods.loadData
        },
        oncreate() {
            this.initHeader();
            service.getLookups(this, ['department'])
                .then(() => {
                    this.loadData();
                    grid.oncreate(this);
                });
        },
        ondestroy: grid.ondestroy
*/