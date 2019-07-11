var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.CalendarControl();
        this.ReloadPortTable();
        this.SetSelectPanel();
        this.ReLoadPortComboBoxData();
        this.ReLoadCallerComboBoxData();
        $('#query-btn').on('click', this.OnQueryButtonClick.bind(this));

        $('#query-btn').trigger("click");
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
            valueField:'code',
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
        // $.ajax({
        //     type: "POST",
        //     dataType: 'json',
        //     data: params,
        //     url: 'log/findAllByCallerAndNameAndStateAndTime',
        //     success: function (result) {
        //         $('#log-table').datagrid('loadData', result);
        //     }.bind(this)
        // });

        $('#log-table').datagrid({
            method: "POST",
            url: 'log/findAllByCallerAndNameAndStateAndTime',
            queryParams: params
        });
    };

    this.GetParams = function () {
        var name = $('#name').combobox('getValue');
        var caller = $('#caller').combobox('getValue');
        var state = $('#state').combobox('getValue');
        return{
            name : name === '' || name === '全部' ? '全部'  : name,
            callerCode: caller === '全部' || caller === '' ? '-1' : caller,
            startTime: $('#start-date').datebox('getValue'),
            endTime: $('#end-date').datebox('getValue'),
            state: state === '全部' || state === '' ? -1 : state === '成功' ? 1 : 0
        }
    };

    this.ReloadPortTable = function () {
        var width = $(window).width();
        $('#log-table').datagrid({
            columns: [[
                { field: 'name', title: '名称', align: 'center', width: width * 0.2},
                { field: 'state', title: '状态', align: 'center', width: width * 0.12, formatter: this.StateFormatter.bind(this)},
                { field: 'callerName', title: '调用者', align: 'center', width: width * 0.2},
                { field: 'startTime', title: '开发时间', align: 'center', width: width * 0.12, formatter: this.DateFormatter.bind(this)},
                { field: 'endTime', title: '结束时间', align: 'center', width: width * 0.12, formatter: this.DateFormatter.bind(this)},
                { field: 'consumingTime', title: '耗时（s）', align: 'center', width: width * 0.2, formatter: this.TimeFormatter.bind(this)}
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
            onLoadSuccess: this.OnTableGridLoaded.bind(this),
            onSelect: this.SetDetailText.bind(this)
        });
    };

    this.TimeFormatter = function (value) {
        var item = value === 0 ? value : (value * 0.001).toFixed(2);
        return item;
    };

    this.StateFormatter = function (value) {
        if(value === '成功'){
            return '<span class="success">成功</span>';
        } else {
            return '<span class="fail">失败</span>';
        }
    };

    this.DateFormatter = function (value, row) {
        return moment(value).format('YYYY/MM/DD');
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

    this.SetDetailText = function (index, data) {
        var url = data.log.name;
        var param = data.log.params;
        var message = data.log.errorMessage;
        $('#request-url').text(url);
        $('#request-param').text(param);
        $('#error-info').text(message);
    };

    this.CalendarControl = function () {
        $('#start-date').datebox({
            panelWidth: 203,
            panelHeight: 260
        });

        $('#end-date').datebox({
            panelWidth: 203,
            panelHeight: 260
        });

        var startDate = moment().add(-1, 'months').format('YYYY/MM/DD');
        var endDate = moment().add(1, 'days').format('YYYY/MM/DD');
        $("#start-date").datebox("setValue", startDate);
        $("#end-date").datebox("setValue", endDate);
    };

    this.SetSelectPanel = function () {
        $('#state').combobox({
            panelHeight: 109
        });
    };

    this.OnQueryButtonClick = function () {
        this.ReLoadTableData();
    };

};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});