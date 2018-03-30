/** 
 * jQuery plugin 'dialog' v.1.0.0
 * Copyright (©) by Konstantin Kachurenko <konstantin.kachurenko@gmail.com>
 * The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * @param Object options = {
 *   Boolean   modal   : false,
 *   Boolean   bubble  : true,
 *   Function  open    : null,
 *   Function  close   : null
 *   Function  realign : null
 * }
 */
(function($){ "use strict";

    /** Конструктор объекта плагина */ 
    $.dialog = function(element, options){
        this.constructor.apply(this, Array.prototype.slice.apply(arguments, [0]));
    };

    $.dialog.prototype = Object.create($.popup.prototype);
    $.dialog.prototype.constructor = $.popup;

    /** Замена содержимого диалога */ 
    $.dialog.prototype.put = function(content){
        return this.empty().append(content);
    };

    /** Очистка содержимого диалога */ 
    $.dialog.prototype.empty = function(){
        return (
            this.$popup.children('.popup-content').length
                ? this.$popup.children('.popup-content:first-child')
                : this.$popup
        ).empty();
    };

    /** Регистрация плагина jQuery */ 
    $.fn.dialog = function(options){
        return this.each(function(i, elem){
            (new $.dialog(elem, options === void 0 ? {} : options));
        });
    };

    /** Обработка триггеров показа */ 
    $(document).on('click', '[data-dialog]', function(e) {

        var $trigger = $(e.target).closest('[data-dialog]'),
            $popup = $($trigger.attr('data-dialog')).eq(0);

        e.preventDefault();

        if ($popup.length) {
            if (!($popup.data('popup') instanceof $.popup)) {
                $popup.dialog({
	                modal   : $popup.get(0).hasAttribute('data-modal'),
	                bubble  : $popup.get(0).hasAttribute('data-bubble'),
	                open    : new Function($popup.attr('data-open')),
	                close   : new Function($popup.attr('data-close')),
	                realign : new Function($popup.attr('data-realign')),
	            });
            }
            $popup.data('popup').open();
        }
    });

})(jQuery);