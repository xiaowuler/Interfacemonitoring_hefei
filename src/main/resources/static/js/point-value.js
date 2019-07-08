var App = function () {
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
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: params,
            url: 'debug/GetPointValue',
            success: function (result) {
                console.log(result);
                this.SetReturnData(result);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        var forecastTime = $("#forecast-time").datetimebox("getValue");
        var forecastFormat = moment(forecastTime).format('YYYYMMDDHHmm');
        var initialTime = $("#initial").datetimebox("getValue");
        var initialFormat = moment(initialTime).format('YYYYMMDDHHmm') == 'Invalid date' ? '' : moment(initialTime).format('YYYYMMDDHHmm');

        return {
            URL: 'http://10.129.4.202:9535/Search/GetPointValue',
            RequestMode: $('.port-method button.active').text(),
            modeCode: $('#ModeCode').combobox('getValue'),
            elementCode: $('#element').combotree('getText'),
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
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
        $.ajax({
            type: "POST",
            dataType: 'json',
            async:false,
            url: 'debug/GetElementCodeByModeCode',
            success: function (result) {
                $('#element').combotree('loadData', this.HandlerReturnElementCode(result));
            }.bind(this),
        });

        $('#element').combotree({
            //onlyLeafCheck:true,
            panelHeight: 'auto',
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