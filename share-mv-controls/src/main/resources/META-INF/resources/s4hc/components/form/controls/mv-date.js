(function() {

    /**
     * YUI aliases
     */
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    /**
     * Multi-value date field widget.
     * @param name Component (control widget) name
     * @param htlid Field HTML ID
     */
    S4HC.form.controls.MVDate = function S4HC_form_controls_MVDate_constructor(htmlid) {
        S4HC.form.controls.MVDate.superclass.constructor.call(this, 'S4HC.form.controls.MVDate', htmlid, []);

        return this;
    };

    /**
     * Extend base multi-value widget.
     */
    YAHOO.extend(S4HC.form.controls.MVDate, S4HC.form.controls.MultiValueControl, {

        /**
         * Performs YUI calendar widget initialization.
         */
        initializeWidgets: function S4HC_form_controls_MVDate_initializeWidgets() {
            if (!this.options.readOnly) {
                // initialize calendar parameters
                var today = new Date();
                var page = (today.getMonth() + 1) + "/" + today.getFullYear();
                var selected = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

                // initialize calendar widget
                this.widgets.calendar = new YAHOO.widget.Calendar(this.id + '-calendar', this.id + '-calendar', {
                    title: this.msg('form.control.date-picker.choose'),
                    close: true,
                    navigator: Alfresco.util.getCalendarControlConfiguration()
                });
                this.widgets.calendar.cfg.setProperty('pagedate', page);
                this.widgets.calendar.cfg.setProperty('selected', selected);
                Alfresco.util.calI18nParams(this.widgets.calendar);

                // register event listeners
                this._setupEvents();

                // render calendar
                this.widgets.calendar.render();
            }
        },

        /**
         * Registers calendar event listeners.
         */
        _setupEvents: function S4HC_form_controls_MVDate_setupEvents() {
            // calendar select event
            this.widgets.calendar.selectEvent.subscribe(this._onValueSelected, this, true);
            // calendar hide/close event
            this.widgets.calendar.hideEvent.subscribe(function() {
                Dom.get(this.id + '-icon').focus();
            }, this, true);
            // calendar icon click event
            var iconEl = Dom.get(this.id + '-icon');
            if (iconEl) {
                Alfresco.util.useAsButton(iconEl, this._showPicker, null, this);
                Event.addListener(this.id + '-icon', 'click', this._showPicker, this, true);
            }
            // base form validation event
            YAHOO.Bubbling.fire('registerValidationHandler', {
                fieldId: this.id + '-input',
                handler: Alfresco.forms.validation.validDateTime,
                when: 'keyup'
            });
            // input field date format validation event
            Event.on(this.widgets.input, 'keyup', this._validateDate, null, this);
        },

        /**
         * Performs input value parsing. Parses underlying date string to ISO8601 Zulu date string.
         * @param value Input value
         * @returns Parsed value.
         */
        parseInputValue: function S4HC_form_controls_MVDate_parseInputValue(value) {
            var parsedDate = Date.parseExact(value, this.msg('form.control.date-picker.entry.date.format'));

            if (parsedDate) {
                return Alfresco.util.formatDate(parsedDate, 'yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'');
            } else {
                return '';
            }
        },

        /**
         * Converts underlying ISO8601 Zulu date strng to display value string.
         * @param value Input value
         * @returns Display value.
         */
        toDisplayValue: function S4HC_form_controls_MVDate_toDisplayValue(value) {
            var date = Alfresco.util.fromISO8601(value, true);

            return date.toString(this.msg('form.control.date-picker.entry.date.format'));
        },

        /**
         * Opens YUI calendar widget.
         * @param event DOM event
         */
        _showPicker: function S4HC_form_controls_MVDate_showPicker(event) {
            this.widgets.calendar.show();
        },

        /**
         * Validates if input value matches input date format.
         */
        _validateDate: function S4HC_form_controls_MVDate_validateDate() {
            // get input valye
            var value = this.widgets.input.value;

            if (value) {
                // try to parse value, update validation class and enavble/disable add button 
                var parsedDate = Date.parseExact(value, this.msg('form.control.date-picker.entry.date.format'));

                if (parsedDate) {
                    Dom.removeClass(this.widgets.input, 'invalid');

                    if (this.widgets.add) {
                        this.widgets.add.set('disabled', false);
                    }
                } else {
                    Dom.addClass(this.widgets.input, 'invalid');

                    if (this.widgets.add) {
                        this.widgets.add.set('disabled', true);
                    }
                }
            }
        },

        /**
         * Calendar value selection event listener. Copies selected date to input field.
         * @param type Event type
         * @param args Event arguments
         * @param obj Event context
         */
        _onValueSelected: function S4HC_form_controls_MVDate_onValueSelected(type, args, obj) {
            // parse selected value
            var selectedValues = args[0];
            var selectedDate = this.widgets.calendar.toDate(selectedValues[0]);
            // format selected value and update input field
            var dateEntry = selectedDate.toString(this.msg('form.control.date-picker.entry.date.format'));
            this.widgets.input.value = dateEntry;
            // hide calendar and clear selection
            this.widgets.calendar.hide();
            this.widgets.calendar.select = '';
            // if field is songle-value, copy selected value to hidden element
            if (!this.options.multiple) {
                this._copyInputValue();
            }
        }

    });

})();
