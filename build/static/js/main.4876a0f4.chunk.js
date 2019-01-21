(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{178:function(e,t,n){},180:function(e,t,n){},182:function(e,t,n){},185:function(e,t,n){},187:function(e,t,n){},191:function(e,t,n){},193:function(e,t,n){},195:function(e,t,n){"use strict";n.r(t);var o,a,r,i,s=n(0),c=n.n(s),u=n(20),l=n(7),p=n.n(l),m=n(10),d=n(2),h=n(3),f=n(6),b=n(4),v=n(5),y=n(13),g=n(16),w=n(18),O=n.n(w),j=n(23),C=n.n(j),N=n(33),k=n(36),S=n(29),x=function e(t,n){Object(d.a)(this,e),this.path=t,this.method=n},E={getServices:new x("/service/","get"),getServiceOptions:new x("/service/getOptions","post"),setServiceOptions:new x("/service/setOptions","post"),callServiceMethod:new x("/service/rpc","post"),getModules:new x("/modules/","get"),addModule:new x("/modules/","post"),deleteModule:new x("/modules/delete","delete"),rebuildModule:new x("/modules/rebuild","post"),updateModule:new x("/modules/update","post"),checkUpdates:new x("/modules/checkUpdates","post"),getWebPages:new x("/pages/","get"),setWebPage:new x("/pages/","post"),deleteWebPage:new x("/pages/:id","delete"),getServerInfo:new x("/app/","get"),exitApplication:new x("/app/exitApplication","post"),restartApplication:new x("/app/restartApplication","post"),shutdownSystem:new x("/app/shutdownSystem","post"),rebootSystem:new x("/app/restartSystem","post"),resetApplication:new x("/app/resetApplication","post"),getSettings:new x("/settings/","get"),setSettings:new x("/settings/","post"),getWebComponentOptions:new x("/components/","get"),setWebComponentOptions:new x("/components/","post"),deleteWebComponentOptions:new x("/components/:id","delete"),getLogEntries:new x("/log/entries","post")},T=function(){function e(){Object(d.a)(this,e),this.getAllServices=M(E.getServices,!0),this.getServiceOptions=M(E.getServiceOptions),this.setServiceOptions=M(E.setServiceOptions),this.callServiceMethod=M(E.callServiceMethod),this.getModules=M(E.getModules,!0),this.addModule=M(E.addModule),this.checkUpdates=M(E.checkUpdates),this.deleteModule=M(E.deleteModule),this.rebuildModule=M(E.rebuildModule),this.updateModule=M(E.updateModule),this.getWebPages=M(E.getWebPages,!0),this.setWebPage=M(E.setWebPage),this.deleteWebPage=M(E.deleteWebPage),this.getServerInfo=M(E.getServerInfo),this.exitApplication=M(E.exitApplication),this.restartApplication=M(E.restartApplication),this.shutdownSystem=M(E.shutdownSystem),this.rebootSystem=M(E.rebootSystem),this.resetApplication=M(E.resetApplication),this.getSettings=M(E.getSettings,!0),this.setSettings=M(E.setSettings),this.getWebComponentOptions=M(E.getWebComponentOptions,!0),this.setWebComponentOptions=M(E.setWebComponentOptions),this.deleteWebComponentOptions=M(E.deleteWebComponentOptions),this.getLogEntries=M(E.getLogEntries)}return Object(h.a)(e,[{key:"clearCache",value:function(){var e=this;Object.keys(this).forEach(function(t){e[t]&&e[t].clearCache&&e[t].clearCache()})}}]),e}(),M=function(e){var t,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=e.method.toLocaleLowerCase(),a=function(a,r){if(n&&t)return Promise.resolve(t);var i=e.path;a&&Object.keys(a).forEach(function(e){i=i.replace(":"+e,a[e])});var s=fetch(D.instance.moduleApiPath+i,{method:o,body:r&&JSON.stringify(r),headers:{"Content-Type":"application/json; charset=utf-8"}}).then(function(){var e=Object(m.a)(p.a.mark(function e(t){var n;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.text();case 2:if(n=e.sent,!t.status.toString().startsWith("2")){e.next=7;break}if(n){e.next=6;break}return e.abrupt("return",void 0);case 6:return e.abrupt("return",JSON.parse(n));case 7:throw console.log(n),Error(n);case 9:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}());return n&&(t=s),s};return a.clearCache=function(){t=void 0},a},A=new T,L=function(e,t){return new Proxy({},{get:function(n,o){return Object(m.a)(p.a.mark(function n(){var a,r,i,s,c=arguments;return p.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:for(a=c.length,r=new Array(a),i=0;i<a;i++)r[i]=c[i];return n.next=3,A.callServiceMethod(void 0,{serviceName:e,moduleName:t,methodName:o,args:r});case 3:if(s=n.sent,console.log("get "+t+"."+e+"."+o,{args:r,response:s}),!s.error){n.next=7;break}throw new Error(s.error);case 7:return n.abrupt("return",s.result);case 8:case"end":return n.stop()}},n,this)}))}})},W={clearAllSubscriptions:function(){},once:function(){},publish:function(){},subscribe:function(){},unsubscribe:function(){}},I={},P=function(){var e=Object(m.a)(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(i){e.next=4;break}return e.next=3,A.getSettings();case 3:i=e.sent;case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),V=function(){var e=Object(m.a)(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:!o&&window.require&&(o=window.require("electron"),a=o.remote.require("./dist/server/BackendService").BackendService.instance,W=a.topics,r=o.remote.require("electron-store"),W.subscribe(g.topicNames.systemSettingsUpdated,function(e,t){i=t}));case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),F=function(){function e(t){Object(d.a)(this,e),this.moduleName=t,this.electron=void 0,this.backendService=void 0,this.topics=void 0,this.moduleStorage=void 0,this.moduleApiPath=void 0,this.getService=void 0,this.electron=o,this.backendService=a,this.topics=W;var n="module."+t;r&&!I[n]&&(I[n]=new r({name:"module."+t})),this.moduleStorage=I[n];var i=t.replace("/","@");this.moduleApiPath="/api/modules/"+i,this.getService=function(e,n){return L(e,n||t)}}return Object(h.a)(e,[{key:"settings",get:function(){return i}}]),e}(),z={init:function(){var e=Object(m.a)(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V();case 2:return z.instance=new F("reactron"),e.next=5,P();case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),instance:void 0},D=z,R=n(14),U=n(15),_=n(24),G=n.n(_),K=(n(76),function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return s.createElement("section",{className:G()("Loading",{center:this.props.center})},s.createElement(U.FontAwesomeIcon,{icon:R.faSpinner,size:this.props.iconSize,spin:!0}),this.props.text&&s.createElement("div",{className:"text"},this.props.text))}}]),t}(s.Component));K.defaultProps={iconSize:"4x"};var q=n(27),B=(n(78),function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return s.createElement(q.a,{className:"RoundButton",to:this.props.to,role:"button"},this.props.children)}}]),t}(s.Component)),J=(n(80),function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return s.createElement("div",{className:"PageNotFound"},s.createElement("h1",null,s.createElement(U.FontAwesomeIcon,{icon:R.faQuestionCircle})," 404"),s.createElement("h2",null,"No page defined for path: ",this.props.location.pathname),s.createElement(B,{to:"/admin"},s.createElement(U.FontAwesomeIcon,{icon:R.faCog})," Admin"),s.createElement(B,{to:"/"},s.createElement(U.FontAwesomeIcon,{icon:R.faHome})," Home"))}}]),t}(s.Component)),H=n(31),Q=n(58),X=n(59),Y=n(60),Z=n.n(Y),$=n(32),ee=n(61),te=(n(88),n(90),{component:function(e){function t(){var e,n;Object(d.a)(this,t);for(var o=arguments.length,a=new Array(o),r=0;r<o;r++)a[r]=arguments[r];return(n=Object(f.a)(this,(e=Object(b.a)(t)).call.apply(e,[this].concat(a)))).context=void 0,n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this;return s.createElement("section",{className:"CarouselLayout",style:this.props.style},s.createElement(ee.Carousel,Object.assign({autoPlay:!0,infiniteLoop:!0,showThumbs:!1,showArrows:!1,showStatus:!1},this.props.options),this.props.items.map(function(t){return e.context.renderComponent({id:t})})))}}]),t}(s.Component),description:"Carousel Layout",displayName:"Carousel Layout",name:"CarouselLayout",type:"layout",fields:[{displayName:"Options",name:"options",valueType:"object",fields:[{displayName:"Interval in ms",name:"interval",valueType:"number",defaultValue:5e3,minValue:1e3,stepSize:50},{displayName:"Transition Time in ms",name:"transitionTime",valueType:"number",defaultValue:500,minValue:100,stepSize:50},{displayName:"Show Indicators",name:"showIndicators",valueType:"boolean",defaultValue:!0},{displayName:"Show Arrows",name:"showArrows",valueType:"boolean",defaultValue:!1},{displayName:"Show Status",name:"showStatus",valueType:"boolean",defaultValue:!1},{displayName:"Center Mode",name:"centerMode",valueType:"boolean",defaultValue:!1},{displayName:"Center Slide Percentage",name:"centerSlidePercentage",valueType:"number",defaultValue:70,minValue:1,maxValue:100,stepSize:1},{displayName:"Axis",name:"axis",valueType:"boolean",defaultValue:"horizontal",values:[{value:"horizontal",text:"horizontal"},{value:"vertical",text:"vertical"}]}],inputControl:function(e){var t=e.value&&e.value.interval;return s.createElement("span",null,"interval ",t," ms")}},{displayName:"Content",name:"items",valueType:"webComponent",isArray:!0},{displayName:"Carousel Style",name:"style",valueType:"style"}]}),ne=n(37),oe=(n(92),{component:function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e))).context=void 0,n.renderTile=n.renderTile.bind(Object(y.a)(Object(y.a)(n))),n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"renderTile",value:function(e,t){var n=Object(ne.a)({},this.props.tileStyle,e.style);return n.gridColumn=e.col.toString(),e.colspan>1&&(n.gridColumn+=" / span "+e.colspan),n.gridRow=e.row.toString(),e.rowspan>1&&(n.gridRow+=" / span "+e.rowspan),s.createElement("div",{className:"GridTile",key:t,style:n},this.context.renderComponent({id:e.content}))}},{key:"render",value:function(){return s.createElement("section",{className:"GridLayout",style:this.props.gridStyle},this.props.tiles.map(this.renderTile))}}]),t}(s.Component),description:"Grid Layout",displayName:"Grid Layout",name:"GridLayout",type:"layout",fields:[{displayName:"Grid Style",name:"gridStyle",valueType:"style"},{displayName:"Tile Style",name:"tileStyle",valueType:"style"},{displayName:"Grid tiles",name:"tiles",valueType:"object",isArray:!0,fields:[{displayName:"Row",name:"row",valueType:"number",defaultValue:1,stepSize:1,minValue:1,maxValue:20},{displayName:"Column",name:"col",valueType:"number",defaultValue:1,stepSize:1,minValue:1,maxValue:20},{displayName:"Row span",name:"rowspan",valueType:"number",defaultValue:1,stepSize:1,minValue:1,maxValue:20},{displayName:"Column span",name:"colspan",valueType:"number",defaultValue:1,stepSize:1,minValue:1,maxValue:20},{displayName:"Content",name:"content",valueType:"webComponent"},{displayName:"Style",name:"style",valueType:"style"}],inputControl:function(e){var t=e.value||{};return s.createElement("div",{style:{width:"100%",textOverflow:"ellipsis",overflow:"hidden"}},"[ ",t.row," | ",t.col," | ",t.content," ]")}}]}),ae=(n(94),{component:function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return s.createElement("iframe",{className:"ui-iframe",src:this.props.url})}}]),t}(s.Component),description:"IFrame Component",displayName:"IFrame",name:"IFrame",fields:[{displayName:"URL",name:"url",valueType:"string"}]}),re=(n(96),{component:function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e))).context=void 0,n.renderListItem=n.renderListItem.bind(Object(y.a)(Object(y.a)(n))),n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"renderListItem",value:function(e,t){var n=Object(ne.a)({},this.props.itemStyle,e.style);return s.createElement("div",{className:"ListItem",key:t,style:n},this.context.renderComponent({id:e.content}))}},{key:"render",value:function(){return s.createElement("section",{className:"ListLayout"},this.props.items.map(this.renderListItem))}}]),t}(s.Component),description:"List Layout",displayName:"List Layout",name:"ListLayout",type:"layout",fields:[{displayName:"List Style",name:"listStyle",valueType:"style"},{displayName:"Item Style",name:"itemStyle",valueType:"style"},{displayName:"List items",name:"items",valueType:"object",isArray:!0,fields:[{displayName:"Content",name:"content",valueType:"webComponent"},{displayName:"Style",name:"style",valueType:"style"}],inputControl:function(e){var t=e.value||{};return s.createElement("div",{style:{width:"100%",textOverflow:"ellipsis",overflow:"hidden"}},"[ ",t.content," ]")}}]}),ie=n(62),se=n.n(ie),ce=(n(178),{component:function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return s.createElement("section",{className:"MarkDown",style:this.props.style},s.createElement(se.a,{source:this.props.text}))}}]),t}(s.Component),description:"MarkDown Component",displayName:"MarkDown",name:"MarkDown",fields:[{displayName:"Text",name:"text",valueType:"string",textRows:10},{displayName:"Style",name:"style",valueType:"style"}]}),ue=(n(180),{component:function(e){function t(e){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).call(this,e))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return s.createElement("section",{className:"Notifications"},"Notifications")}}]),t}(s.Component),description:"Notifications",displayName:"Notifications",name:"Notifications",fields:[]}),le=n(63),pe=n.n(le),me=(n(182),[re,te,oe,{component:function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e))).state={},n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this;A.getServerInfo().then(function(t){e.setState({info:t})})}},{key:"render",value:function(){var e;return this.state.info&&(e=s.createElement("div",{className:"info"},"To edit this page click Admin-Button or visit",s.createElement("br",null),s.createElement("br",null),s.createElement("i",null,"http://",this.state.info.ip,":3000/admin"))),s.createElement("section",{className:"Welcome"},s.createElement(B,{to:"/admin"},s.createElement(U.FontAwesomeIcon,{icon:R.faCog}),"Admin"),s.createElement("img",{src:pe.a,className:"logo",alt:"logo"}),s.createElement("div",{className:"title"},"Welcome to Reactron"),e)}}]),t}(s.Component),description:"Welcome Component",displayName:"Welcome",name:"Welcome",fields:[]},ce,ue,ae]),de=new(function(){function e(){var t=this;Object(d.a)(this,e),this.moduleController=L("ModuleController","reactron"),this._modulesCache=void 0,this.modules={getModules:function(){return t._modulesCache||(t._modulesCache=t.moduleController.getModules()),t._modulesCache},addModule:function(e){return delete t._modulesCache,t.moduleController.addModule(e)},deleteModule:function(e){return delete t._modulesCache,t.moduleController.deleteModule(e)},updateModule:function(e){return delete t._modulesCache,t.moduleController.updateModule(e)},checkUpdates:this.moduleController.checkUpdates,rebuildModule:this.moduleController.rebuildModule}}return Object(h.a)(e,[{key:"clearCache",value:function(){delete this._modulesCache}}]),e}()),he=window.System,fe={};fe.react=s,fe["react-dom"]=u,fe["react-router-dom"]=$,fe.numeral={default:C.a},fe.moment={default:O.a},fe["moment-timezone"]={default:Z.a},fe["@fortawesome/fontawesome-svg-core"]=H,fe["@fortawesome/free-solid-svg-icons"]=R,fe["@fortawesome/free-regular-svg-icons"]=X,fe["@fortawesome/free-brands-svg-icons"]=Q,fe["@fortawesome/react-fontawesome"]=U,fe["@schirkan/reactron-interfaces"]=g,window.require&&(fe.electron=window.require("electron")),Object.keys(fe).forEach(function(e){var t=fe[e];he.register(e,[],function(e){return{execute:function(){return e(t)}}})});var be=new(function(){function e(){Object(d.a)(this,e),this.allComponentsLoaded=!1,this.moduleComponents={reactron:me}}return Object(h.a)(e,[{key:"getModuleComponents",value:function(){var e=Object(m.a)(p.a.mark(function e(t){var n,o;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.moduleComponents[t]){e.next=10;break}return e.next=3,de.modules.getModules();case 3:if(n=e.sent,o=n.find(function(e){return e.name===t})){e.next=8;break}return console.error("Module not found: "+t),e.abrupt("return");case 8:return e.next=10,this.registerModuleComponents(o);case 10:return e.abrupt("return",this.moduleComponents[t]);case 11:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"registerModuleComponents",value:function(){var e=Object(m.a)(p.a.mark(function e(t){var n,o;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.browserFile){e.next=3;break}return console.log("Module has no browserFile: "+t.name),e.abrupt("return");case 3:if(!this.moduleComponents[t.name]){e.next=5;break}return e.abrupt("return");case 5:return e.prev=5,console.log(t.browserFile),e.next=9,he.import("\\"+t.browserFile);case 9:n=e.sent,(o=n.components)&&"object"===typeof o&&Array.isArray(o)&&(this.moduleComponents[t.name]=o),console.log("Components loaded for module: "+t.name),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(5),console.error("Error loading components for module: "+t.name,e.t0);case 18:case"end":return e.stop()}},e,this,[[5,15]])}));return function(t){return e.apply(this,arguments)}}()},{key:"getAllComponents",value:function(){var e=Object(m.a)(p.a.mark(function e(){var t,n,o,a,r,i,s;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.allComponentsLoaded){e.next=2;break}return e.abrupt("return",this.moduleComponents);case 2:return e.next=4,de.modules.getModules();case 4:t=e.sent,n=!0,o=!1,a=void 0,e.prev=8,r=t[Symbol.iterator]();case 10:if(n=(i=r.next()).done){e.next=17;break}return s=i.value,e.next=14,this.registerModuleComponents(s);case 14:n=!0,e.next=10;break;case 17:e.next=23;break;case 19:e.prev=19,e.t0=e.catch(8),o=!0,a=e.t0;case 23:e.prev=23,e.prev=24,n||null==r.return||r.return();case 26:if(e.prev=26,!o){e.next=29;break}throw a;case 29:return e.finish(26);case 30:return e.finish(23);case 31:return this.allComponentsLoaded=!0,e.abrupt("return",this.moduleComponents);case 33:case"end":return e.stop()}},e,this,[[8,19,23,31],[24,,26,30]])}));return function(){return e.apply(this,arguments)}}()}]),e}()),ve=function(){function e(t,n){Object(d.a)(this,e),this.topics=t,this.source=n}return Object(h.a)(e,[{key:"log",value:function(e,t,n){this.topics&&this.topics.publish(g.topicNames.log,{source:this.source,severity:e,message:t,data:n})}},{key:"error",value:function(e,t){this.log("error",e,t)}},{key:"warning",value:function(e,t){this.log("warning",e,t)}},{key:"info",value:function(e,t){this.log("information",e,t)}},{key:"debug",value:function(e,t){this.log("debug",e,t)}}]),e}(),ye=function(e){function t(e){var n;Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e.moduleName))).renderLoading=void 0,n.renderComponent=void 0,n.componentLoader=be,n.log=void 0,n.componentName=void 0;var o=e.id||e.moduleName+"."+e.componentName;return n.log=new ve(n.backendService&&n.backendService.topics,o),n.componentName=e.componentName,n.renderComponent=function(e){var t=e.id+"."+e.moduleName+"."+e.componentName;return c.a.createElement(je,Object.assign({},e,{key:t}))},n.renderLoading=function(e,t){return c.a.createElement(K,{text:e,iconSize:t})},n}return Object(v.a)(t,e),t}(F),ge=c.a.createContext(new ye({moduleName:"",parentId:"",componentName:"",id:""})),we=(n(185),function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(b.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=[];return this.props.id&&e.push("Id: "+this.props.id),this.props.componentName&&e.push("Component: "+this.props.componentName),this.props.moduleName&&e.push("Module: "+this.props.moduleName),s.createElement("section",{className:"ComponentNotFound"},s.createElement(U.FontAwesomeIcon,{icon:R.faExclamationTriangle,size:this.props.iconSize}),s.createElement("div",{className:"text"},"Component not found: ",e.join(" | ")),s.createElement(B,{to:"/admin"},s.createElement(U.FontAwesomeIcon,{icon:R.faCog})," Admin"))}}]),t}(s.Component));we.defaultProps={iconSize:"4x"};var Oe=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e))).state={error:null},n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"componentDidCatch",value:function(e,t){console.log(e),console.log(t),this.setState({error:e})}},{key:"render",value:function(){return this.state.error?s.createElement("span",{style:{color:"red"}},"Something went wrong."):this.props.children}}]),t}(s.Component),je=(n(187),function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e))).state={},n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.id===e.id&&this.props.moduleName===e.moduleName&&this.props.componentName===e.componentName&&this.props.options===e.options||this.loadComponent()}},{key:"componentDidMount",value:function(){this.loadComponent()}},{key:"loadComponent",value:function(){var e=Object(m.a)(p.a.mark(function e(){var t,n,o,a,r,i=this;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!this.props.id){e.next=8;break}return e.next=4,A.getWebComponentOptions();case 4:n=e.sent,t=n.find(function(e){return e.id===i.props.id}),e.next=9;break;case 8:this.props.moduleName&&this.props.componentName&&(t={id:"",parentId:"",moduleName:this.props.moduleName,componentName:this.props.componentName,options:this.props.options});case 9:if(t){e.next=12;break}return this.setState({componentFound:!1}),e.abrupt("return");case 12:return e.next=14,be.getModuleComponents(t.moduleName);case 14:if(o=e.sent){e.next=18;break}return this.setState({componentFound:!1}),e.abrupt("return");case 18:if(a=t.componentName,(r=o.find(function(e){return e.name===a}))&&r.component){e.next=23;break}return this.setState({componentFound:!1}),e.abrupt("return");case 23:this.setState({componentContext:new ye(t),componentDefinition:r,componentOptions:t,componentFound:!0}),e.next=30;break;case 26:e.prev=26,e.t0=e.catch(0),console.log(e.t0),this.setState({componentFound:!1});case 30:case"end":return e.stop()}},e,this,[[0,26]])}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=s.createElement(K,{center:!0});if(!1===this.state.componentFound&&(e=s.createElement(we,this.props)),this.state.componentDefinition&&this.state.componentDefinition.component&&this.state.componentContext){var t=this.state.componentDefinition.component;t.contextType||(t.contextType=ge);var n=this.state.componentOptions&&this.state.componentOptions.options||{};e=s.createElement(ge.Provider,{value:this.state.componentContext},s.createElement(t,n))}var o=G()("WebComponent",this.props.className);return s.createElement("section",{className:o,style:this.props.style},s.createElement(Oe,null,e))}}]),t}(s.Component)),Ce=(n(189),n(190),n(191),function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(b.a)(t).call(this,e))).reloadTimer=void 0,n.reloadWait=2e3,n.state={},n.reload=n.reload.bind(Object(y.a)(Object(y.a)(n))),n.triggerReload=n.triggerReload.bind(Object(y.a)(Object(y.a)(n))),n.onKeyDown=n.onKeyDown.bind(Object(y.a)(Object(y.a)(n))),n}return Object(v.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=Object(m.a)(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.init();case 2:this.subscribeTopics(),document.addEventListener("keydown",this.onKeyDown);case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){this.unsubscribeTopics(),document.removeEventListener("keydown",this.onKeyDown)}},{key:"onKeyDown",value:function(e){var t=window.event?window.event:e;65===t.keyCode&&t.ctrlKey&&t.altKey&&(window.location.href="/admin")}},{key:"subscribeTopics",value:function(){D.instance.topics&&(D.instance.topics.subscribe(g.topicNames.pagesUpdated,this.triggerReload),D.instance.topics.subscribe(g.topicNames.componentsUpdated,this.triggerReload),D.instance.topics.subscribe(g.topicNames.systemSettingsUpdated,this.triggerReload))}},{key:"unsubscribeTopics",value:function(){D.instance.topics&&(D.instance.topics.unsubscribe(g.topicNames.pagesUpdated,this.triggerReload),D.instance.topics.unsubscribe(g.topicNames.componentsUpdated,this.triggerReload),D.instance.topics.unsubscribe(g.topicNames.systemSettingsUpdated,this.triggerReload))}},{key:"init",value:function(){var e=Object(m.a)(p.a.mark(function e(){var t;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,D.init();case 2:return O.a.locale(D.instance.settings.lang),C.a.locale(D.instance.settings.lang),e.next=6,A.getWebPages();case 6:return t=e.sent,e.abrupt("return",this.setState({pages:t}));case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"triggerReload",value:function(){window.clearTimeout(this.reloadTimer),this.reloadTimer=window.setTimeout(this.reload,this.reloadWait)}},{key:"reload",value:function(){console.log("reload"),A.clearCache(),this.init()}},{key:"renderPage",value:function(e,t){return function(){return s.createElement("section",{className:"WebPage",style:t},s.createElement(je,{id:e}))}}},{key:"render",value:function(){var e=this,t=s.createElement(K,{text:"Loading Reactron...",center:!0});return this.state.pages&&(t=s.createElement(N.a,null,s.createElement(k.a,null,this.state.pages.map(function(t){return s.createElement(S.a,{key:t.path,path:t.path,exact:"/"===t.path,component:e.renderPage(t.webComponentId,t.style)})}),s.createElement(S.a,{component:J})))),s.createElement("section",{className:"App"},t)}}]),t}(s.Component));n(193);u.render(s.createElement(Oe,null,s.createElement(Ce,null)),document.getElementById("root"))},63:function(e,t,n){e.exports=n.p+"static/media/logo.ee7cd8ed.svg"},65:function(e,t,n){e.exports=n(195)},76:function(e,t,n){},78:function(e,t,n){},80:function(e,t,n){},90:function(e,t,n){},92:function(e,t,n){},94:function(e,t,n){},96:function(e,t,n){}},[[65,2,1]]]);
//# sourceMappingURL=main.4876a0f4.chunk.js.map