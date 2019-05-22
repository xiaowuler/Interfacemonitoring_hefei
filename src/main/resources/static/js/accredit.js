var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.ReloadPortTable();
        $('#add').on('click', this.OnAddButtonClick.bind(this));
        $('#add-close').on('click', this.AddDialogHide.bind(this));
        $('#add-sure').on('click', this.AddDialogHide.bind(this));
        $('#add-quit').on('click', this.AddDialogHide.bind(this));
        $('#add-switch a').on('click', this.OnSwitchButtonClick.bind(this));

        $('#edit').on('click', this.OnEditButtonClick.bind(this));
        $('#edit-close').on('click', this.EditDialogHide.bind(this));
        $('#edit-sure').on('click', this.EditDialogHide.bind(this));
        $('#edit-quit').on('click', this.EditDialogHide.bind(this));
        $('#edit-switch a').on('click', this.OnSwitchButtonClick.bind(this));
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.accredit-table').height(windowHeight - 139);
        $('.accredit-table, .datagrid').width($('.content').width() - 10);
        $('.panel-body').height(windowHeight - 139);
        $('.datagrid-view').height($('.accredit-table').height() - 55);
    };

    this.ReloadPortTable = function () {
        $('#accredit-table').datagrid({
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [5, 10, 15]
        });
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
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});