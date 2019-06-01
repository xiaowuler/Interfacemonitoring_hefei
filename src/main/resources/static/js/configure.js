var App = function () {
    this.table = $('#configure-table');

    this.Startup = function () {
        this.ReLayout();
        this.InitConfigureGrid();
        this.ReloadData();

        $('#add').on('click', this.OnAddButtonClick.bind(this));
        $('#add-close').on('click', this.AddDialogHide.bind(this));
        $('#add-sure').on('click', this.AddConfigure.bind(this));
        $('#add-quit').on('click', this.AddDialogHide.bind(this));
        $('#add-switch a').on('click', this.OnSwitchButtonClick.bind(this));

        $('#edit').on('click', this.OnEditButtonClick.bind(this));
        $('#edit-close').on('click', this.EditDialogHide.bind(this));
        $('#edit-sure').on('click', this.EditConfigure.bind(this));
        $('#edit-quit').on('click', this.EditDialogHide.bind(this));
        $('#edit-switch a').on('click', this.OnSwitchButtonClick.bind(this));
        $('#delete').on('click', this.OnDeleteButtonClick.bind(this));
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var width = $('.content').width();
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.datagrid').width(width - 20);
        $('.configure-table').width(width - 20);
        $('.configure-table,.datagrid-wrap').height(windowHeight - 130);
    };

    this.ReloadData = function () {
        this.table.datagrid({
            method: "POST",
            url: 'config/findAllByPage'
        });
    };

    this.InitConfigureGrid = function () {
        var width = $(window).width() - 214;
        this.table.datagrid({
            //height: window.innerHeight-160,
            columns: [[
                { field: 'name', title: '名称', align: 'center', width: width * 0.2},
                { field: 'value', title: '值', align: 'center', width: width * 0.2},
                { field: 'description', title: '描述', align: 'center', width: width * 0.2}
            ]],
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            scrollbarSize: 0,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 30, 50],
            loadMsg: '正在加载数据，请稍后...',
            onBeforeLoad: this.OnTableGridBeforeLoad.bind(this),
            onLoadSuccess: this.OnTableGridLoaded.bind(this)
        });
    };

    this.OnTableGridLoaded = function (data) {
        this.table.datagrid('selectRow', 0);
    };

    this.OnTableGridBeforeLoad = function () {
        this.table.datagrid('getPager').pagination({
            beforePageText: '第',
            afterPageText: '页&nbsp;&nbsp;&nbsp;共{pages}页',
            displayMsg: '当前显示{from}-{to}条记录&nbsp;&nbsp;&nbsp;共{total}条记录',
            layout: ['list', 'sep', 'first', 'prev', 'sep', 'manual', 'sep', 'next', 'last', 'sep', 'refresh', 'info']
        });
    };

    this.OnAddButtonClick = function () {
        $('.dialog-add').show();
        $('.dialog-bg').show();
        $('.option input, .option textarea').val("")
    };

    this.AddDialogHide = function () {
        $('.dialog-add').hide();
        $('.dialog-bg').hide();
    };

    this.OnEditButtonClick = function () {
        $('.dialog-edit').show();
        $('.dialog-bg').show();

        var selected = this.table.datagrid('getSelected');
        $('#edit-name').attr("value",selected.name);
        $('#edit-value').attr("value",selected.value);
        $('#edit-describe').attr("value",selected.description);

        var index = this.table.datagrid('getRowIndex',selected.id);
        this.table.datagrid('beginEdit',index);
    };

    this.EditDialogHide = function () {
        $('.dialog-edit').hide();
        $('.dialog-bg').hide();
    };

    this.OnSwitchButtonClick = function (event) {
        $(event.target).parent().toggleClass('switch-on');
    };

    this.AddConfigure = function () {
        this.AddDialogHide();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: {
                name: $('#add-name').val(),
                value: $('#add-value').val(),
                description: $('#add-describe').val()
            },
            url: 'config/insert',
            success: function (result) {
                this.ReloadData();
            }.bind(this)
        });
    };

    this.EditConfigure = function () {
        this.EditDialogHide();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: {
                name: $('#edit-name').val(),
                value: $('#edit-value').val(),
                description: $('#edit-describe').val()
            },
            url: 'config/updateById',
            success: function (result) {
                this.ReloadData();
            }.bind(this)
        });
    };

    this.OnDeleteButtonClick = function () {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'config/delete',
            data: {
                id: this.table.datagrid('getSelected').id
            },
            success: function (result) {
                this.ReloadData();
            }.bind(this)
        });
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});