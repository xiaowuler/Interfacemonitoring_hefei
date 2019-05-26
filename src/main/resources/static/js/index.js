var App = function () {

    this.Startup = function () {
        this.ReLayout()
        this.ReloadPortTable();
        this.ReloadPortChart();
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var height = $('.content').height();
        $('.aside').height(height);
        $('.port-table, .datagrid').width($('.content').width() - 10);
    };

    this.ReloadPortTable = function () {
        $('#port-table').datagrid({
            striped: true,
            singleSelect: true,
            fitColumns: true,
            fit: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [5, 10, 15]
        });
    };

    this.ReloadPortChart = function () {
        //Highcharts.chart('port-chart', {
        //    chart: {
        //        type: 'column',
        //        backgroundColor: '#27293d'
        //    },
        //    title: {
        //        text: '接口基础信息',
        //        style:{
        //            color: '#dbdbdb',
        //            fontSize: '20px'
        //        }
        //    },
        //    credits: {
        //        enabled: false
        //    },
        //    xAxis: {
        //        categories: ['接口A', '接口B', '接口C', '接口D', '接口E', '接口F', '接口G', '接口H', '接口I', '接口J', '接口K', '接口L', '接口M', '接口N']
        //    },
        //    yAxis: [{
        //        title: {
        //            text: '正确率'
        //        }
        //    }, {
        //        title: {
        //            text: '调用次数'
        //        },
        //        minPadding: 0,
        //        maxPadding: 0,
        //        max: 100,
        //        min: 0,
        //        opposite: true,
        //        labels: {
        //            format: "{value}",
        //            style: {
        //                color: '#9a9a9a',
        //                fontSize: '14px'
        //            }
        //        }
        //    }, {
        //        title: {
        //            text: '失败率'
        //        },
        //        minPadding: 0,
        //        maxPadding: 0,
        //        max: 100,
        //        min: 0,
        //        opposite: true,
        //        labels: {
        //            format: "{value}",
        //            style: {
        //                color: '#9a9a9a',
        //                fontSize: '14px'
        //            }
        //        }
        //    }, {
        //        title: {
        //            text: '平均耗时'
        //        },
        //        minPadding: 0,
        //        maxPadding: 0,
        //        max: 100,
        //        min: 0,
        //        opposite: true,
        //        labels: {
        //            format: "{value}",
        //            style: {
        //                color: '#9a9a9a',
        //                fontSize: '14px'
        //            }
        //        }
        //    }  , {
        //            title: {
        //                text: '健康状态'
        //            },
        //            minPadding: 0,
        //            maxPadding: 0,
        //            max: 100,
        //            min: 0,
        //            opposite: true,
        //            labels: {
        //                format: "{value}",
        //                style: {
        //                    color: '#9a9a9a',
        //                    fontSize: '14px'
        //                }
        //            }
        //    }],
        //    legend: {
        //        layout: 'horizontal',
        //        align: 'center',
        //        verticalAlign: 'top',
        //        x: -20,
        //        y: -20,
        //        itemStyle: {
        //            color: '#9a9a9a',
        //            fontSize: '14px'
        //        }
        //    },
        //    series: [{
        //        type: 'pareto',
        //        name: '调用次数',
        //        yAxis: 1,
        //        zIndex: 10,
        //        pointWidth: 30,
        //        baseSeries: 1,
        //        data: [12, 5, 15, 26, 12, 31, 36, 10, 21, 36, 22, 31, 36, 11],
        //        tooltip: {
        //            pointFormat: '{series.name} {point.y:2f} '
        //        }
        //    }, {
        //        name: '正确率',
        //        type: 'column',
        //        zIndex: 2,
        //        pointWidth: 30,
        //        data: [12, 5, 15, 26, 12, 31, 36, 10, 21, 36, 22, 31, 36, 11],
        //        tooltip: {
        //            pointFormat: '{series.name} {point.y} %'
        //        }
        //    }, {
        //        name: '失败率',
        //        type: 'pareto',
        //        zIndex: 2,
        //        pointWidth: 30,
        //        data: [12, 5, 15, 26, 12, 21, 36, 10, 21, 36, 32, 31, 36, 11],
        //        tooltip: {
        //            pointFormat: '{series.name} {point.y} %'
        //        }
        //    }, {
        //        name: '平均耗时',
        //        type: 'pareto',
        //        zIndex: 2,
        //        pointWidth: 30,
        //        data: [1, 0.5, 1.5, 2, 2, 1, 0.5, 0.5, 2, 2, 1.5, 0.5, 0.5, 1],
        //        tooltip: {
        //            pointFormat: '{series.name} {point.y} %'
        //        }
        //    }, {
        //        name: '健康状态',
        //        type: 'pareto',
        //        zIndex: 2,
        //        pointWidth: 30,
        //        data: [12, 5, 15, 16, 22, 11, 26, 30, 11, 26, 12, 11, 26, 11],
        //        tooltip: {
        //            pointFormat: '{series.name} {point.y} %'
        //        }
        //    }]
        //});
        Highcharts.chart('port-chart', {
            chart: {
                type: 'column',
                backgroundColor: '#27293d'
            },
            title: {
                text: '接口基础信息',
                style:{
                    color: '#dbdbdb',
                    fontSize: '20px'
                }
            },
            subtitle: {
                text: null
            },
            credits: {
                enabled: false
            },
            colors: ['#1c96d5', '#ff5ee0', '#f7a45c', '#00ffff', '#1c96d5'],
            xAxis: {
                categories: ['接口A', '接口B', '接口C', '接口D', '接口E', '接口F', '接口G', '接口H', '接口I', '接口J', '接口K', '接口L', '接口M', '接口N'],
                lineColor: '#999999'
            },
            yAxis: {
                title: {
                    text: '正确率（%）'
                },
                labels: {
                    format: "{value}",
                    style: {
                        color: '#9a9a9a',
                        fontSize: '14px'
                    }
                },
                gridLineDashStyle: 'ShortDot',
                lineColor: '#999999',
                lineWidth: 1
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
                x: -20,
                y: -20,
                itemStyle: {
                    color: '#9a9a9a',
                    fontSize: '14px'
                }
            },
            //tooltip: {
            //    crosshairs: true,
            //    shared: true
            //},
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#44474b',
                        lineWidth: 1
                    }
                },
                column: {
                    borderWidth: 0
                }
            },
            series: [{
                name: '调用次数',
                pointWidth: 30,
                data: [12, 5, 15, 26, 12, 31, 36, 10, 21, 36, 22, 31, 36, 11]
            }, {
                name: '失败率',
                type: 'pareto',
                data: [12, 5, 15, 26, 12, 21, 36, 10, 21, 36, 32, 31, 36, 11]
            }, {
                name: '平均耗时',
                type: 'pareto',
                data: [1, 0.5, 1.5, 2, 2, 1, 0.5, 0.5, 2, 2, 1.5, 0.5, 0.5, 1]
            }, {
                name: '健康状态',
                type: 'pareto',
                data: [12, 5, 15, 16, 22, 11, 26, 30, 11, 26, 12, 11, 26, 11]
            }]
        });
    };

};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});