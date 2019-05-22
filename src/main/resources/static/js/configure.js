var App = function () {

    this.Startup = function () {
        this.ReloadPortTable();
        this.ReLayout();

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
        $('.configure-table').height(windowHeight - 139);
        $('.configure-table, .datagrid').width($('.content').width() - 10);
        $('.panel-body').height(windowHeight - 139);
        $('.datagrid-view').height($('.configure-table').height() - 55);
    };

    this.ReloadPortTable = function () {
        $('#configure-table').datagrid({
            height: window.innerHeight-160,
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [5, 10, 15],
            onLoadSuccess: function () {
                //一定要加上这一句，要不然datagrid会记住之前的选择状态，删除时会出问题
                $('#configure-table').datagrid('clearSelections');
            }
        });

        //this.SetPortTablePager();
    };

    this.SetPortTablePager = function () {
        var pager = $("#configure-table").datagrid("getPager");
        pager.pagination({
            total:data.length,
            displayMsg:'当前显示从第{from}条到{to}条 共{total}条记录',
            onSelectPage:function (pageNo, pageSize) {
                var start = (pageNo - 1) * pageSize;
                var end = start + pageSize;
                $("#easyuiTable").datagrid("loadData", data.slice(start, end));
                pager.pagination('refresh', {
                    total:data.length,
                    pageNumber:pageNo
                });
            }
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