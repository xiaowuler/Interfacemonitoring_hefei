var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.InitComboBox('#orgCode');
        this.InitComboBox('#element');
        this.InitComboBox('#initial-time');
        this.SetDate();
        this.GettingValuesThroughModecode();
        this.ReloadData();
        this.BindInputEvent();
        this.SetModeCode();
        this.HidePicture();

        $('#run').on('click', this.OnRunButtonClick.bind(this));
        $('#run').trigger("click");
        $('.port-method button').on('click', this.SelectType.bind(this));
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
        $('#box-diagram-img').on('click', this.OnDiagramImgClick.bind(this));
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
            url: 'debug/getBoxDiagram',
            success: function (result) {
                this.result = result;
                this.SetReturnData(result.boxDiagramResultInfo);
                if (result.picUrl == null)
                    return;
                this.setPictureSrc(result.picUrl);
            }.bind(this)
        });
    };
    
    this.setPictureSrc = function (url) {
        $("#box-diagram-img").attr('src', url);
        $("#shade-picture").attr('src', url);
    }

    this.GetParams = function () {
        var startForecastTime = $("#start-time").datetimebox("getValue");
        var endForecastTime = $("#end-time").datetimebox("getValue");
        var initialTime = $("#initial-time").combobox("getText");

        return {
            url: 'http://10.129.4.202:9535/weather/GetBoxDiagram',
            requestMode: $('.port-method button.active').attr('value'),
            lat: $('#latitude').val(),
            lon: $('#longitude').val(),
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

    this.OnDiagramImgClick = function () {
        $('.shade').show();

    };

    this.HidePicture = function () {

        $(document).mouseup(function(e){
            e.stopPropagation();
            var _con = $('.shade-picture');   // 设置目标区域
            if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                $('.shade').hide();
            }
        })
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
                values.push(item.value);
        }.bind(this));

        return values;
    };

    this.GetChartElementUvalues = function () {
        var value = [];

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
                value.push(item.uvalue);
        }.bind(this));

        return value;
    };

    this.GetChartElementVvalues = function () {
        var value = [];

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
            value.push(item.vvalue);
        }.bind(this));

        return value;
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

    };

    this.SetModeCode = function () {
        $('#ModeCode').combobox({
            panelHeight: 'auto',
            onSelect: function (result) {
                this.GettingValuesThroughModecode(result.value);
            }.bind(this)
        });
    };

    this.GetModecode = function (result) {
        var modeCodes= $('#ModeCode').combobox('getValue');
        var modeCode;
        if(result != null && result != modeCode)
            modeCode=result;
        else
            modeCode=modeCodes;
        return {
            URL: 'http://10.129.4.202:9535/weather/GetElementInfosByModeCode',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: modeCode
        }
    };

    this.InitComboBox = function (id) {
        $(id).combobox({
            valueField:'id',
            textField:'text',
            editable:false,
        });
    };

    this.GettingValuesThroughModecode=function(result){
        var params=this.GetModecode(result);
        var data = [];
        $.ajax({
            type:"POST",
            dateType:"json",
            data:params,
            async:false,
            url:'debug/GetElementInfosByModeCode',
            success:function (result) {
                var elementList = [];
                var initialList = [];
                var orgCodeList = [];

                result.elementCode.forEach(function (item, index) {
                    elementList.push({"id": index, "text": item});
                }.bind(this));

                result.initialTime.forEach(function (item, index) {
                    initialList.push({"id": index, "text": item});
                }.bind(this));

                result.orgCode.forEach(function (item, index) {
                    orgCodeList.push({"id": index, "text": item});
                }.bind(this));

                $('#element').combobox({
                    data: elementList,
                    valueField: 'id',
                    textField: 'text',
                    panelHeight: height = elementList.length > 6 ? 300 : "auto"
                });

                $('#initial-time').combobox({
                    data: initialList,
                    valueField: 'id',
                    textField: 'text',
                    onLoadSuccess: function () {
                        $('#initial-time').combobox('select', initialList.length - 1)
                    },
                    panelHeight: height = initialList.length > 6 ? 260 : "auto"
                });

                $('#orgCode').combobox({
                    data: orgCodeList,
                    valueField: 'id',
                    textField: 'text',
                    panelHeight: height = orgCodeList.length > 6 ? 300 : "auto"
                });
            }
        })
    };

};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});