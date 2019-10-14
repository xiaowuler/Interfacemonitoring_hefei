var App = function () {
    this.MapInfo = new MapInfo();
    this.ColorContorl = new ColorContorl();
    this.elementCodeInfo;

    this.Startup = function () {
        this.ReLayout();
         this.GettingValuesThroughModecode();
      //  this.CreateMap();
        this.ReloadData();
        this.SetPredictionAging();
        this.BindInputEvent();


        $('#run').on('click', this.OnRunButtonClick.bind(this));
        $('#run').trigger("click");
        $('.port-method button').on('click', this.SelectType.bind(this));
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
        window.onresize = this.ReLayout.bind(this);

        $(".return-content li").eq(0).show();
        this.MapInfo.CreateEasyMap();
        this.MapInfo.GetProBorder();
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
            url: 'debug/DisplayIsobars',
            success: function (result) {
                this.SetReturnData(result);
                if (result == null)
                    return;

                if (result.contourResult == null)
                    return;

                if (result.contourResult.contourPolylines == null)
                    return;

                this.MapInfo.CreateSpotLayer(result.contourResult.spotPolygons, result.contourResult.legendLevels);
                this.ColorContorl.setColor(result.contourResult.legendLevels[0].type,this.returnColor(result.contourResult.legendLevels));
                this.MapInfo.CreateContourLayer(result.contourResult.contourPolylines);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var initialTime =  $("#initial-time").combobox("getText");
        var forecastTime = $("#forecast-time").combobox("getText");
        return {
            URL: 'http://10.129.4.202:9535/weather/GetRainfallSetDispersion',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: 'ec_ens',
            elementCode: 'pph',
            startLat: '29.41',
            endLat: '34.38',
            startLon : '114.54',
            endLon: '119.37',
            callerCode: 'sc002',
            forecastTime: forecastTime,
            initialTime: initialTime
        }
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

    this.SetPredictionAging = function () {
        $('#PredictionAging').combobox({
            panelHeight: 'auto',
        });
    };


    this.OnRunButtonClick = function () {
        this.ReloadData();
    };

    this.SetReturnData = function (result) {
        $('#data').text(JSON.stringify(result, null, 4));
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

    this.SetInitialTimesAndOrgCodesByElementCodeChange = function (elementCode) {
        var initialTimes = [];
        $(this.elementCodeInfo.searchResultInfo.data).each(function (index, item) {
            if (item.elementCode == elementCode){
                if (initialTimes.indexOf(moment(item.initialTime).format("YYYY/MM/DD HH:mm")) === -1)
                    initialTimes.push(moment(item.initialTime).format("YYYY/MM/DD HH:mm"));
            }
        }.bind(this));

        var initialTimeInfos = this.GetCodeInfos(initialTimes.sort());

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
    }

    this.SetForecastTimeByInitialTime = function (initialTime, elementCode) {
        var elementInfo;
        $(this.elementCodeInfo.searchResultInfo.data).each(function (index, item) {
            if (item.elementCode == elementCode && moment(item.initialTime).format("YYYY/MM/DD HH:mm") == initialTime) {
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

        this.GetModecode = function () {
            return {
                URL: 'http://10.129.4.202:9535/weather/GetElementInfosByModeCode',
                requestMode: $('.port-method button.active').attr('value'),
                modeCode: 'ec_ens'
            }
        };

        this.GettingValuesThroughModecode = function () {
            var params = this.GetModecode();
            $.ajax({
                type: "POST",
                dateType: "json",
                data: params,
                async: false,
                url: 'debug/GetModeCodeValues',
                success: function (result) {
                    this.elementCodeInfo = result;
                    var elementCode = 'PPH';
                    this.SetInitialTimesAndOrgCodesByElementCodeChange(elementCode);
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
}

$(document).ready(function () {
    var app = new App();
    app.Startup();
});