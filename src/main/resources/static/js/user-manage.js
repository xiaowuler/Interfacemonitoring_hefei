var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.ReloadPortTable();
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
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.user-table').height(windowHeight - 139);
        $('.user-table, .datagrid').width($('.content').width() - 10);
        $('.panel-body').height(windowHeight - 139);
        $('.datagrid-view').height($('.user-table').height() - 55);
    };

    this.ReloadPortTable = function () {
        $('#user-table').datagrid({
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [5, 10, 15],
            onLoadSuccess: this.OnTableGridLoaded.bind(this)
        });
    };

    this.OnTableGridLoaded = function (data) {
        this.table.datagrid('selectRow', 0);
    };

    this.OnAddButtonClick = function () {
        $('.dialog-add').show();
        $('.dialog-bg').show();
    };

    this.AddDialogHide = function () {
        $('.dialog-add').hide();
        $('.dialog-bg').hide();
    };

    this.OnEditButtonClick = function () {
        $('.dialog-edit').show();
        $('.dialog-bg').show();
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
                code: $('#add-password').val(),
                enable: $('#add-switch').hasClass('switch-on') ? 1 : 0
            },
            url: 'caller/insertOne',
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
                name: $('#edit-name').val(),
                code: $('#edit-number').val(),
                key: $('#edit-key').val(),
                enable: $('#edit-switch').hasClass('switch-on') ? 1 : 0
            },
            url: 'caller/update',
            success: function (result) {
                this.ReloadData();
            }.bind(this)
        });
    }
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});