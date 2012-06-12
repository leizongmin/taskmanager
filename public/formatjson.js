/**
 * 格式化json代码
 */
var jsl=typeof jsl==="undefined"?{}:jsl;jsl.format=(function(){function b(c,d){return new Array(d+1).join(c)}function a(g){var f=0,e=0,h="    ",d="",j=0,k=false,c=null;for(f=0,e=g.length;f<e;f+=1){c=g.charAt(f);switch(c){case"{":case"[":if(!k){d+=c+"\n"+b(h,j+1);j+=1}else{d+=c}break;case"}":case"]":if(!k){j-=1;d+="\n"+b(h,j)+c}else{d+=c}break;case",":if(!k){d+=",\n"+b(h,j)}else{d+=c}break;case":":if(!k){d+=": "}else{d+=c}break;case" ":case"\n":case"\t":if(k){d+=c}break;case'"':if(f>0&&g.charAt(f-1)!=="\\"){k=!k}d+=c;break;default:d+=c;break}}return d}return{formatJson:a}}());

var formatJson = jsl.format.formatJson;
