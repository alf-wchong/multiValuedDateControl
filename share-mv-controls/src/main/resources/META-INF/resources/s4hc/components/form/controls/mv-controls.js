var S4HC = S4HC || {};

S4HC.form = S4HC.form || {};
S4HC.form.controls = S4HC.form.controls || {};

(function() {

    /**
     * YUI aliases
     */
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    /**
     * Base multi-value form control "class". Supports both single-value and multi-value fields.
     * Supported control parameters are following:
     * - params.sort (default: true) - Should values be sorted.
     * - params.allowDuplicates (default: false) - Should duplicate values be allowed.
     * @param name Component (control widget) name
     * @param htlid Field HTML ID
     */
    S4HC.form.controls.MultiValueControl = function S4HC_form_controls_MultiValueControl_constructor(name, htmlid) {
        S4HC.form.controls.MultiValueControl.superclass.constructor.call(this, name, htmlid, []);

        return this;
    };

    // extend base component
    YAHOO.extend(S4HC.form.controls.MultiValueControl, Alfresco.component.Base, {

        options: {
            novalue: '(None)',
            multiple: true,
            readOnly: false,
            currentValue: '',
            values: [],
            sort: true,
            allowDuplicates: false
        },

        /**
         * Perform widget initialization on DOM ready event.
         */
        onReady: function S4HC_form_controls_MultiValueControl_onReady() {
            // get references to html elements (hidden, display, input, add)
            this._initializeDomElements();
            // apply current value(s)
            this._processValue();
            // build underlying widget (abstract)
            this.initializeWidgets();
            // display value(s)
            this._displayValues();
        },

        /**
         * Initializes base widgets by retrieving HTML element references and registers base event listeners.
         */
        _initializeDomElements: function S4HC_form_controls_MultiValueControl_initializeDomElements() {
            // get references to DOM elements
            this.widgets.field = Dom.get(this.id);
            this.widgets.display = Dom.get(this.id + '-display');
            this.widgets.input = Dom.get(this.id + '-input');

            // register input field event listeners
            if (this.options.multiple) {
                // for multi-value fields, sttop default Enter key event
                Event.on(this.widgets.input, 'keydown', this._handleEnterEvent, {}, this);
                // create add button widget
                this.widgets.add = Alfresco.util.createYUIButton(this, 'add', this._onAddButtonClick, {});
            } else {
                // for single-value fields, copy provided input value to hidden field
                Event.on(this.widgets.input, 'change', this._copyInputValue, {}, this);
                Event.on(this.widgets.input, 'keyup', this._copyInputValue, {}, this);
                Event.on(this.widgets.input, 'blur', this._copyInputValue, {}, this);
            }

            // hide add button and input field if field is disabled/read-only
            if (this.options.readOnly) {
                if (this.widgets.add) {
                    this.widgets.add.set('disabled', true);
                }
                if (this.widgets.input) {
                    this.widgets.input.disabled = true;

                }
            }
        },

        /**
         * Processes value provided during widget initialization. This is a comma-separated string with values.
         */
        _processValue: function S4HC_form_controls_MultiValueControl_processValue() {
            if (this.options.currentValue && this.options.multiple) {
                this.options.values = this.options.currentValue.split(',');
            } else {
                this.options.values = [];
            }
        },

        /**
         * Copies value from input field to hidded field. This function is used only if current field is single-value field. 
         */
        _copyInputValue: function S4HC_form_controls_MultiValueControl_copyInputValue() {
            this.widgets.field.value = this.parseInputValue(this.widgets.input.value.trim());
        },

        /**
         * Renders displaye element with current values.
         */
        _displayValues: function S4HC_form_controls_MultiValueControl_displayValues() {
            if (this.options.multiple) {
                while (this.widgets.display.firstChild) {
                    this.widgets.display.removeChild(this.widgets.display.lastChild);
                }

                if (this.options.values.length === 0) {
                    this.widgets.display.innerHTML = this.options.novalue;
                } else {
                    for (var i in this.options.values) {
                        this._appendDisplayValue(this.options.values[i], i);
                    }
                }
            }
        },

        /**
         * Appends value to display element.
         * @param value String representation of the value.
         * @param index Index of the value in this.options.values array
         */
        _appendDisplayValue: function _appendDisplayValue(value, index) {
            var span = document.createElement('span');
            Dom.addClass(span, 'mv-field-value');
            span.innerHTML = this.toDisplayValue(value);

            // append remove link if field is not read-only
            if (!this.options.readOnly) {
                var remove = document.createElement('a');
                remove.href = 'javascript:void(0)';
                remove.innerHTML = 'x';

                Dom.addClass(remove, 'mv-field-value-remove');
                Event.on(remove, 'click', this._removeValueListener, { value: value, index: index }, this);

                span.appendChild(remove);
            }

            this.widgets.display.appendChild(span);
        },

        /**
         * Remove link listener.
         * @param e DOM event.
         * @param data Event data in format { value: <>, index: <> }
         */
        _removeValueListener: function S4HC_form_controls_MultiValueControl_removeValueListener(e, data) {
            this._removeValue(data.value, data.index);
        },

        /**
         * Adds value to the list of current values.
         * @param value Value to bve added
         */
        _addValue: function S4HC_form_controls_MultiValueControl_addValue(value) {
            if (!value.trim()) {
                return;
            }

            var index = this._getIndex(this.options.values, value);
            // if value does not exist or duplicates are allowed, add value
            if (index < 0 || this.options.allowDuplicates) {
                this.options.values.push(value);

                if (this.options.sort) {
                    this.options.values.sort();
                }
            }

            this._refreshValues();
        },

        /**
         * Removes value from the list of values.
         * @param value Value to remove
         * @param index Index of the value in this.options.values
         */
        _removeValue: function S4HC_form_controls_MultiValueControl_removeValue(value, index) {
            if (!value.trim()) {
                return;
            }

            this.options.values.splice(index, 1);
            this._refreshValues();
        },

        /**
         * Refreshes underlying hidden input element value.
         */
        _refreshValues: function S4HC_form_controls_MultiValueControl_refreshValues() {
            this.options.currentValue = this.options.values.join(',');
            this.widgets.field.value = this.options.currentValue;

            this._displayValues();
        },

        /**
         * Retrieves index of the value in array.
         * @param array Array to check.
         * @param value Value to check
         */
        _getIndex: function S4HC_form_controls_MultiValueControl_getIndex(array, value) {
            for (var i in array) {
                if (array[i] === value) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Enter event listener. Appends value to the list of values and prevents form submission.
         * @param e DOM event
         */
        _handleEnterEvent: function S4HC_form_controls_MultiValueControl_handleEnterEvent(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                this.widgets.add.fireEvent('click', {});
                Event.preventDefault(e);
            }
        },

        /**
         * Add button click listener. Appends input value (if any) to the list of values.
         */
        _onAddButtonClick: function S4HC_form_controls_MultiValueControl_onAddButtonClick() {
            var value = this.parseInputValue(this.widgets.input.value.trim());

            if (value) {
                // if input value is comma-separated, treat it as multiple values as underlying Alfresco API will do that anyway 
                var values = value.split(',');

                for (var i in values) {
                    this._addValue(values[i].trim());
                }
            }

            this.widgets.input.value = '';
        },

        /**
         * Performs base widget initialization. To be implemented by extending widgets.
         */
        initializeWidgets: function S4HC_form_controls_MultiValueControl_initializeWidgets() { },

        /**
         * Performs input value parsing. To be overriden by extending widgets (if needed).
         * @param value Input value
         * @returns Parsed value.
         */
        parseInputValue: function S4HC_form_controls_MultiValueControl_parseInputValue(value) {
            return value;
        },

        /**
         * Converts underlying value to display value. To be overriden by extending widgets (if needed).
         * @param value Input value
         * @returns Display value.
         */
        toDisplayValue: function S4HC_form_controls_MultiValueControl_toDisplayValue(value) {
            return value;
        }

    });

})();
