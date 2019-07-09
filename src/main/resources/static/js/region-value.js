var App = function () {

    this.MapInfo = new MapInfo();
    this.ColorContorl = new ColorContorl();

    this.Startup = function () {

        this.ReLayout();
        this.SetDate();
        this.BindInputEvent();
        this.SetModeCode();
        this.SetElementCode();
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
                console.log(result);
                this.SetReturnData(result);
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
        var forecastFormat = moment(forecastTime).format('YYYYMMDDHHmm');
        var initialTime = $("#initial").datetimebox("getValue");
        var initialFormat = moment(initialTime).format('YYYYMMDDHHmm') == 'Invalid date' ? '' : moment(initialTime).format('YYYYMMDDHHmm');

        return {
            URL: 'http://10.129.4.202:9535/Search/GetRegionValues',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combotree('getText'),
            minLat: $('#min-lat').val(),
            maxLat: $('#max-lat').val(),
            minLon: $('#min-lon').val(),
            maxLon: $('#max-lon').val(),
            forecastLevel: $('#forecast-level').val(),
            forecastTime: forecastFormat,
            initialTime: initialFormat
        }
    };

    this.ShowDetailUrl = function () {
        var params = this.GetParams();
        var url = params.URL;
        var requestMode = params.requestMode;
        var modeCode = params.modeCode;
        var elementCode = params.elementCode;
        var minLat = params.minLat;
        var maxLat = params.maxLat;
        var minLon = params.minLon;
        var maxLon = params.maxLon;
        var forecastLevel = params.forecastLevel;
        var forecastTime = params.forecastTime;
        var initialTime = params.initialTime;
        var init;
        if (params.initialTime === '' || params.initialTime === undefined || params.initialTime === null)
            init = '';
        else
            init = '&initialTime =' + initialTime;

        var pattern = '{0}?RequestMode={1}&ModeCode={2}&ElementCode={3}&MinLat={4}&MaxLat={5}&MinLon={6}&MaxLon={7}&ForecastLevel={8}&ForecastTime={9}{10}';
        var label = pattern.format(url, requestMode, modeCode, elementCode, minLat, maxLat, minLon, maxLon, forecastLevel, forecastTime, init);
        $('#port-url').text(label);
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