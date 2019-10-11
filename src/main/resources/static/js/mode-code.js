var App = function () {
    this.Startup = function () {
        this.ReLayout();
        this.SetModeCode();

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
            url: 'debug/GetModeCodeValues',
            success: function (result) {
               // console.log(result);
                this.SetReturnData(result.searchResultInfo);
                //this.GetAllData(result.searchResultInfo.data);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        return {
            URL: 'http://10.129.4.202:9535/weather/GetElementInfosByModeCode',
            requestMode: $('.port-method button.active').attr('value'),
            modeCode: $('#ModeCode').combobox('getValue')
        }
    };

    this.ShowDetailUrl = function () {
        var params = this.GetParams();
        var modeCode = params.modeCode;

        var pattern = 'ModeCode={0}';
        var label = pattern.format(modeCode);
        $('#port-url').text(label);
    };

    this.OnRunButtonClick = function () {
        this.ReloadData();
    };

    this.SetReturnData = function (result) {
        //var str = JSON.stringify(data);
        $('#data').text(JSON.stringify(result, null, 4));
    };

    this.SelectType = function (event) {
        $('.port-method button').removeClass("active");
        $(event.target).addClass("active");
    };

    this.PortCallTab = function (event) {
        $('.return-title ul li').removeClass("active");
        $(event.target).addClass("active");

        var index = $(event.target).index();
        $(".return-content li").eq(index).css("display","block").siblings().css("display","none");
    };

    this.SetModeCode = function () {
        $('#ModeCode').combobox({
            panelHeight: 'auto'
        });
    };
   /* this.GetAllData=function(result){
        var initialTime = []
        var elementCode = []
        for(var i = 0; i < result.length; i++) {
            if( !initialTime.includes( result[i].initialTime) ) //includes 检测数组是否有某个值
                initialTime.push(result[i].initialTime);
        }
        console.log(initialTime);
    }*/
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});