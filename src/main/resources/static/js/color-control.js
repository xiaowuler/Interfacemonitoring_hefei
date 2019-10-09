/**
 * Created by Administrator on 2018/12/29.
 */
var ColorContorl = function () {
    this.width = '20';
    this.height = '25';
    this.unit = $('.color-unit');
    this.gradient = $('#color-gradient').find('span');
    this.value = document.getElementById('color-value');
    this.color = [['#2d9e5a','#329e2d'],
                    ['#329e2d','#c8a436'],
                    ['#c8a436','#c88f36'],
                    ['#c88f36','#f09c17'],
                    ['#f09c17','#f07317'],
                    ['#f07317','#f05417'],
                    ['#f05417','#480609']];

    this.Startup = function () {
        this.ReLayout();
        //this.SetColorValue();
        this.ColorGradient();
    };

    this.ReLayout = function () {
        var width = this.unit.width();
        this.unit.height(this.color.length * this.height);
        this.unit.css('margin-right',-(width / 2) + 20);
    };

    this.setColor = function (type,array) {
        this.color = array[0];
        var element = '';
        var list = '';

        for(var i = 0; i < this.color.length; i++) {
            var endColor = this.color[i][0].replace(/\s+/g,"");
            var beginColor = this.color[i][1].replace(/\s+/g,"");
            element += '<span style="background: linear-gradient(rgb({0}), rgb({1}))"></span>'.format(beginColor, endColor);
        }
        document.getElementById('color-gradient').innerHTML = element;

        for (var j = this.color.length; j >= 0; j--) {
            list += '<span>' + array[1][j] + '</span>';
        }

        this.value.innerHTML = list;


        if (type == 'temperatures') {
            $("#color-text").html('<p>温度(单位: °c)</p>')
        } else if (type == 'winds') {
            $("#color-text").html('<p>风速(单位: m/s)</p>')
        } else if (type == 'rainfalls') {
            $("#color-text").html('<p>降雨(单位: mm)</p>')
        } else if (type == 'humidities') {
            $("#color-text").html('<p>湿度(单位: %)</p>')
        } else if (type == 'pressures') {
            $("#color-text").html('<p>气压(单位: Pa)</p>')
        } else if (type == 'groundTemperature') {
            $("#color-text").html('<p>地温(单位: °c)</p>')
        }

        this.gradient.css({
            'width': this.width,
            'height': this.height
        })
    }

    this.SetColorValue = function (array) {
        var element = '';
        var list = '';

        for(var i = 0; i < this.color.length; i++) {
            element += '<span id="gradient{0}"></span>'.format(i);
        }
        document.getElementById('color-gradient').innerHTML = element;

        for (var j = this.color.length; j >= 0; j--) {
            list += '<span>' + j + '</span>';
        }

        this.value.innerHTML = list;

        this.gradient.css({
            'width': this.width,
            'height': this.height
        })
    };

    this.ColorGradient = function () {
        var setGradient = (function () {
            var canvas = document.createElement('canvas');
            var useCanvas = !!(typeof (canvas.getContext) == 'function');
            var ctx = useCanvas ? canvas.getContext('2d') : null;
            var isIE = false;
            if (useCanvas) {
                return function (dEl, sColor1, sColor2,bRepeatY) {
                    if (typeof (dEl) == 'string') dEl = document.getElementById(dEl);
                    if (!dEl) return false;
                    var width = dEl.offsetWidth;
                    var height = dEl.offsetHeight;
                    canvas.width = width;
                    canvas.height = height;
                    var dGradient;
                    var sRepeat;
                    if (bRepeatY) {
                        dGradient = ctx.createLinearGradient(0, 0, width, 0);
                        sRepeat = 'repeat-y';
                    } else {
                        dGradient = ctx.createLinearGradient(0, 0, 0, height);
                        sRepeat = 'repeat-x';
                    }
                    dGradient.addColorStop(0, sColor1);
                    dGradient.addColorStop(1, sColor2);
                    ctx.fillStyle = dGradient;
                    ctx.fillRect(0, 0, width, height);
                    var sDataUrl = ctx.canvas.toDataURL('image/png');
                    with (dEl.style) {
                        backgroundRepeat = sRepeat;
                        backgroundImage = 'url(' + sDataUrl + ')';
                        backgroundColor = sColor2;
                    }
                }
            } else if (isIE) {
                return function (dEl, sColor1, sColor2, bRepeatY) {
                    if (typeof (dEl) == 'string') dEl = document.getElementById(dEl);
                    if (!dEl) return false;
                    dEl.style.zoom = 1;
                    dEl.style.filter += ' ' + ['progid:DXImageTransform.Microsoft.gradient( GradientType=', +(!!bRepeatY), ',enabled=true,startColorstr=', sColor1, ', endColorstr=', sColor2, ')'].join('');
                };
            } else {
                return function (dEl, sColor1, sColor2) {
                    if (typeof (dEl) == 'string') dEl = document.getElementById(dEl);
                    if (!dEl) return false;
                    with (dEl.style) {
                        backgroundColor = sColor2;
                    }
                }
            }
        })();
        for (var i = 0; i < this.color.length; i++) {
            var node = document.getElementById('color-gradient');
            var dataId = node.getElementsByTagName('span')[i];
            setGradient(dataId, 'rgb(' + this.color[i][1] + ')', 'rgb(' + this.color[i][0] + ')');
        }
    };
};
