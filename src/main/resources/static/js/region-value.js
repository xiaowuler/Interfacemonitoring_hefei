var App = function () {

    this.MapInfo = new MapInfo();
    this.ColorContorl = new ColorContorl();

    this.Startup = function () {
        //this.SetElementCode();
        this.ReLayout();
        this.SetDate();
        this.InitComboBox('#orgCode');
        this.InitComboBox('#element');
        this.InitComboBox('#initial-time');
        this.GettingValuesThroughModecode();
        this.ReloadData();
        this.BindInputEvent();
        this.SetModeCode();

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
        var forecastTime = $("#forecast-time").datetimebox("getValue");
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

    this.SetDate = function () {
        $('#forecast-time').datetimebox({
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
                    panelHeight: /*height = initialList.length > 6 ? 260 :*/ "auto"
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