var App = function () {
    this.table = $('#accredit-table');

    this.Startup = function () {
        this.ReLayout();
        this.ReloadPortTable();
        this.ReloadTableData();
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
        $('#delete').on('click', this.OnDeleteButtonClick.bind(this));
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var width = $('.content').width();
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        //$('.datagrid').width(width - 20);
        $('.accredit-table').width(width - 20);
        $('.accredit-table,.datagrid-wrap').height(windowHeight - 130);
    };

    this.ReloadTableData = function () {
        var params = this.GetParams();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'caller/findAllByPage',
            success: function (result) {
                console.log(result);
                this.table.datagrid('loadData', result.list);
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
        var width = $(window).width();
        this.table.datagrid({
            columns: [[
                { field: 'name', title: '名称', align: 'center', width: width * 0.2},
                { field: 'code', title: '编号', align: 'center', width: width * 0.2},
                { field: 'key', title: '密匙', align: 'center', width: width * 0.2},
                { field: 'enabled', title: '是否启用', align: 'center', width: width * 0.2, formatter: this.StateFormatter.bind(this)}
            ]],
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 30, 50],
            loadMsg: '正在加载数据，请稍后...',
            //onBeforeLoad: this.OnTableGridBeforeLoad.bind(this),
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

    this.OnAddButtonClick = function () {
        $('.dialog-add').show();
        $('.dialog-bg').show();
        //var uuid = this.createUUID();
    };

    this.AddDialogHide = function () {
        $('.dialog-add').hide();
        $('.dialog-bg').hide();
    };

    this.createUUID = function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    this.OnEditButtonClick = function () {
        $('.dialog-edit').show();
        $('.dialog-bg').show();
        var selected = this.table.datagrid('getSelected');
        $('#edit-name').attr("value",selected.name);
        $('#edit-number').attr("value",selected.code);
        $('#edit-key').attr("value",selected.key);
        if (selected.enabled === 1)
            $('#edit-switch').addClass('switch-on');
        else
            $('#edit-switch').addClass('switch-on');

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

    this.OnDeleteButtonClick = function () {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'caller/delete',
            data: {
                Id: this.table.datagrid('getSelected').Id
            },
            success: function (result) {
                this.ReloadTableData();
            }.bind(this)
        });
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});