<#assign disabled=field.disabled>
<#if field.control.params.forceEditable?? && field.control.params.forceEditable == "true">
   <#assign disabled=false>
</#if>

<#assign multiValued=field.repeating>

<div class="form-field">
    <#if form.mode == "view">
    <div class="viewmode-field">
        <#if field.mandatory && !(field.value?is_number) && field.value == "">
        <span class="incomplete-warning"><img src="${url.context}/res/components/form/images/warning-16.png" title="${msg("form.field.incomplete")}" /><span>
        </#if>
        <span class="viewmode-label">${field.label?html}:</span>
        <#if field.control.params.activateLinks?? && field.control.params.activateLinks == "true">
            <#assign fieldValue=field.value?html?replace("((http|ftp|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?\\^=%&:\\/~\\+#]*[\\w\\-\\@?\\^=%&\\/~\\+#])?)", "<a href=\"$1\" target=\"_blank\">$1</a>", "r")>
        <#else>
            <#if field.value?is_number>
                <#assign fieldValue=field.value?c>
            <#else>
                <#assign fieldValue=field.value?html>
            </#if>
        </#if>
        <#if fieldValue == "">
        <span class="viewmode-value">${msg("form.control.novalue")}</span>
        <#elseif !multiValued>
        <span class="viewmode-value">${fieldValue}</span>
        <#else>
        <span class="viewmode-value">
        <#list fieldValue?split(",") as elValue>
            <span class="mv-field-value">${elValue}</span>
        </#list>
        </span>
        </#if>
    </div>
    <#else>
    <label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
    <div id="${fieldHtmlId}-display" class="mv-field-display"></div>
    <input id="${fieldHtmlId}" name="${field.name}" type="hidden" <#if field.value?is_number>value="${field.value?c}"<#else>value="${field.value?html}"</#if> />
    <div class="mv-field-input">
        <input id="${fieldHtmlId}-input" tabindex="0"
            <#if field.control.params.password??>type="password"<#else>type="text"</#if>
            class="mv-field-input-field <#if field.control.params.styleClass??>${field.control.params.styleClass}</#if>"
            <#if field.control.params.style??>style="${field.control.params.style}"</#if>
            <#if field.description??>title="${field.description}"</#if>
            <#if field.control.params.maxLength??>maxlength="${field.control.params.maxLength}"<#else>maxlength="1024"</#if> 
            <#if field.control.params.size??>size="${field.control.params.size}"</#if>
            <#if !multiValued><#if field.value?is_number>value="${field.value?c}"<#else>value="${field.value?html}"</#if></#if>
            <#if disabled>disabled="true"</#if> />
        <#if multiValued><button id="${fieldHtmlId}-add">Add</button></#if>
    </div>
    <@formLib.renderFieldHelp field=field />
    <script type="text/javascript">//<![CDATA[
    (function() {

        new S4HC.form.controls.MVTextField('${fieldHtmlId}').setOptions({
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
