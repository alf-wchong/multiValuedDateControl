<#assign disabled=field.disabled>
<#if field.control.params.forceEditable?? && field.control.params.forceEditable == "true">
    <#assign disabled=false>
</#if>

<#assign multiValued=field.repeating>

<#if form.capabilities?? && form.capabilities.javascript?? && form.capabilities.javascript == false><#assign jsDisabled=true><#else><#assign jsDisabled=false></#if>
<#assign viewFormat>${msg("form.control.date-picker.view.date.format")}</#assign>

<div class="form-field">
    <#if form.mode == "view">
    <div class="viewmode-field">
        <#if field.mandatory && field.value == "">
        <span class="incomplete-warning"><img src="${url.context}/res/components/form/images/warning-16.png" title="${msg("form.field.incomplete")}" /><span>
        </#if>
        <span class="viewmode-label">${field.label?html}:</span>
        <#if field.value == "">
        <span class="viewmode-value">${msg("form.control.novalue")}</span>
        <#elseif !multiValued>
        <span class="viewmode-value viewmode-value-date" data-date-iso8601="${field.value}">${xmldate(field.value)?string(viewFormat)}</span>
        <#else>
        <span class="viewmode-value">
            <#list field.value?split(",") as dateEl>
            <span class="mv-field-value">${xmldate(dateEl)?string(viewFormat)}</span>
            </#list>
        </span>
        </#if>
    </div>
    <#else>
        <#if jsDisabled>
        <label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
        <input id="${fieldHtmlId}" name="${field.name?html}" type="text" class="date-entry" value="${field.value?html}" <#if field.description??>title="${field.description}"</#if> <#if disabled>disabled="true"<#else>tabindex="0"</#if> />
        <div class="format-info">
            <span class="date-format">${msg("form.control.date-picker.entry.datetime.format.nojs")}</span>
        </div>
        <#else>
        <input id="${fieldHtmlId}" type="hidden" name="${field.name?html}" value="${field.value?html}" />
        <label for="${fieldHtmlId}-date">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
        <div id="${fieldHtmlId}-display" class="mv-field-display"></div>
        <div class="mv-field-input">
            <input id="${fieldHtmlId}-input" <#if !multiValued && field.value != "">value="${xmldate(field.value)?string(msg("form.control.date-picker.entry.date.format"))}"</#if> name="-" type="text" class="date-entry" <#if field.description??>title="${field.description}"</#if> <#if disabled>disabled="true"<#else>tabindex="0"</#if> />
            <#if disabled == false>
            <a id="${fieldHtmlId}-icon" tabindex="0"><img src="${url.context}/res/components/form/images/calendar.png" class="datepicker-icon"/></a>
            </#if>
            <div id="${fieldHtmlId}-calendar" class="datepicker"></div>
            <#if multiValued><button id="${fieldHtmlId}-add">Add</button></#if>
            <@formLib.renderFieldHelp field=field />
            <div class="format-info">
                <span class="date-format">${msg("form.control.date-picker.display.date.format")}</span>
            </div>
        </div>
        </#if>
    
        <script type="text/javascript">//<![CDATA[
        (function() {

            new S4HC.form.controls.MVDate('${fieldHtmlId}').setOptions({
                novalue: '${msg("form.control.novalue")}',
                multiple: ${multiValued?string},
                <#if form.mode == "view" || field.disabled>readOnly: true,</#if>
                <#if field.control.params.sort?exists>sort: ${field.control.params.sort},</#if>
                <#if field.control.params.allowDuplicates?exists>allowDuplicates: ${field.control.params.allowDuplicates},</#if>
                currentValue: '${field.value}'
            }).setMessages(${messages});

        })();
        //]]></script>
    </#if>
</div>
