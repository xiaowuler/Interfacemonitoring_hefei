var App = function () {
    this.table = $('#user-table');

    this.Startup = function () {
        this.ReLayout();
        this.InitUserGrid();
        this.ReloadData();

        $('#add').on('click', this.OnAddButtonClick.bind(this));
        $('#add-close').on('click', this.AddDialogHide.bind(this));
        $('#add-sure').on('click', this.AddUser.bind(this));
        $('#add-quit').on('click', this.AddDialogHide.bind(this));
        $('#add-switch a').on('click', this.OnSwitchButtonClick.bind(this));

        $('#edit').on('click', this.OnEditButtonClick.bind(this));
        $('#edit-close').on('click', this.EditDialogHide.bind(this));
        $('#edit-sure').on('click', this.EditUser.bind(this));
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
        $('.user-table').width(width - 20);
        $('.user-table,.datagrid-wrap').height(windowHeight - 130);
    };

    this.ReloadData = function () {
        this.table.datagrid({
            method: "POST",
            url: 'user/findAllByPage'
        });
    };

    this.InitUserGrid = function () {
        var width = $(window).width() - 214;
        this.table.datagrid({
            columns: [[
                { field: 'name', title: '用户名', align: 'center', width: width * 0.2},
                { field: 'password', title: '密码', align: 'center', width: width * 0.2},
                { field: 'enabled', title: '是否启用', align: 'center', width: width * 0.2, formatter: this.StateFormatter.bind(this)}
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

    this.StateFormatter = function (value, row) {
        if(value === 1){
            return '<span class="enable">已启用</span>';
        } else {
            return '<span class="disable">已禁用</span>';
        }
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
        $('.option input').val("")
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
        $('#edit-password').attr("value",selected.password);
        if (selected.enabled === 1)
            $('#edit-switch').addClass('switch-on');
        else
            $('#edit-switch').removeClass('switch-on');
    };

    this.EditDialogHide = function () {
        $('.dialog-edit').hide();
        $('.dialog-bg').hide();
    };

    this.OnSwitchButtonClick = function (event) {
        $(event.target).parent().toggleClass('switch-on');
    };

    this.AddUser = function () {
        this.AddDialogHide();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: {
                name: $('#add-name').val(),
                password: $('#add-password').val(),
                enabled: $('#add-switch').hasClass('switch-on') ? 1 : 0
            },
            url: 'user/insert',
            success: function (result) {
                this.ReloadData();
            }.bind(this)
        });
    };

    this.EditUser = function () {
        this.EditDialogHide();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: {
                id: this.table.datagrid('getSelected').id,
                name: $('#edit-name').val(),
                password: $('#edit-password').val(),
                enabled: $('#edit-switch').hasClass('switch-on') ? 1 : 0
            },
            url: 'user/updateById',
            success: function (result) {
                this.ReloadData();
            }.bind(this)
        });
    };

    this.OnDeleteButtonClick = function () {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'user/delete',
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