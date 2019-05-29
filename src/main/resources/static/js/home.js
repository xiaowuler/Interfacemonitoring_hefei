var App = function () {
    this.Startup = function () {
        this.SetTreeData();
    };

    this.SetTreeData = function () {
        var treeData = [{
            text : "菜单",
            children : [{
                text : "接口管理",
                state : "",
                attributes : {
                    url : "http://www.baidu.com"
                }
            }, {
                text : "一级菜单2",
                attributes : {
                    url : "http://www.baidu.com"
                }
            }, {
                text : "一级菜单3",
                state : "closed",
                children : [{
                    text : "二级菜单1",
                    attributes : {
                        url : ""
                    }
                }, {
                    text : "二级菜单2",
                    attributes : {
                        url : ""
                    }
                }, {
                    text : "一级菜单3",
                    state : "closed",
                    children : [{
                        text : "二级菜单1",
                        attributes : {
                            url : ""
                        }
                    }, {
                        text : "二级菜单2",
                        attributes : {
                            url : ""
                        }
                    }, {
                        text : "三级菜单3",
                        attributes : {
                            url : ""
                        }
                    }
                    ]
                }]
            }]
        }];
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});