var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.SetDate();
        this.ReloadData();
        this.BindInputEvent();
        this.ReloadChart();
        this.SetModeCode();
        this.SetElementCode();
        $('#run').on('click', this.OnRunButtonClick.bind(this));
        $('#run').trigger("click");
        $('.port-method button').on('click', this.SelectType.bind(this));
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
        window.onresize = this.ReLayout.bind(this);

        $(".return-content li").eq(0).show();
    };

    this.ReLayout = function () {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.content').width(windowWidth - 724);
        $('.return-content li').height(windowHeight - 163);
        $('.describe').height(windowHeight - 168);
    };

    this.ReloadData = function () {
        var params = this.GetParams();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'debug/GetLineValues',
            success: function (result) {
                this.result = result;
                this.SetReturnData(result);
                this.SetChartData(this.result)
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var startTime = $("#start-time").datetimebox("getValue");
        var startFormat = moment(startTime).format('YYYYMMDDHHmm');
        var endTime = $("#end-time").datetimebox("getValue");
        var endFormat = moment(endTime).format('YYYYMMDDHHmm');
        var initialTime = $("#initial").datetimebox("getValue");
        var initialFormat = moment(initialTime).format('YYYYMMDDHHmm') == 'Invalid date' ? '' : moment(initialTime).format('YYYYMMDDHHmm');

        return {
            URL: 'http://10.129.4.202:9535/Search/GetLineValues',
            requestMode: $('.port-method button.active').text(),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combotree('getText'),
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
            forecastLevel: $('#forecast').val(),
            startTime: startFormat,
            endTime: endFormat,
            initialTime: initialFormat
        }
    };

    this.OnRunButtonClick = function () {
        this.ReloadData();
    };

    this.SetReturnData = function (data) {
        $('#data').text(data.resutl);
    };

    this.SelectType = function (event) {
        $('.port-method button').removeClass("active");
        $(event.target).addClass("active");
    };

    this.BindInputEvent = function () {
        $('.port-detail').find('.port-des').each(function () {
            $(this).find('div').children('input.focus').hover(function () {
                $(this).focus();
            })
        });
    };

    this.PortCallTab = function (event) {
        $('.return-title ul li').removeClass("active");
        $(event.target).addClass("active");

        var index = $(event.target).index();
        $(".return-content li").eq(index).css("display","block").siblings().css("display","none");

    };

    this.SetChartData = function (result) {
        this.result = result;
        var yMarks = [];
        var elementSeries = [];
        var yAxis = this.GetChartYAxis();
        yMarks.push(yAxis);
        var xMarks = this.GetChartXMarks();
        var values = this.GetChartElementValues();
        var series = this.GetChartElementSeries(values, yMarks.length - 1);
        elementSeries.push(series);
        this.ReloadChart(xMarks, yMarks, elementSeries);
    };

    this.GetChartXMarks = function () {
        var marks = [];

        this.result.searchResultInfos.data.forEach(function (item, index) {
            var time = item.forecastTime;
            marks.push(moment(time).format('MM-DD HH:ss'));
        }.bind(this));

        return marks;
    };

    this.GetChartElementValues = function () {
        var values = [];

        this.result.searchResultInfos.data.forEach(function (item, index) {
            if (item.elementCode === 'EDA10')
                values.push(item.grids[0].value);
            else
                values.push(item.grids[0].value);
        }.bind(this));

        return values;
    };

    this.GetChartYAxis = function () {
        return {
            title: {
                text: '数据展示',
                style: {
                    fontFamily: '微软雅黑'
                }
            },
            minPadding: 0,
            maxPadding: 0,
            labels: {
                formatter: function () {
                    return this.value;// + '%';
                }
            }
        };
    };

    this.GetChartElementSeries = function (values, yAxisIndex) {
        return {
            yAxis: yAxisIndex,
            data: values,
            pointWidth: 30,
            tooltip: {
                headerFormat: '预报日期：{point.x}<br>',
                pointFormat: '值：{point.y:.2f}'
            }
        };
    };

    this.ReloadChart = function (xMarks, yMarks, elementSeries) {
        Highcharts.chart('chart', {
            chart: {
                backgroundColor: '#27293d'
            },
            title: {
                text: null,
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
                enabled: false
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

    this.SetDate = function () {
        $('#start-time').datetimebox({
            panelWidth: 200,
            panelHeight: 260,
            showSeconds: false
        });

        $('#end-time').datetimebox({
            panelWidth: 200,
            panelHeight: 260,
            showSeconds: false
        });

        $('#initial').datetimebox({
            panelWidth: 200,
            panelHeight: 260,
            showSeconds: false
        });
    };

    this.SetModeCode = function () {
        $('#ModeCode').combobox({
            panelHeight: 'auto'
        });
    };

    this.SetElementCode = function () {
        $.ajax({
            type: "POST",
            dataType: 'json',
            async:false,
            url: 'debug/GetElementCodeByModeCode',
            success: function (result) {
                $('#element').combotree('loadData', this.HandlerReturnElementCode(result));
            }.bind(this),
        });

        $('#element').combotree({
            //onlyLeafCheck:true,
            onSelect : function(node) {
                var tree = $(this).tree;
                var isLeaf = tree('isLeaf', node.target);
                if (!isLeaf) {
                    $('#element').treegrid("unselect");
                }
            }
        });

        $('#element').combotree('setValue', 'TMP');

    };

    this.HandlerReturnElementCode = function (results) {
        var Array = [];
        var combotreeData = new CombotreeData(0, 'SPCC');
        combotreeData.initData(results['SPCC']);
        Array.push(combotreeData);

        var combotreeDatas = new CombotreeData(5, 'SCMOC');
        combotreeDatas.initData(results['SCMOC']);
        Array.push(combotreeDatas);
        return Array;
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});