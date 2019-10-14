var App = function () {

    this.elementCodeInfo;

    this.Startup = function () {
        this.ReLayout();
        this.GettingValuesThroughModecode();
        this.ReloadData();
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
            url: 'debug/GetWeatherPhenomenon',
            success: function (result) {
                this.SetReturnData(result.weatherPhenomenonResultInfo);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var initialTime =  $("#initial-time").combobox("getText");
        return {
            URL: 'http://10.129.4.202:9535/weather/GetWeatherPhenomenon',
            requestMode: $('.port-method button.active').attr('value'),
            lat: $('#latitude').val(),
            lon: $('#longitude').val(),
            initialTime: initialTime
        }
    };

    this.ShowDetailUrl = function () {
        var params = this.GetParams();
        var url = params.URL;
        var requestMode = params.requestMode;
        var lat = params.lat;
        var lon = params.lon;
        var initialTime = params.initialTime;

        var pattern = '{0}?requestMode={1}&Latitude={2}&Longitude={3}&InitialTime={4}';
        var label = pattern.format(url, requestMode, lat, lon, initialTime);
        $('#port-url').text(label);
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

    this.GetModecode=function () {
        return{
            URL: 'http://10.129.4.202:9535/weather/GetElementInfosByModeCode',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: 'spcc'
        }
    }

    this.GettingValuesThroughModecode=function(){
        var params=this.GetModecode();
        $.ajax({
            type:"POST",
            dateType:"json",
            data:params,
            async: false,
            url: 'debug/GetModeCodeValues',
            success:function (result) {
                this.elementCodeInfo = result;
                var elementCode = 'ER03';
                this.SetInitialTimesAndOrgCodesByElementCodeChange(elementCode);
            }.bind(this)
        })
    }

    this.SetInitialTimesAndOrgCodesByElementCodeChange=function (elementCode) {
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
            onLoadSuccess: function () {
                $('#initial-time').combobox('select', initialTimeInfos.length - 1)
            },
            panelHeight: "auto"
        })
    }

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