var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.CalendarControl();
        this.ReloadPortTable();
        this.ReLoadTableData();
        this.SetSelectPanel();
        this.ReLoadPortComboBoxData();
        this.ReLoadCallerComboBoxData();
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var width = $('.content').width();
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.datagrid').width(width - 20);
        $('.log-table').width(width - 20);
        $('.log-table,.datagrid-wrap').height(windowHeight - 475);
    };

    this.ReLoadPortComboBoxData = function () {
        $('#name').combobox({
            url:"log/findAllCheckInfo",
            valueField:'name',
            textField:'name',
            onLoadSuccess: function (data) {
                console.log(data);
                var item = $('#name').combobox('getData');
                if (item.length > 0) {
                    $('#name').combobox('select',data[0].name);
                }
            }
        });
    };

    this.ReLoadCallerComboBoxData = function () {
        $('#caller').combobox({
            panelHeight: 'auto',
            url:"caller/findAllByEnable",
            valueField:'name',
            textField:'name',
            onLoadSuccess: function (data) {
                console.log(data)
                var item = $('#caller').combobox('getData');
                if (item.length > 0) {
                    $('#caller').combobox('select',data[0].name);
                }
            }
        });
    };

    this.ReLoadTableData = function () {
        var params = this.GetParams();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'log/findAllByCallerAndNameAndStateAndTime',
            success: function (result) {
                console.log(result);
                $('#log-table').datagrid('loadData', result.list);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var options = $('#log-table').datagrid("getPager" ).data("pagination" ).options;
        var size = options.pageSize;
        return{
            name : $('#name').combobox('getValue') === '' ? '全部' : $('#name').combobox('getValue'),
            callerCode: $('#caller').combobox('getValue') === '' ? '-1' : $('#caller').combobox('getValue'),
            startTime: $('#start-date').datebox('getValue'),
            endTime: $('#end-date').datebox('getValue'),
            state: $('#state').combobox('getValue') === '全部' ? -1 : $('#state').combobox('getValue') === '成功' ? 1 : 0,
            pageNum: 1,
            pageSize: size
        }
    };

    this.ReloadPortTable = function () {
        var width = $(window).width();
        $('#log-table').datagrid({
            columns: [[
                { field: 'name', title: '名称', align: 'center', width: width * 0.12},
                { field: '状态', title: '状态', align: 'center', width: width * 0.12},
                { field: '调用者', title: '调用者', align: 'center', width: width * 0.2},
                { field: '开发时间', title: '开发时间', align: 'center', width: width * 0.2},
                { field: '结束时间', title: '结束时间', align: 'center', width: width * 0.2},
                { field: '结束时间', title: '耗时（s）', align: 'center', width: width * 0.2, formatter: this.TimeFormatter.bind(this)}
            ]],
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 2,
            pageList: [1, 2, 3],
            loadMsg: '正在加载数据，请稍后...',
            onBeforeLoad: this.OnTableGridBeforeLoad.bind(this),
            onLoadSuccess: this.OnTableGridLoaded.bind(this)
        });
    };

    this.TimeFormatter = function (value, row) {
        var item = value === 0 ? value : (value * 0.001).toFixed(4);
        return item;
    };

    this.OnTableGridBeforeLoad = function () {
        $('#log-table').datagrid('getPager').pagination({
            beforePageText: '第',
            afterPageText: '页&nbsp;&nbsp;&nbsp;共{pages}页',
            displayMsg: '当前显示{from}-{to}条记录&nbsp;&nbsp;&nbsp;共{total}条记录',
            layout: ['list', 'sep', 'first', 'prev', 'sep', 'manual', 'sep', 'next', 'last', 'sep', 'refresh', 'info']
        });
    };

    this.OnTableGridLoaded = function (data) {
        $('#log-table').datagrid('selectRow', 0);
    };

    this.CalendarControl = function () {
        $('#start-date').datebox({
            panelWidth: 203,
            panelHeight: 260,
            //showSeconds: true
        });

        $('#end-date').datebox({
            panelWidth: 203,
            panelHeight: 260
        });

        var startDate = moment().add(-1, 'months').format('YYYY/MM/DD');
        $("#start-date").datebox("setValue", startDate);
    };

    this.SetSelectPanel = function () {
        $('#state').combobox({
            panelHeight: 109
        });
    };

};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});