var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.SetElementCode();
        this.SetDate();
        this.ReloadData();
        this.BindInputEvent();
        this.ReloadChart();
        this.SetModeCode();
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
        if (params.requestMode === 'GET'){
            this.ShowDetailUrl();
            $('.port-text').show();
        } else
            $('.port-text').hide();

        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'debug/GetLineValues',
            success: function (result) {
                this.result = result;
                this.SetReturnData(result.searchResultInfos);
                this.SetChartData(result)
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var startForecastTime = $("#start-time").datetimebox("getValue");
        var endForecastTime = $("#end-time").datetimebox("getValue");
        var initialTime = $("#initial").datetimebox("getValue");

        return {
            URL: 'http://10.129.4.202:9535/weather/GetLineValues',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combotree('getText'),
            lat: $('#latitude').val(),
            lon: $('#longitude').val(),
            orgCode: $('#orgCode').val(),
            startForecastTime: startForecastTime,
            endForecastTime: endForecastTime,
            initialTime: initialTime
        }
    };

    this.ShowDetailUrl = function () {
        var params = this.GetParams();
        var url = params.URL;
        var requestMode = params.requestMode;
        var modeCode = params.modeCode;
        var elementCode = params.elementCode;
        var latitude = params.lat;
        var longitude = params.lon;
        var orgCode = params.orgCode;
        var startForecastTime = params.startForecastTime;
        var endForecastTime = params.endForecastTime;
        var initialTime = params.initialTime;
        var init;
        if (initialTime === '' || initialTime === undefined || initialTime === null)
            init = '';
        else
            init = '&InitialTime =' + initialTime;

        var pattern = '{0}?RequestMode={1}&ModeCode={2}&ElementCode={3}&Latitude={4}&Longitude={5}&ForecastLevel={6}&StartTime={7}&EndTime={8}{9}';
        var label = pattern.format(url, requestMode, modeCode, elementCode, latitude, longitude, orgCode, startForecastTime, endForecastTime, init);
        $('#port-url').text(label);
    };

    this.OnRunButtonClick = function () {
        this.ReloadData();
    };

    this.SetReturnData = function (result) {
        $('#data').text(JSON.stringify(result, null, 4));
       // $('#data').text(data.searchResultInfos);
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

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
            var time = item.forecastTime;
            marks.push(moment(time).format('MM-DD HH:ss'));
        }.bind(this));

        return marks;
    };

    this.GetChartElementValues = function () {
        var values = [];

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
            if (item.elementCode === 'EDA10')
                values.push(item.value);
            else
                values.push(item.value);
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
            url: 'debug/GetElementCodesByModeCode',
            success: function (result) {
                $('#element').combotree('loadData', this.HandlerReturnElementCode(result));
            }.bind(this),
        });

        $('#element').combotree({
            //onlyLeafCheck:true,
            panelHeight: 300,
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