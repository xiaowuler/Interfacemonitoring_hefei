var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.ReloadPortTable();
        this.CalendarControl();
        this.SetSelectPanel();
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var height = $('.content').height();
        $('.aside').height(height);

        $('.port-table, .datagrid').width($('.content').width() - 10);
    };

    this.ReloadPortTable = function () {
        $('#log-table').datagrid({
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

    this.CalendarControl = function () {
        $('#start-date').datetimebox({
            panelWidth: 203,
            panelHeight: 260
        });

        $('#end-date').datetimebox({
            panelWidth: 203,
            panelHeight: 260,
            showSeconds: true
        });

        var endDate = moment().add(6, 'days').format('YYYY/MM/DD HH:mm:ss');
        $("#end-date").datebox("setValue", endDate);
    };

    this.SetSelectPanel = function () {
        $('#name').combobox({
            panelHeight: 350
        });
        $('#caller').combobox({
            panelHeight: 109
        });
        $('#state').combobox({
            panelHeight: 109
        });
    }

};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});