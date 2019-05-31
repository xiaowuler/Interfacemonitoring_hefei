var App = function () {
    this.table = $('#configure-table');

    this.Startup = function () {
        this.ReLayout();
        this.ReloadPortTable();
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
        var params = this.GetParams();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'config/findAllByPage',
            success: function (result) {
                console.log(result);
                this.table.datagrid('loadData', result.rows);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var options = this.table.datagrid("getPager" ).data("pagination" ).options;
        var size = options.pageSize;
        return{
            pageNum: 1,
            pageSize: size
        }
    };

    this.ReloadPortTable = function () {
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
            onLoadSuccess: this.OnTableGridLoaded.bind(this)
        });
    };

    this.OnTableGridLoaded = function (data) {
        this.table.datagrid('selectRow', 0);
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

    this.AddConfigure = function () {
        this.AddDialogHide();
    };

    this.EditConfigure = function () {
        this.EditDialogHide();
    };

    this.OnDeleteButtonClick = function () {

    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});