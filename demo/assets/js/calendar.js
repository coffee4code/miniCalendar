;(function($,window,undefined){

    var lang = 'zh',
        btnTodayText = [],
        DayText = [],
        MonthText = [],
        today = new Date(),
        dateNumberInit = today.getDate(),
        yearNumberInit = today.getFullYear(),
        monthNumberInit = today.getMonth() + 1;

    btnTodayText['zh'] = '今天';
    btnTodayText['en'] = 'Today';
    DayText['zh'] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    DayText['en'] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    MonthText['zh'] = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];
    MonthText['en'] = ['        January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    $.MiniCalenddar = function(options,element){
        this.$el = $(element);//this.$el即表示该$对象
        this._init(options);
    };

    $.MiniCalenddar.defaults = {
        onInit:function(){},
        onClick:function(year,month,day){

        }
    };

    $.MiniCalenddar.prototype = {
        _ready:function(){
            this.$el.append('<div class="calendar">'
                                +'<header>'
                                    +'<div>'
                                        +'<h2 class="year"></h2>'
                                        +'<h2 class="month"></h2>'
                                        +'<button class="btn-today"></button>'
                                    +'</div>'
                                    +'<a class="btn-prev fontawesome-angle-left" href="#"></a>'
                                    +'<a class="btn-next fontawesome-angle-right" href="#"></a>'
                                +'</header>'
                                +'<table>'
                                    +'<thead class="event-days">'
                                        +'<tr></tr>'
                                    +'</thead>'
                                    +'<tbody class="event-calendar">'
                                        +'<tr class="r1"></tr>'
                                        +'<tr class="r2"></tr>'
                                        +'<tr class="r3"></tr>'
                                        +'<tr class="r4"></tr>'
                                        +'<tr class="r5"></tr>'
                                        +'<tr class="r6"></tr>'
                                    +'</tbody>'
                                +'</table>'
                            +'</div>'
            );
        },
        _init:function(options){
            //初始化参数设定
            this._ready();
            this.options = $.extend( true, {}, $.MiniCalenddar.defaults, options );

            this.btnToday = $('.btn-today');
            this.month = $('.month');
            this.year = $('.year');
            this._actions();

        },
        _actions:function(){
            this.bindBtns();
            this.setDaysInOrder();
            this.setMonth(monthNumberInit, yearNumberInit);
        },
        bindBtns:function(){
            var miniCal = this;
            $('.btn-next').on('click', function (e) {
                var monthNumber = miniCal.month.attr('date-month'),
                    yearNumber = miniCal.year.attr('date-year');
                if (monthNumber > 11) {
                    miniCal.month.attr('date-month', '0');
                    miniCal.year.attr('date-year', Number(yearNumber) + 1).text(Number(yearNumber) + 1);
                    monthNumber = miniCal.month.attr('date-month');
                    yearNumber = miniCal.year.attr('date-year');
                    miniCal.setMonth(parseInt(monthNumber) + 1, yearNumber);
                } else {
                    miniCal.setMonth(parseInt(monthNumber) + 1, yearNumber);
                }
            });

            $('.btn-prev').on('click', function (e) {
                var monthNumber = miniCal.month.attr('date-month'),
                    yearNumber = miniCal.year.attr('date-year');
                if (monthNumber < 2) {
                    miniCal.month.attr('date-month', '13');
                    miniCal.year.attr('date-year', Number(yearNumber) - 1).text(Number(yearNumber) - 1);
                    monthNumber = miniCal.month.attr('date-month');
                    yearNumber = miniCal.year.attr('date-year');
                    miniCal.setMonth(parseInt(monthNumber) - 1, yearNumber);
                } else {
                    miniCal.setMonth(parseInt(monthNumber) - 1, yearNumber);
                }
            });

            var miniCal = this;
            this.btnToday.click(function(){
                miniCal.destory();
                miniCal._init(miniCal.options);
                $('tbody.event-calendar td[date-year="' + yearNumberInit + '"][date-month="' + monthNumberInit + '"][date-day="' + dateNumberInit + '"]').click();
            });
        },
        setDaysInOrder:function() {
            var tHead = $('thead.event-days'),
                tHeadTr = tHead.find('tr');

            if( !(tHead.find('td').length) ){
                $(DayText[lang]).each(function(index){
                    tHeadTr.append('<td>'+DayText[lang][index]+'</td>')
                });
            }

            this.btnToday.text(btnTodayText[lang]);
        },
        setMonth:function(monthNumber, yearNumber) {
            this.month.text(MonthText[lang][monthNumber - 1]).attr('date-month', monthNumber);
            this.year.text(yearNumber).attr('date-year', yearNumber);

            this.setDaysInMonth(monthNumber, yearNumber);
            this.setDayOfCurrent();
        },
        setDaysInMonth:function (monthNumber, yearNumber){
            var firstDay = 6,
                daysInMonth = getDaysInMonth(monthNumber - 1, yearNumber),
                tBodyTr = $('tbody.event-calendar tr');

            tBodyTr.each(function () {
                $(this).empty();
                var len = 7,i=1;
                while(i<len+1){
                    $(this).append($('<td>',{'class':'d'+i}));
                    i++
                }
            });
            $(daysInMonth).each(function (index) {
                var index = index + 1;
                if(index === 1){
                    firstDay = this.getDay();
                }
                var addr = getDayAddr(index,this,firstDay);
                $('tbody.event-calendar tr.r'+addr[0]+' td.d'+addr[1])
                    .addClass('fill')
                    .attr('date-year',yearNumber)
                    .attr('date-month',monthNumber)
                    .attr('date-day',this.getDate())
                    .text(this.getDate());
            });
            this.fix();
        },
        setDayOfCurrent:function () {
            $('tbody.event-calendar td[date-year="' + yearNumberInit + '"][date-month="' + monthNumberInit + '"][date-day="' + dateNumberInit + '"]').addClass('current-day active');
        },
        fix:function(){
            var miniCal = this;
            $('tbody td').on('click', function (e) {
                var $this = $(this);
                $('tbody.event-calendar td').removeClass('active');
                if ( !($this.hasClass('event')) ) {
                    $this.addClass('active');
                }
                miniCal.options.onClick($this.attr('date-year'),$this.attr('date-month'),$this.attr('date-day'));
            });
            var lastTr = $('tbody tr.r6').show();
            if( !(lastTr.find('.fill').length) ){
                lastTr.hide();
            }
            this.options.onInit();
        },
        destory:function(){
            this.$el.empty();
        }
    };

    function getDaysInMonth(month, year) {
        var date = new Date(year, month, 1),
            result = [];
        while (date.getMonth() === month) {
            result.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return result;
    }

    function getDayAddr(dateIndex,dateValue,firstDay){
        var td = dateValue.getDay();
        var tr = parseInt((dateIndex+firstDay-1) / 7);
        return [tr+1,td+1]
    }

    $.fn.minicalendar = function(options){
        var instance = $.data( this, 'minicalendar' );
        if ( typeof options === 'string' ) {
            var args = Array.prototype.slice.call( arguments, 1 );
            this.each(function() {
                instance[ options ].apply( instance, args );
            });
        }else {
            this.each(function() {
                instance ? instance._init() : instance = $.data( this, 'minicalendar', new $.MiniCalenddar( options, this ) );
            });
        }
        return instance;
    };

})(jQuery,window);

$('.calendar-container').minicalendar({
    onClick:function(year,month,date){
        console.info([year,month,date].join('-'));
    }
});