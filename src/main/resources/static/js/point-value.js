var App = function () {
    this.Startup = function () {


        this.SetModeCode();
        this.ReLayout();
        this.GettingValuesThroughModecode();
        this.ReloadData();
        this.SetDate();
        this.BindInputEvent();
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
        if (params.requestMode === 'GET'){
            this.ShowDetailUrl();
            $('.port-text').show();
        } else
            $('.port-text').hide();

        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'debug/GetPointValue',
            success: function (result) {
                this.SetReturnData(result.searchResultInfos);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var forecastTime = $("#forecast-time").datetimebox("getValue");
        var initialTime = $("#initial").datetimebox("getValue");

        return {
            URL: 'http://10.129.4.202:9535/weather/GetPointValue',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combotree('getText'),
            lat: $('#latitude').val(),
            lon: $('#longitude').val(),
            orgCode: $('#orgCode').val(),
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
        var lat = params.lat;
        var lon = params.lon;
        var forecastLevel = params.forecastLevel;
        var forecastTime = params.forecastTime;
        var initialTime = params.initialTime;
        var init;
        if (params.initialTime === '' || params.initialTime === undefined || params.initialTime === null)
            init = '';
        else
            init = '&InitialTime =' + initialTime;

        var pattern = '{0}?requestMode={1}&ModeCode={2}&ElementCode={3}&Latitude={4}&Longitude={5}&ForecastLevel={6}&ForecastTime={7}{8}';
        var label = pattern.format(url, requestMode, modeCode, elementCode, lat, lon, forecastLevel, forecastTime, init);
        $('#port-url').text(label);
    };

    this.OnRunButtonClick = function () {
        this.ReloadData();
    };

    this.SetReturnData = function (result) {
        $('#data').text(JSON.stringify(result, null, 4));
        //$('#data').text(result.result);
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

    this.SetDate = function () {
        $('#forecast-time').datetimebox({
            panelWidth: 170,
            panelHeight: 260,
            showSeconds: false
        });

        $('#initial').datetimebox({
            panelWidth: 170,
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
        // $.ajax({
        //     type: "POST",
        //     dataType: 'json',
        //     async:false,
        //     url: 'debug/GetElementCodesByModeCode',
        //     success: function (result) {
        //         $('#element').combotree('loadData', this.HandlerReturnElementCode(result));
        //     }.bind(this),
        // });

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

        $('#element').combotree('setValue', 'WP3');

    };

    this.HandlerReturnElementCode = function (results) {
        var Array = [];
        var combotreeData = new CombotreeData(0, 'WP3');
        combotreeData.initData(results['WP3']);
        Array.push(combotreeData);

        // var combotreeDatas = new CombotreeData(5, 'SCMOC');
        // combotreeDatas.initData(results['SCMOC']);
        // Array.push(combotreeDatas);
        return Array;
    };

    this.GetModecode = function () {
        return {
            URL: 'http://10.129.4.202:9535/weather/GetElementInfosByModeCode',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
        }
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
                console.log(result);
                $('#element').combotree('loadData', this.HandlerReturnElementCode(result.elementCode));
            }
        })
    }
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});