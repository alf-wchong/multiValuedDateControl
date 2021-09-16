(function() {

    /**
     * Multi-value text field widget.
     * @param name Component (control widget) name
     * @param htlid Field HTML ID
     */
    S4HC.form.controls.MVTextField = function S4HC_form_controls_MVTextField_constructor(htmlid) {
        S4HC.form.controls.MVTextField.superclass.constructor.call(this, 'S4HC.form.controls.MVTextField', htmlid, []);

        return this;
    };

    /**
     * Extend base mutli-value widget.
     */
    YAHOO.extend(S4HC.form.controls.MVTextField, S4HC.form.controls.MultiValueControl);

})();
