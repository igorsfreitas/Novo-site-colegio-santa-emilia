(function ($) {

    var eCalendar = function (options, object) {
        // Initializing global variables
        var adDay = new Date().getDate();
        var adMonth = new Date().getMonth();
        var adYear = new Date().getFullYear();
        var dDay = adDay;
        var dMonth = adMonth;
        var dYear = adYear;
        var instance = object;

        var settings = $.extend({}, $.fn.eCalendar.defaults, options);

        function lpad(value, length, pad) {
            if (typeof pad == 'undefined') {
                pad = '0';
            }
            var p;
            for (var i = 0; i < length; i++) {
                p += pad;
            }
            return (p + value).slice(-length);
        }

        var mouseOver = function () {
            $(this).addClass('c-nav-btn-over');
        };
        var mouseLeave = function () {
            $(this).removeClass('c-nav-btn-over');
        };
        var mouseOverEvent = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveEvent = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var mouseOverItem = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveItem = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var nextMonth = function () {
            if (dMonth < 11) {
                dMonth++;
            } else {
                dMonth = 0;
                dYear++;
            }
            print();
        };
        var previousMonth = function () {
            if (dMonth > 0) {
                dMonth--;
            } else {
                dMonth = 11;
                dYear--;
            }
            print();
        };

        function loadEvents() {
            if (typeof settings.url != 'undefined' && settings.url != '') {
                $.ajax({url: settings.url,
                    async: false,
                    success: function (result) {
                        settings.events = result;
                    }
                });
            }
        }

        function print() {
            loadEvents();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('c-grid');
            var cEvents = $('<div/>').addClass('c-event-grid');
            var cEventsBody = $('<div/>').addClass('c-event-body');
            cEvents.append($('<div/>').addClass('c-event-title c-pad-top').html(settings.eventTitle));
            cEvents.append(cEventsBody);
            var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
            var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
            var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
            cPrevious.html(settings.textArrows.previous);
            cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cNext.html(settings.textArrows.next);

            cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
            cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

            cBody.append(cPrevious);
            cBody.append(cMonth);
            cBody.append(cNext);
            for (var i = 0; i < settings.weekDays.length; i++) {
                var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
                cWeekDay.html(settings.weekDays[i]);
                cBody.append(cWeekDay);
            }
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<div/>');
                if (i < dWeekDayOfMonthStart) {
                    cDay.addClass('c-day-previous-month c-pad-top');
                    cDay.html(dLastDayOfPreviousMonth++);
                } else if (day <= dLastDayOfMonth) {
                    cDay.addClass('c-day c-pad-top');
                    if (day == dDay && adMonth == dMonth && adYear == dYear) {
                        cDay.addClass('c-today');
                    }
                    for (var j = 0; j < settings.events.length; j++) {
                        var d = settings.events[j].datetime;
                        if (d.getDate() == day && (d.getMonth() - 1) == dMonth && d.getFullYear() == dYear) {
                            cDay.addClass('c-event').attr('data-event-day', d.getDate());
                            cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('c-day-next-month c-pad-top');
                    cDay.html(dayOfNextMonth++);
                }
                cBody.append(cDay);
            }
            var eventList = $('<div/>').addClass('c-event-list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if ((d.getMonth() - 1) == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + lpad(d.getMonth(), 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
                    var item = $('<div/>').addClass('c-event-item');
                    var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title + '<br/>');
                    var description = $('<div/>').addClass('description').html(settings.events[i].description + '<br/>');
                    item.attr('data-event-day', d.getDate());
                    item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    item.append(title).append(description);
                    eventList.append(item);
                }
            }
            $(instance).addClass('calendar');
            cEventsBody.append(eventList);
            $(instance).html(cBody).append(cEvents);
        }

        return print();
    }

    $.fn.eCalendar = function (oInit) {
        return this.each(function () {
            return eCalendar(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.eCalendar.defaults = {
        weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        textArrows: {previous: '<', next: '>'},
        eventTitle: 'Eventos',
        url: '',
        events: [

            // {title: 'Brasil x México', description: 'Segundo jogo da seleção brasile', datetime: new Date(2014, 2, 17, 16)},

            // fevereiro
            {title: 'Início do semestre', description: 'Volta as aulas', datetime: new Date(2014, 2, 3, '')},

            // março
            {title: 'Feriado', description: 'Carnaval', datetime: new Date(2014, 3, 3, '')},
            {title: 'Feriado', description: 'Carnaval', datetime: new Date(2014, 3, 4, '')},
            {title: 'Feriado', description: 'Cinzas', datetime: new Date(2014, 3, 5, '')},
            {title: 'Dia da mulher', description: '', datetime: new Date(2014, 3, 8, '')},
            {title: 'TESTÃO', description: '1º Bimestre', datetime: new Date(2014, 3, 20, '')},
            {title: 'Início das avaliações', description: '1º Bimestre', datetime: new Date(2014, 3, 21, '')},
            {title: 'Dia Mundial da água', description: '', datetime: new Date(2014, 3, 22, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 3, 24, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 3, 25, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 3, 26, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 3, 27, '')},
            {title: 'Fim das avaliações', description: '', datetime: new Date(2014, 3, 28, '')},
            {title: 'Simulado', description: '1º Bimestre', datetime: new Date(2014, 3, 29, '')},

            // abril
            {title: 'Inícios das recuperações', description: '1º Bimestre', datetime: new Date(2014, 4,3, '')},
            {title: 'Recuperação', description: '', datetime: new Date(2014, 4,4, '')},
            {title: 'Recuperação', description: '', datetime: new Date(2014, 4,7, '')},
            {title: 'Recuperação', description: '', datetime: new Date(2014, 4,8, '')},
            {title: 'Recuperação', description: '', datetime: new Date(2014, 4,9, '')},
            {title: 'Fim das recuperações', description: '', datetime: new Date(2014, 4,10, '')},
            {title: 'Feriado', description: 'Paixão de Cristo', datetime: new Date(2014, 4,17, '')},
            {title: 'Feriado', description: 'Paixão de Cristo', datetime: new Date(2014, 4,18, '')},
            {title: 'Páscoa', description: '', datetime: new Date(2014, 4,20, '')},
            {title: 'Feriado', description: 'Tiradentes', datetime: new Date(2014, 4,21, '')},
            {title: 'Dia do planeta terra', description: '', datetime: new Date(2014, 4,22, '')},
            {title: 'Descobrimento do Brasil', description: '', datetime: new Date(2014, 4,22, '')},
            {title: 'Plantão pedagógico', description: '', datetime: new Date(2014, 4,26, '')},
            {title: 'Dia internacional da Educação', description: '', datetime: new Date(2014, 4,28, '')},

            // maio
            {title: 'Feriado', description: 'Dia do trabalho', datetime: new Date(2014, 5,1, '')},
            {title: 'Dia da família', description: '', datetime: new Date(2014, 5,10, '')},
            {title: 'Dia das mães', description: '', datetime: new Date(2014, 5,11, '')},
            {title: 'Abolição da escravatura', description: '', datetime: new Date(2014, 5,13, '')},
            {title: 'Abertura dos jogos internos', description: '', datetime: new Date(2014, 5,23, '')},
            {title: 'jogos internos', description: '', datetime: new Date(2014, 5,26, '')},
            {title: 'jogos internos', description: '', datetime: new Date(2014, 5,27, '')},
            {title: 'jogos internos', description: '', datetime: new Date(2014, 5,28, '')},
            {title: 'Final dos jogos internos', description: '', datetime: new Date(2014, 5,31, '')},

            // junho
            {title: 'Início das avaliações', description: '2º Bimestre', datetime: new Date(2014, 6,4, '')},
            {title: 'Avaliação testão', description: '', datetime: new Date(2014, 6,5, '')},
            {title: 'Dia mundial do meio ambiente', description: '', datetime: new Date(2014, 6,5, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 6,6, '')},
            {title: 'TESTEVEST', description: '1º semestre', datetime: new Date(2014, 6,7, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 6,9, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 6,10, '')},
            {title: 'Fim das avaliações', description: '', datetime: new Date(2014, 6,11, '')},
            {title: 'Dia dos namorados', description: '', datetime: new Date(2014, 6,12, '')},
            {title: 'Jogo do Brasil', description: '', datetime: new Date(2014, 6,12, '')},
            {title: 'São João no colégio', description: '', datetime: new Date(2014, 6,13, '')},
            {title: 'Simulado', description: '2º Bimestre', datetime: new Date(2014, 6,14, '')},
            {title: 'Jogo do Brasil', description: '', datetime: new Date(2014, 6,17, '')},
            {title: 'Início das recuperações', description: '2º Bimestre', datetime: new Date(2014, 6,18, '')},
            {title: 'Feriado', description: 'Corpus cristi', datetime: new Date(2014, 6,19, '')},
            {title: 'Jogo do Brasil', description: '', datetime: new Date(2014, 6,23, '')},
            {title: 'Feriado', description: 'São João', datetime: new Date(2014, 6,24, '')},
            {title: 'Fim das recuperações', description: '', datetime: new Date(2014, 6,30, '')},
            {title: 'Encerramento do 1º semestre', description: '', datetime: new Date(2014, 6,30, '')},

            // julho
            {title: 'Dia da cidadania', description: '', datetime: new Date(2014, 7,1, '')},
            {title: 'Entregas dos boletins do 2º Bimestre', description: '', datetime: new Date(2014, 7,15, '')},
            {title: 'Dia do amigo', description: '', datetime: new Date(2014, 7,20, '')},
            {title: 'Dia da avó', description: '', datetime: new Date(2015, 7,25, '')},

            // Agosto
            {title: 'Início do 2º semestre', description: '', datetime: new Date(2014, 8,1, '')},
            {title: 'Dia dos pais', description: '', datetime: new Date(2014, 8,10, '')},
            {title: 'Dia do estudante', description: '', datetime: new Date(2014, 8,11, '')},
            {title: 'Dia do folclore', description: '', datetime: new Date(2014, 8,22, '')},
            {title: 'Dia do soldado', description: '', datetime: new Date(2014, 8,25, '')},


            // Setembro
            {title: 'Feriado', description: 'Independência do Brasil', datetime: new Date(2014, 9,7, '')},
            {title: 'TESTÃO', description: '3º Bimestre', datetime: new Date(2014, 10,2, '')},
            {title: 'Dia da árvore', description: '', datetime: new Date(2014, 9,21, '')},
            {title: 'Dia internacional da paz', description: '', datetime: new Date(2014, 9,21, '')},
            {title: 'Dia das avaliações', description: '3º Bimestre', datetime: new Date(2014, 9,23, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 9,24, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 9,25, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 9,26, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 9,29, '')},
            {title: 'Fim das avaliações', description: '', datetime: new Date(2014, 9,30, '')},

            // Outubro
            {title: 'Simulado', description: '3º Bimestre', datetime: new Date(2014, 10,4, '')},
            {title: 'Dia da Natureza', description: '', datetime: new Date(2014, 10,4, '')},
            {title: 'Início das recuperações', description: 'III Bimestre', datetime: new Date(2014, 10,6, '')},
            {title: 'recuperação', description: '', datetime: new Date(2014, 10,7, '')},
            {title: 'recuperação', description: '', datetime: new Date(2014, 10,8, '')},
            {title: 'recuperação', description: '', datetime: new Date(2014, 10,9, '')},
            {title: 'Dia das crianças no colégio', description: '', datetime: new Date(2014, 10,10, '')},
            {title: 'Dia das crianças', description: '', datetime: new Date(2014, 10,12, '')},
            {title: 'Dia de N. srª Aparecida', description: '', datetime: new Date(2014, 10,12, '')},
            {title: 'Fim das recuperações', description: '', datetime: new Date(2014, 10,13, '')},
            {title: 'Dia do professor', description: '', datetime: new Date(2014, 10,15, '')},
            {title: 'Dia do funcionário', description: '', datetime: new Date(2014, 10,15, '')},
            {title: 'FECON', description: '', datetime: new Date(2014, 10,17, '')},
            {title: 'FECON', description: '', datetime: new Date(2014, 10,18, '')},
            {title: '2º Plantão pedagógico', description: '', datetime: new Date(2014, 10,25, '')},
            

            // Novembro
            {title: 'Dia das Bruxas', description: '', datetime: new Date(2014, 11,1, '')},
            {title: 'Feriado', description: 'Finados', datetime: new Date(2014, 11,2, '')},
            {title: 'TESTEVEST', description: '2º Semestre', datetime: new Date(2014, 11,8, '')},
            {title: 'TESTÃO', description: '4º Bimestre', datetime: new Date(2014, 11,13, '')},
            {title: 'Feriado', description: 'Proclamação da república', datetime: new Date(2014, 11,15, '')},
            {title: 'Dia da bandeira', description: '', datetime: new Date(2014, 11,19, '')},
            {title: 'Dia nacional da consciência negra', description: '', datetime: new Date(2014, 11,20, '')},
            {title: 'Dia Universal de Ação de Graças', description: '', datetime: new Date(2014, 11,22, '')},
            {title: 'Início das Avaliações', description: '4º Bimestre', datetime: new Date(2014, 11,24, '')},
            {title: 'Formatura da Ed. Infantil', description: '', datetime: new Date(2014, 11,24, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 11,25, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 11,26, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 11,27, '')},
            {title: 'Avaliação', description: '', datetime: new Date(2014, 11,28, '')},

            // Dezembro
            {title: 'Fim das avaliações', description: '4º Bimestre', datetime: new Date(2014, 12,1, '')},
            {title: 'Início das recuperações', description: '4º Bimestre', datetime: new Date(2014, 12,5, '')},
            {title: 'Simulado', description: '4º Bimestre', datetime: new Date(2014, 12,6, '')},
            {title: 'Dia de N. Srª da Conceição', description: '', datetime: new Date(2014, 12,8, '')},
            {title: 'Recuperações', description: '', datetime: new Date(2014, 12,8, '')},
            {title: 'Recuperações', description: '', datetime: new Date(2014, 12,9, '')},
            {title: 'Dia internacional dos direitos humanos', description: '', datetime: new Date(2014, 12,10, '')},
            {title: 'Recuperações', description: '', datetime: new Date(2014, 12,11, '')},
            {title: 'Recuperações', description: '', datetime: new Date(2014, 12,12, '')},
            {title: 'Fim das recuperações', description: '4º Bimestre', datetime: new Date(2014, 12,15, '')},
            {title: 'Início das recuperações finais', description: '', datetime: new Date(2014, 12,16, '')},
            {title: 'Recuperação Final', description: '', datetime: new Date(2014, 12,17, '')},
            {title: 'Recuperação Final', description: '', datetime: new Date(2014, 12,18, '')},
            {title: 'Recuperação Final', description: '', datetime: new Date(2014, 12,19, '')},
            {title: 'Recuperação Final', description: '', datetime: new Date(2014, 12,22, '')},
            {title: 'Fim das recuperações finais', description: '', datetime: new Date(2014, 12,23, '')},
            {title: 'Encerramento educação infantil', description: '', datetime: new Date(2014, 12,23, '')},
            {title: 'Natal', description: '', datetime: new Date(2014, 12,25, '')},
            {title: 'Conselho de classe', description: '', datetime: new Date(2014, 12,26, '')},
            {title: 'Conselho de classe', description: '', datetime: new Date(2014, 12,29, '')},
            {title: 'Resultado Final', description: '', datetime: new Date(2014, 12,30, '')},




            







            {title: 'Brasil x Camarões', description: 'Terceiro jogo da seleção bile', datetime: new Date(2014, 8, 23, 16)}
        ]
    };

}(jQuery));