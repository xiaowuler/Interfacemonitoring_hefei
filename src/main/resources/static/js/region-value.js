var App = function () {
    this.MapInfo = new MapInfo();
    this.ColorContorl = new ColorContorl();
    this.elementCodeInfo;

    this.Startup = function () {
        //this.SetElementCode();
        this.ReLayout();
        this.ElementCodeSelect();
        this.SetModeCode();
        this.InitComboBox('#orgCode');
        this.InitComboBox('#element');
        this.InitComboBox('#initial-time');
        this.InitComboBox('#foreast-time');
        this.ReloadData();
        this.BindInputEvent();

        $('#run').on('click', this.OnRunButtonClick.bind(this));
        $('#run').trigger("click");
        $('.port-method button').on('click', this.SelectType.bind(this));
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
        //this.BottomPanel.Startup();

        window.onresize = this.ReLayout.bind(this);
        $(".return-content li").eq(0).show();
        this.MapInfo.CreateEasyMap();

    };

    this.ReLayout = function () {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.content').width(windowWidth - 724);
        $('.return-content li,#map-height').height(windowHeight - 163);
        $('#describe').height(windowHeight - 168);
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
            url: 'debug/GetRegionValues',
            success: function (result) {
                this.SetReturnData(result.searchResultInfos);
                if (result.contourResult === null)
                    return;

                this.MapInfo.CreateSpotLayer(result.contourResult.spotPolygons, result.contourResult.legendLevels);
                this.ColorContorl.setColor(result.contourResult.legendLevels[0].type,this.returnColor(result.contourResult.legendLevels));
            }.bind(this)
        });
    };

    this.returnColor = function (colors) {
        var array = []
        var arrayColor = [];
        var arrayValue = [];
        $(colors).each(function (index,color) {
            if(index == 0){
                //arrayColor.push(new Array(color.Color,color.Color));
                arrayValue.push(color.BeginValue);
                arrayValue.push(color.EndValue);
            }else{
                //arrayColor.push(new Array(colors[index-1].Color,color.Color));
                arrayValue.push(color.EndValue);
            }
        }.bind(this));
        for(var i = colors.length -1 ; i >= 0; i--){
            if(i == 0){
                arrayColor.push(new Array(colors[i].Color,colors[i].Color));
            }else{
                arrayColor.push(new Array(colors[i-1].Color,colors[i].Color));
            }
        }
        array.push(arrayColor);
        array.push(arrayValue);
        return array;
    }

    this.GetParams = function () {
        var forecastTime = $("#forecast-time").combobox("getText");
        var initialTime = $("#initial-time").combobox("getText");

        return {
            URL: 'http://10.129.4.202:9535/weather/GetRegionValues',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combobox('getText'),
            startLat: $('#min-lat').val(),
            endLat: $('#max-lat').val(),
            startLon : $('#min-lon').val(),
            endLon: $('#max-lon').val(),
            orgCode: $('#orgCode').combobox('getText'),
            forecastTime: forecastTime,
            initialTime: initialTime
        }
    };

    this.ShowDetailUrl = function () {
        var params = this.GetParams();
        var url = params.URL;
        var requestMode = params.requestMode;
        var modeCode = params.modeCode;
        var elementCode = params.elementCode;
        var endLat = params.endLat;
        var startLat = params.startLat;
        var endLon = params.endLon;
        var startLon = params.startLon;
        var orgCode = params.orgCode;
        var forecastTime = params.forecastTime;
        var initialTime = params.initialTime;
        var init;
        if (params.initialTime === '' || params.initialTime === undefined || params.initialTime === null)
            init = '';
        else
            init = '&initialTime =' + initialTime;

        var pattern = '{0}?RequestMode={1}&ModeCode={2}&ElementCode={3}&MinLat={4}&MaxLat={5}&MinLon={6}&MaxLon={7}&ForecastLevel={8}&ForecastTime={9}{10}';
        var label = pattern.format(url, requestMode, modeCode, elementCode, endLat, startLat, endLon, startLon, orgCode, forecastTime, init);
        $('#port-url').text(label);
    };

    this.OnRunButtonClick = function () {
        this.ReloadData();
    };

    this.SetReturnData = function (data) {
        $('#data').text(JSON.stringify(data, null, 4));
     //   $('#data').text(data.searchResultInfos);
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

        L.Util.requestAnimFrame(this.MapInfo.Map.invalidateSize,this.MapInfo.Map,!1,this.MapInfo.Map._container);
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
            onSelect: function (result) {
                this.SetForecastTimeByInitialTime(result.text, elementCode);
            }.bind(this),
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

    this.SetForecastTimeByInitialTime = function (initialTime, elementCode) {
        var elementInfo;
        $(this.elementCodeInfo.searchResultInfo.data).each(function (index, item) {
            if (item.elementCode == elementCode && moment(item.initialTime).format("YYYY/MM/DD HH:mm") == initialTime){
                elementInfo = item;
                return false;
            }
        }.bind(this));

        var forecastTimes = [];
        var initialDateTime = moment(initialTime, "YYYY/MM/DD HH:mm");
        var times = parseInt(elementInfo.forecastPeriods / elementInfo.forecastInterval);
        var forecastInterval = parseInt(elementInfo.forecastInterval);
        for (var i = 1; i <= times; i++ ){
            var forecastTime = moment(initialDateTime).minute(i * forecastInterval).format("YYYY/MM/DD HH:mm");
            forecastTimes.push(forecastTime);
        }

        var forecastTimeInfos = this.GetCodeInfos(forecastTimes);
        $('#forecast-time').combobox({
            data: forecastTimeInfos,
            valueField: 'id',
            textField: 'text',
            panelHeight: forecastTimeInfos.length > 6 ? 300 : "auto"
        })
    }

    this.InitComboBox = function (id) {
        $(id).combobox({
            valueField:'id',
            textField:'text',
            editable:false,
        });
    };

    this.getElementCodes = function () {
        var elementCodes = [];
        $(this.elementCodeInfo.searchResultInfo.data).each(function (index, item) {
            if (elementCodes.indexOf(item.elementCode) === -1)
                elementCodes.push(item.elementCode);
        }.bind(this));
        return elementCodes;
    }

    this.GettingValuesThroughModecode=function(result){
        var params=this.GetModecode(result);
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