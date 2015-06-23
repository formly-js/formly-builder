<script type="text/javascript">
//
// Text to HTML

//
var theTDs = document.getElementsByTagName("TD");
var i=0;
var TDContent = " ";
while (i < theTDs.length) {
    try {
        TDContent = theTDs[i].innerText || theTDs[i].textContent;
        if ((TDContent.indexOf("<DIV") == 0) && (TDContent.indexOf("</DIV>") >= 0)) {
            theTDs[i].innerHTML = TDContent;
        }
    }
    catch(err){}
    i=i+1;
}
//
// ExpGroupRenderData overwrites the default SharePoint function
// This part is needed for collapsed groupings
//
function ExpGroupRenderData(htmlToRender, groupName, isLoaded) {
    var tbody=document.getElementById("tbod"+groupName+"_");
    var wrapDiv=document.createElement("DIV");
    wrapDiv.innerHTML="<TABLE><TBODY id=\"tbod"+ groupName+"_\" isLoaded=\""+isLoaded+ "\">"+htmlToRender+"</TBODY></TABLE>";
    var theTBODYTDs = wrapDiv.getElementsByTagName("TD"); var j=0; var TDContent = " ";
    while (j < theTBODYTDs.length) {
        try {
            TDContent = theTBODYTDs[j].innerText || theTBODYTDs[j].textContent;
            if ((TDContent.indexOf("<DIV") == 0) && (TDContent.indexOf("</DIV>") >= 0)) {
                theTBODYTDs[j].innerHTML = TDContent;
            }
        }
        catch(err){}
        j=j+1;
    }
    tbody.parentNode.replaceChild(wrapDiv.firstChild.firstChild,tbody);
}
</script>
