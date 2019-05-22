String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined'
            ? args[number]
            : match
            ;
    });
};

String.prototype.rtrim = function (s) {
    if (s === undefined)
        s = '\\s';
    return this.replace(new RegExp("[" + s + "]*$"), '');
};

String.prototype.ltrim = function (s) {
    if (s === undefined)
        s = '\\s';
    return this.replace(new RegExp("^[" + s + "]*"), '');
};

Number.prototype.padLeft = function (size) {
    return ("000000" + this).slice(-size);
};

function padLeft(number, size) {
    return ("000000" + number).slice(-size);
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}


function InitDateTimeBox(id) {
    $(id).datetimebox({
        showSeconds: false,

        formatter: function (date) {
            var s1 = [date.getFullYear(), padLeft(date.getMonth() + 1, 2), padLeft(date.getDate(), 2)].join('/');
            var s2 = [padLeft(date.getHours(), 2), padLeft(date.getMinutes(), 2), '00'].join(':');
            return s1 + ' ' + s2;
        },

        parser: function (s) {
            if (typeof s === 'object')
                return s;

            if (typeof s === 'string') {
                var dt = s.split(' ');
                var dateFormat = dt[0].split('/');
                var timeFormat = dt[1].split(':');
                var date = new Date(dateFormat[0], parseInt(dateFormat[1]) - 1, dateFormat[2]);
                if (dt.length > 1) {
                    date.setHours(timeFormat[0]);
                    date.setMinutes(timeFormat[1]);
                    date.setSeconds(0);
                }
                return date;
            }

            return new Date();
        }
    });
}