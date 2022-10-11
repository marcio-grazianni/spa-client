var E=document.createElement("div");
E.id="sves-expandedSeal";
E.tabIndex=-1;
E.style.display="none";
E.style.zIndex="2002";
E.style.position="absolute";
E.style.background="#fff";
E.style.width="332px";
E.style.height="302px";
E.style.border="1px solid #a3a3a3";
E.style.boxShadow="0 0 2px rgba(0, 0, 0, 0.3)";
E.style.left="-75px"
E.style.top="-306px";
E.style.outline="none";
E.style.fontFamily="Helvetica Neue, sans-serif";
E.style.letterSpacing="0.095em";
E.innerHTML='<iframe id="sves-small-frame" src="' + svesBase + '/seal/' + svesUUID + '/iframe/" tabindex="-1" frameborder="0" scrolling="no" style="border:0;width:331px;height:264px;z-index:2002;"></iframe><div id="sves-transparent-overlay" style="width:331px;height:264px;z-index:2003;position:absolute;top:0;left:1px;"></div><div id="sves-footer" style="width:96%;margin-top:8px;margin-left:2%;border-top:1px solid #e3e3e3;padding-top:5px;"><a href="http://dev.subscribervoice.com/e2eb4677-d737-44e8-8784-37f1af18bd05/about/" id="sves-footer-about" style="float:left;margin:0 5px;color:#a3a3a3;font-size:10px;font-weight:400;text-decoration:none;" target="_blank">About</a><a href="http://dev.subscribervoice.com/e2eb4677-d737-44e8-8784-37f1af18bd05/privacy/" id="sves-footer-privacy" style="float:left;margin:0 5px;color:#a3a3a3;font-size:10px;font-weight:400;text-decoration:none;" target="_blank">Privacy</a><a href="http://dev.subscribervoice.com/seal/' + validationUUID + '/" id="sves-footer-verify" style="float:left;margin:0 5px;color:#a3a3a3;font-size:10px;font-weight:400;text-decoration:none;" target="_blank">Verify</a><img id="sves-footer-powered" src="/static/images/Expandedpoweredby.png" style="margin-right:1px;margin-top:-1px;float:right;height:16px;"></div>'
document.getElementById(locationId).appendChild(E);
var F=document.getElementById("sves-seal");
var t=null;
var s=null;
function T(m) {
	t=window.setTimeout(function() {
		E.style.display="none";
	}, m);
	return t;
}
function hideOnBlur(ev) {	
	if (svesR == null) {
		svesR=ev.explicitOriginalTarget||document.activeElement;
	}
	if(svesR.id!="sves-expandedSeal"){
		E.style.display="none";
	}
	else {
		E.focus();
	}
	svesR=null;
}
F.onmousedown=function(){
	if(E.style.display=="block"){
		svesR=E;
	}
}
F.onclick=function(){
	if(E.style.display=="block"){
		E.style.display="none";
	}
	else{
		E.style.display="block";
		E.focus();
	}
}
F.onmouseover=function(){
	window.clearTimeout(t);
	t=null;
}
F.onmouseout=function(){
	window.clearTimeout(t);
	t=T(500);
}
E.onmouseover=function(){
	window.clearTimeout(t);
	t=null;
}
E.onmouseout=function(){
	window.clearTimeout(t);
	t=T(500);
}
E.onblur=function(ev){
	hideOnBlur(ev);
}
var I=document.getElementById("sves-transparent-overlay");
