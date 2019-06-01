var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.ReloadData();
        this.BindInputEvent();
        this.ReloadChart();
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
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
            url: 'debug/GetLineValues',
            success: function (result) {
                console.log(result)
                //this.SetReturnData(result);
            }.bind(this)
        });
    };

    this.GetParams = function () {
        return {
            URL: 'http://10.129.4.202:9535/Search/GetLineValues',
            requestMode: $('.port-method button.active').text(),
            modeCode: $('#mode').val(),
            elementCode: $('#element').val(),
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
            forecastLevel: $('#forecast').val(),
            startTime: $('#start-time').val(),
            endTime: $('#end-time').val(),
            initialTime: $('#initial').val()
        }
    };

    this.BindInputEvent = function () {
        $('.port-detail').find('.port-des').each(function () {
            $(this).find('span').children('input').hover(function () {
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

    this.ReloadChart = function () {
        Highcharts.chart('chart', {
            chart: {
                backgroundColor: '#27293d'
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            credits: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: '就业人数'
                }
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            },
            series: [{
                name: '安装，实施人员',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});