var ClickMonkey=(function(){function D(B){var $=document.cookie.split(";"),B=B+"=";for(var C=0,A=$.length;C<A;C++)if($[C].indexOf(B)!="-1"){var _=$[C].replace(B,"");return _}return null}var B="http://nsclick.baidu.comm/h.gif?pid=113&v="+pageId,E=D("BAIDUID");if(E!=null)B+="&hao123_baiduid="+E.split(":")[0];var $="bd_clickmonkey",C=function(C){var _=(new Date()).getTime(),D=window[$+_]=new Image(),A="";for(var E in C)A+=("&"+E+"="+C[E]);D.src=B+"&r="+_+A;D.onload=D.onerror=function(){D=null}},G="",A=function($,C){C=C||[];G=$.monkey||$.getAttribute("monkey")||G;if($.parentNode&&$.parentNode.tagName.toUpperCase()!="BODY")C=A($.parentNode,C);if($.previousSibling){var _=1,B=$.previousSibling;do{if(B.nodeType==1&&B.nodeName==$.nodeName)_++;B=B.previousSibling}while(B)}if($.nodeType==1)C.push($.nodeName.toLowerCase()+(_>1?_:""));return C},F=function(_,C,B,$){if(_.addEventListener){_.addEventListener(C,B,$);return true}else if(_.attachEvent){var A=_.attachEvent("on"+C,B);return A}},H=function($){return encodeURIComponent($)};F(document.body,"mousedown",function($){var $=window.event||$,_=$.srcElement||$.target;if(_.tagName.toUpperCase()!="A")if(_.parentNode.tagName.toUpperCase()=="A")_=_.parentNode;else if(!(_.tagName.toUpperCase()=="INPUT"&&(_.type.toLowerCase()=="checkbox"||_.type.toLowerCase()=="radio"))&&!(_.tagName.toUpperCase()=="AREA"))return;G="";var D=A(_).join("-"),B={xp:D},E=_.getAttribute("href",2);if(E&&!(/^javascript|#/.test(E)))B.objurl=H(E);else B.objurl="none";if(_.innerHTML&&!(/^\s*</i.test(_.innerHTML))&&!(/>\s*$/i.test(_.innerHTML)))B.title=H(_.innerHTML);else B.title="none";if(G)B.monkey=G;C(B)});var _=function(_,$,A){var B={xp:"_"+_+"_"};if($)B.objurl=H($);else B.objurl="none";if(A)B.title=H(A);else B.title="none";C(B)};return{log:_}})()