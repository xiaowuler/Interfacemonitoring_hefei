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
        console.log(params);
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
                console.log(result);
                this.result = result;
                this.SetReturnData(result);
                //this.SetChartData(result)
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

    this.SetReturnData = function (data) {
        $('#data').text(data.result);
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

    this.ReloadChart = function () {
        Highcharts.chart('chart', {
            chart: {
                type: 'column',
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
            xAxis: {
                categories: ['05-11 00:00', '05-11 01:00', '05-11 02:00', '05-11 03:00', '05-11 04:00', '05-11 05:00', '05-11 06:00', '05-11 07:00', '05-11 08:00', '05-11 09:00', '05-11 10:00', '05-11 11:00', '05-11 12:00', '05-11 13:00', '05-11 14:00', '05-11 15:00', '05-11 16:00', '05-11 17:00', '05-11 18:00', '05-11 19:00', '05-11 20:00', '05-11 21:00', '05-11 22:00', '05-11 23:00'],
                lineColor: '#999999',
                tickmarkPlacement : 'on',
                labels : {
                    step:1,
                    rotation: -45
                }
            },
            yAxis: {
                title: {
                    text: '数据展示',
                    style: {
                        fontFamily: '微软雅黑'
                    }
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                headerFormat: '预报日期：{point.x}<br>',
                pointFormat: '值：{point.y:.2f}'
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
            series: [{
                data: [291,151,311,231,291,261,301,211,242,251,303,232,291,213,291,335,261,311,291,250,311,242,291,360]
            }]
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