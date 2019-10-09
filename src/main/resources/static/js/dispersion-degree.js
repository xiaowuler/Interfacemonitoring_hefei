var App = function () {
    this.MapInfo = new MapInfo();
    this.ColorContorl = new ColorContorl();

    this.Startup = function () {
        this.ReLayout();
        this.GettingValuesThroughModecode();
      //  this.CreateMap();
     //   this.ReloadData();
        this.InitComboBox('#initial-time');
        this.SetDate();
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
        var forecastTime = $("#forecast-time").datetimebox("getValue");
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

    this.SetDate = function () {
        $('#forecast-time').datetimebox({
            panelWidth: 170,
            panelHeight: 260,
            showSeconds: false
        });
    };
    /*this.ShowDetailUrl = function () {
        var params = this.GetParams();
        var initialTime = params.initialTime;
        var pattern = '{0}?requestMode={1}&ModeCode={2}&ElementCode={3}&Latitude={4}&Longitude={5}&ForecastLevel={6}&ForecastTime={7}{8}';
        var label = pattern.format(url, requestMode, modeCode, elementCode, lat, lon, forecastLevel, forecastTime, init);
        $('#port-url').text(label);
    };*/

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


    this.SetModeCode = function () {
        $('#ModeCode').combobox({
            panelHeight: 'auto',
            onSelect: function (result) {
                this.GettingValuesThroughModecode(result.value);
            }.bind(this)
        });
    };

    this.GetModecode = function () {
        return {
            URL: 'http://10.129.4.202:9535/weather/GetElementInfosByModeCode',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: 'ec_ens'
        }
    };

    this.InitComboBox = function (id) {
        $(id).combobox({
            valueField:'id',
            textField:'text',
            editable:false,
        });
    };


    this.GettingValuesThroughModecode=function(){
        var params=this.GetModecode();
        $.ajax({
            type:"POST",
            dateType:"json",
            data:params,
            async:false,
            url:'debug/GetElementInfosByModeCode',
            success:function (result) {
                var initialList = [];

                result.initialTime.forEach(function (item, index) {
                    initialList.push({"id": index, "text": item});
                }.bind(this));

                $('#initial-time').combobox({
                    data: initialList,
                    valueField: 'id',
                    textField: 'text',
                    onLoadSuccess: function () {
                        $('#initial-time').combobox('select', initialList.length - 1)
                    },
                    panelHeight: height = initialList.length > 6 ? 260 : "auto"
                });
            }
        })
    };
}

$(document).ready(function () {
    var app = new App();
    app.Startup();
});