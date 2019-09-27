var App = function () {

    this.Startup = function () {
        this.SetModeCode();
        this.ReLayout();
        this.InitComboBox('#orgCode');
        this.InitComboBox('#element');
        this.InitComboBox('#initial-time');

        this.GettingValuesThroughModecode();
        this.ReloadData();
        this.SetDate();
        this.BindInputEvent();


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
        var initialTime =  $("#initial-time").combobox("getText");
     //   var initialFormat = moment(initialTime).format('YYYY');

        // initialTime = moment(initialTime).format('YYYYMMDDHHmm')
        return {
            URL: 'http://10.129.4.202:9535/weather/GetPointValue',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combobox('getText'),
            lat: $('#latitude').val(),
            lon: $('#longitude').val(),
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
            panelHeight: 'auto',
            onSelect: function (result) {
                this.GettingValuesThroughModecode(result.value);
            }.bind(this)
        });
    };

    this.InitComboBox = function (id) {
        $(id).combobox({
            valueField:'id',
            textField:'text',
            editable:false,
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
            modeCode:modeCode
        }
    };

    this.GettingValuesThroughModecode = function(result){
        var params = this.GetModecode(result);
        $.ajax({
            type:"POST",
            dateType:"json",
            data: params,
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
                    //item = moment(item).format('YYYY/MM/DD HH:mm');
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
                    panelHeight: height = initialList.length > 6 ? 300 : "auto"
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