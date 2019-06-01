var App = function () {

    this.MapInfo = new MapInfo();

    this.Startup = function () {
        this.ReLayout();
        this.SetDate();
        this.BindInputEvent();
        $('#run').on('click', this.OnRunButtonClick.bind(this));
        $('#run').trigger("click");
        $('.port-method button').on('click', this.SelectType.bind(this));
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
        //this.BottomPanel.Startup();
        this.MapInfo.CreateEasyMap();
        window.onresize = this.ReLayout.bind(this);
        $(".return-content li").eq(0).show();

    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.return-content li, .describe').height(windowHeight - 611);
    };

    this.ReloadData = function () {
        var params = this.GetParams();
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'debug/GetRegionValues',
            success: function (result) {
                console.log(result);
                this.SetReturnData(result);
                this.MapInfo.CreateSpotLayer(result.contourResult.spotPolygons, result.contourResult.legendLevels);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var forecastTime = $("#forecast-time").datetimebox("getValue");
        var forecastFormat = moment(forecastTime).format('YYYYMMDDHHmm');
        var initialTime = $("#initial").datetimebox("getValue");
        var initialFormat = moment(initialTime).format('YYYYMMDDHHmm');

        return {
            URL: 'http://10.129.4.202:9535/Search/GetRegionValues',
            requestMode: $('.port-method button.active').text(),
            modeCode: $('#mode').val(),
            elementCode: $('#element').val(),
            minLat: $('#min-lat').val(),
            maxLat: $('#max-lat').val(),
            minLon: $('#min-lon').val(),
            maxLon: $('#max-lon').val(),
            forecastLevel: $('#forecast-level').val(),
            forecastTime: forecastFormat,
            initialTime: initialFormat
        }
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
    };

    this.SetDate = function () {
        $('#forecast-time').datetimebox({
            panelWidth: 200,
            panelHeight: 260
        });

        $('#initial').datetimebox({
            panelWidth: 200,
            panelHeight: 260
        });
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});