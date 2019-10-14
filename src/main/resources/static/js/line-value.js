var App = function () {

    this.elementCodeInfo;

    this.Startup = function () {
        this.ReLayout();
        this.InitComboBox('#orgCode');
        this.InitComboBox('#element');
        this.InitComboBox('#initial-time');
        this.SetDate();
        this.ElementCodeSelect();
        this.SetModeCode();
        //this.HandlerReturnElementCode();
        this.ReloadData();
        this.BindInputEvent();
        this.ReloadChart();

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
        var initialTime = $("#initial-time").combobox("getText");

        return {
            URL: 'http://10.129.4.202:9535/weather/GetLineValues',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combobox('getText'),
            lat: $('#latitude').val(),
            lon: $('#longitude').val(),
            orgCode: $('#orgCode').combobox('getText'),
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
        var uValue = this.GetChartElementUvalues();
        var vValue = this.GetChartElementVvalues();

        var series = this.GetChartElementSeries(values, yMarks.length - 1);
        var uValuEserie = this.GetChartElementSeries(uValue, yMarks.length - 1);
        var vValuEserie = this.GetChartElementSeries(vValue, yMarks.length - 1);
        elementSeries.push(series);
        elementSeries.push(uValuEserie);
        elementSeries.push(vValuEserie);

        this.ReloadChart(xMarks, yMarks, elementSeries);
    };

    this.GetChartXMarks = function () {
        var marks = [];

        if( this.result.searchResultInfos.data === null)
            return null

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
            var time = item.forecastTime;
            marks.push(moment(time).format('MM-DD HH:ss'));
        }.bind(this));

        return marks;
    };

    this.GetChartElementValues = function () {
        var values = [];

        if( this.result.searchResultInfos.data === null)
            return null

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
                values.push(item.value);
        }.bind(this));

        return values;
    };

    this.GetChartElementUvalues = function () {
        var value = [];

        if( this.result.searchResultInfos.data === null)
            return null

        this.result.searchResultInfos.data.elementLineData.values.forEach(function (item, index) {
                value.push(item.uvalue);
        }.bind(this));

        return value;
    };

    this.GetChartElementVvalues = function () {
        var value = [];

        if( this.result.searchResultInfos.data === null)
            return null

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

      /*  $('#initial').datetimebox({
            panelWidth: 200,
            panelHeight: 260,
            showSeconds: false
        });*/
    };

    this.SetModeCode = function () {
        $('#ModeCode').combobox({
            panelHeight: 'auto',
            onSelect: function (result) {
                this.GettingValuesThroughModecode(result.value);
            }.bind(this)
        });
    };

    this.ElementCodeSelect = function(){
        $('#element').combobox({
            panelHeight: 'auto',
            onSelect: function (result) {
                this.SetInitialTimesAndOrgCodesByElementCodeChange(result.text);
            }.bind(this)
        });
    }

    this.SetInitialTimesAndOrgCodesByElementCodeChange = function (elementCode) {
        var initialTimes = [];
        var orgCodes = [];
        $(this.elementCodeInfo.searchResultInfo.data).each(function (index, item) {
            if (item.elementCode == elementCode){
                if (initialTimes.indexOf(item.initialTime) === -1)
                    initialTimes.push(moment(item.initialTime).format("YYYY/MM/DD HH:mm"));

                if (orgCodes.indexOf(item.orgCode) === -1)
                    orgCodes.push(item.orgCode);
            }
        }.bind(this));

        var initialTimeInfos = this.GetCodeInfos(initialTimes);
        var orgCodeInfos = this.GetCodeInfos(orgCodes);

        $('#initial-time').combobox({
            data: initialTimeInfos,
            valueField: 'id',
            textField: 'text',
            onLoadSuccess: function () {
                $('#initial-time').combobox('select', initialTimeInfos.length - 1)
            },
            panelHeight: "auto"
        })

        $('#orgCode').combobox({
            data: orgCodeInfos,
            valueField: 'id',
            textField: 'text',
            panelHeight: height = orgCodeInfos.length > 6 ? 300 : "auto"
        })
    }

    this.getElementCodes = function () {
        var elementCodes = [];
        $(this.elementCodeInfo.searchResultInfo.data).each(function (index, item) {
            if (elementCodes.indexOf(item.elementCode) === -1)
                elementCodes.push(item.elementCode);
        }.bind(this));
        return elementCodes;
    }

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
            url:'debug/GetModeCodeValues',
            success:function (result) {
                this.elementCodeInfo = result;

                var elementCodes = this.getElementCodes();
                var elementCodeInfos = this.GetCodeInfos(elementCodes);

                $('#element').combobox({
                    data: elementCodeInfos,
                    valueField: 'id',
                    textField: 'text',
                    panelHeight: elementCodeInfos.length > 6 ? 300 : "auto"
                });
            }.bind(this)
        })
    };

    this.GetCodeInfos = function (codes) {
        var codeInfos = [];
        codes.forEach(function (item, index) {
            codeInfos.push({"id": index, "text": item});
        }.bind(this));

        return codeInfos;
    }


};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});