/**
 * jQuery plugin 'popup' v.1.0.0
 * Copyright (©) by Konstantin Kachurenko <konstantin.kachurenko@gmail.com>
 * http://konstantin-kachurenko.github.io/
 * The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * $(slector).popup({
 *   Boolean   modal   : false,
 *   Boolean   bubble  : true,
 *   Function  open    : null,
 *   Function  close   : null,
 *   Function  realign : null
 * });
 */
(function($) { "use strict";

    /** Клик по подложке */ 
	function _overlay() {
        !this.options.modal && this.close();
    }

    /** Закрытие всплывающего блока и подложки */ 
    function _close() {
        this.$popup.add(this.$overlay).removeClass('popup-show');
    }

    /** Конструктор объекта плагина */ 
    $.popup = function(element, options) {

        var $both;

        this.$popup = $(element).addClass('popup');

        // Если повторная инициализация - уничтожение предыдущей копии плагина
		if (this.$popup.data('popup') instanceof $.popup) {
            this.$popup.data('popup').destroy();
        }

        // Настройка параметров
        this.config(options);

        // Если подложки нет - ее создание
        this.$overlay = $(this.$popup.next('.popup-overlay').get(0) || '<div class="popup-overlay" data-popup-js="" />').insertAfter(this.$popup);

        // Если передан параметр инициализации 'bubble' - перенос блоков в конец <body>
        $both = this.$popup.add(this.$overlay).data('popup', this);
        options.bubble && $('body').append($both);

        // Включение обработки кликов по подложке
        this.$overlay.on('click', $.proxy(_overlay, this));

        // Создание функции-обработчика resize и обработка события
        this._realign = (function(plugin) {
            return function() {
                plugin.realign();
            };
        })(this);
        $(window).on('resize', this._realign);
    };

    /** Параметры по умолчанию */ 
    $.popup.prototype.defaultOptions = {
        modal   : false,
        bubble  : true,
        open    : function() {},
        close   : function() {},
        realign : function() {}
    };

    $.popup.prototype.options = {};
    $.popup.prototype.$popup = null;
    $.popup.prototype.$overlay = null;

    /** Настройка копии плагина */ 
    $.popup.prototype.config = function(options) {
        this.options = $.extend({}, this.defaultOptions, this.options, options);
        return this;
    };

    /** Функция отображения подложки */ 
    $.popup.prototype.overlay = function() {
        if (!this.$overlay.hasClass('popup-show')) {
            $('.popup.popup-show').after(this.$overlay);
            this.$overlay.addClass('popup-show');
        }
        return this;
    };

    /** Функция отображения всплывающего блока */ 
    $.popup.prototype.open = function() {
        this.options.open instanceof Function && this.options.open.call(this.$popup.get(0));
        this.overlay().$overlay.after(this.$popup);
        this.realign().$popup.addClass('popup-show');
        return this;
    };

    /** Функция позиционирования всплывающего блока */ 
    $.popup.prototype.realign = function() {

		// Если есть пользовательская обработка realign
        var realign = this.options.realign;
        realign instanceof Function && realign.call(this.$popup.get(0));

        this.$popup.css({
            'margin-top': '-' + (this.$popup.outerHeight(false) / 2) + 'px',
            'margin-left': '-' + (this.$popup.outerWidth(false) / 2) + 'px'
        });
        return this;
    };

    /** Закрытие всплывающего блока */
    $.popup.prototype.close = function(delay) {
        if (delay !== void 0) {
            setTimeout($.proxy(this.close, this), Math.abs(Number(delay)) | 0);
        } else {
            this.options.close instanceof Function && this.options.close.call(this.$popup.get(0));
            _close.call(this);
        }
        return this;
    };

    /** Уничтожение копии плагина с отменой обработки событий */
    $.popup.prototype.destroy = function() {
        _close.call(this);
        $(window).off('resize', this._realign);
        this.$overlay.off('click', $.proxy(_overlay, this));
        this.$popup.add(this.$overlay).removeData('popup').filter('[data-popup-js]').remove();
        return this.$popup;
    };

    /** Регистрация плагина jQuery */
    $.fn.popup = function(options) {
        return this.each(function(i, elem) {
            (new $.popup(elem, options === void 0 ? {} : options));
        });
    };

    /** Обработка триггеров закрытия */
    $(document).on('click', '.popup-close', function(e) {

        var $popup = $(e.target).closest('.popup, .popup-overlay').eq(0);

        e.preventDefault();

        if ($popup.length) {
            if ($popup.data('popup') instanceof $.popup) {
                $popup.data('popup').close();
            }
        }
    });

})(jQuery);