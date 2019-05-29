var App = function () {
    this.result = null;

    this.Startup = function () {
        this.ReLayout();
        this.ReLoadChartData();
        this.ReloadPortTable();
        this.ReLoadTableData();
        this.ReloadPortChart();

        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.datagrid').width($('.content').width() - 20);
        $('.port-table').width($('.content').width() - 20);
        $('.port-table,.datagrid-wrap').height(windowHeight - 475);
    };

    this.ReLoadChartData = function () {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'log/findAllByDate',
            success: function (result) {
                //console.log(result);
                this.result = result;
                this.SetChartData(this.result)
            }.bind(this)
        });
    };

    this.ReLoadTableData = function () {
        var params = this.GetParams();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'log/findAllByState',
            success: function (result) {
                console.log(result);
                $('#port-table').datagrid('loadData', result.list);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var options = $('#port-table').datagrid("getPager" ).data("pagination" ).options;
        var size = options.pageSize;
        return {
            pageNum: 1,
            pageSize: size
        };
    };

    this.SetChartData = function (result) {
        this.result = result;
        var yMarks = [];
        var elementSeries = [];
        var xMarks = this.GetChartXMarks();
        var titles = this.SetChartTitle();
        titles.forEach(function (title) {
            var opposite = title === '成功率' ? false : true;
            var yAxis = this.GetChartYAxis(title, opposite);
            yMarks.push(yAxis);

            var type = title === '成功率' ? 'column' : 'pareto';
            var values = this.GetChartElementValues(title);
            var series = this.GetChartElementSerie(type, title, values, yMarks.length - 1);
            elementSeries.push(series);
        }.bind(this));
        this.ReloadPortChart(xMarks, yMarks, elementSeries);
    };

    this.SetChartTitle = function () {
        var titles = ['成功率', '调用次数', '失败率', '平均耗时'];
        return titles;
    };

    this.GetChartXMarks = function () {
        var marks = [];

        this.result.forEach(function (item, index) {
            var port = item.log.name;
            marks.push(port)
        }.bind(this));

        return marks;
    };

    this.GetChartElementValues = function (title) {
        var values = [];

        this.result.forEach(function (value) {
            var seconds = (value.consumingAvg) * 0.001;
            if (title === '成功率')
                values.push(value.successRate);
            else if (title === '调用次数')
                values.push(value.callNumber);
            else if (title === '失败率')
                values.push(value.failureRate);
            else if (title === '平均耗时')
                values.push(seconds);
        }.bind(this));

        return values;
    };

    this.GetChartYAxis = function (title, opposite) {
        return {
            title: {
                text: title,
                style: {
                    fontFamily: '微软雅黑'
                }
            },
            opposite: opposite,
            minPadding: 0,
            maxPadding: 0,
            labels: {
                formatter: function () {
                    return this.value;// + '%';
                }
            }
        };
    };

    this.GetChartElementSerie = function (type, name, values, yAxisIndex) {
        var unit = this.SetUnit(name);
        return {
            type: type,
            name: name,
            yAxis: yAxisIndex,
            data: values,
            pointWidth: 30,
            tooltip: {
                headerFormat: '接口名：{point.x}<br>',
                pointFormat: '{series.name}：{point.y:.2f}' + unit
            }
        };
    };

    this.SetUnit = function (name) {
        if (name === '成功率')
            return '%';
        else if (name === '调用次数')
            return '次';
        else if (name === '失败率')
            return '%';
        else if (name === '平均耗时')
            return 's';
    };

    this.ReloadPortChart = function (xMarks, yMarks, elementSeries) {
        Highcharts.chart('port-chart', {
            chart: {
                type: 'column',
                backgroundColor: '#27293d'
            },
            title: {
                text: '接口基础信息',
                style:{
                    color: '#dbdbdb',
                    fontSize: '20px'
                }
            },
            subtitle: {
                text: null
            },
            credits: {
                enabled: false
            },
            colors: ['#1c96d5', '#ff5ee0', '#f7a45c', '#00ffff', '#1c96d5'],
            xAxis: {
                categories: xMarks,
                lineColor: '#999999'
            },
            yAxis: yMarks,
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
                x: -20,
                y: -20,
                itemStyle: {
                    color: '#9a9a9a',
                    fontSize: '14px'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#44474b',
                        lineWidth: 1
                    }
                },
                column: {
                    borderWidth: 0
                }
            },
            series: elementSeries
        });
    };

    this.ReloadPortTable = function () {
        var width = $(window).width();
        $('#port-table').datagrid({
            columns: [[
                { field: 'name', title: '分类', align: 'center', width: width * 0.12},
                { field: 'callNumberDay', title: '本天内调用次数', align: 'center', width: width * 0.2},
                { field: 'successRate', title: '成功率（%）', align: 'center', width: width * 0.2},
                { field: 'successConsumingAvg', title: '成功平均耗时（s）', align: 'center', width: width * 0.2, formatter: this.TimeFormatter.bind(this) },
                { field: 'failureConsumingAvg', title: '失败平均耗时（s）', align: 'center', width: width * 0.2, formatter: this.TimeFormatter.bind(this) }
            ]],
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [5, 10, 15],
            loadMsg: '正在加载数据，请稍后...',
            onBeforeLoad: this.OnTableGridBeforeLoad.bind(this),
            onLoadSuccess: this.OnTableGridLoaded.bind(this)
        });
    };

    this.TimeFormatter = function (value, row) {
        var item = value === 0 ? value : (value * 0.001).toFixed(2);
        return item;
    };

    this.OnTableGridBeforeLoad = function () {
        $('#port-table').datagrid('getPager').pagination({
            beforePageText: '第',
            afterPageText: '页&nbsp;&nbsp;&nbsp;共{pages}页',
            displayMsg: '当前显示{from}-{to}条记录&nbsp;&nbsp;&nbsp;共{total}条记录',
            layout: ['list', 'sep', 'first', 'prev', 'sep', 'manual', 'sep', 'next', 'last', 'sep', 'refresh', 'info']
        });
    };

    this.OnTableGridLoaded = function (data) {
        $('#port-table').datagrid('selectRow', 0);
        //this.ReLayout();
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});