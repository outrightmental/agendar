(this.webpackJsonpagendar=this.webpackJsonpagendar||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var c=n(0),i=n(1),a=n.n(i),s=n(8),o=n.n(s),l=n(7),r=n(2),u=n(3),d=n(5),h=n(4),v=(n(14),6e4),f=36e5,j=24*f,m={apiKey:g("REACT_APP_GOOGLE_API_KEY"),clientId:g("REACT_APP_GOOGLE_CLIENT_ID"),discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],scope:["https://www.googleapis.com/auth/calendar.events.readonly","https://www.googleapis.com/auth/calendar.readonly"].join(" ")};function g(e){var t=document.head.querySelector("[name=".concat(e,"][content]"));return t&&t.content?t.content:(console.error("Cannot retrieve value for META tag named",e),"n/a")}for(var b="static-content-",p={},O=document.querySelectorAll("[id^=".concat(b,"]")),x=0;x<O.length;x++)w(O[x].id.replace(b,""));function w(e){var t=document.getElementById("".concat(b).concat(e));p[e]="".concat(t.innerHTML),t.remove()}var M=function(e){var t=e.name;return Object(c.jsx)("div",{className:"container",dangerouslySetInnerHTML:{__html:'<div class="container">'.concat(p[t],"</div>")}})},y=(n(15),["SUN","MON","TUE","WED","THU","FRI","SAT"]),S="IN",k="MINUTE",F=function(e){return"".concat(I(e)," ").concat(C(e))},I=function(e){return"".concat(e.getFullYear(),"-").concat(N(e.getMonth()+1),"-").concat(N(e.getDate())," ").concat(y[e.getDay()])},C=function(e){return"".concat(N(e.getHours()),":").concat(N(e.getMinutes()),":").concat(N(e.getSeconds()))},E=function(e){var t=e.getTime()-Date.now();return t>2*j?"".concat(S," ").concat(Math.floor(t/j)," ").concat("DAYS"):t>j?"".concat(S," ").concat(Math.floor(t/j)," ").concat("DAY"):t>2*f?"".concat(S," ").concat(Math.floor(t/f)," ").concat("HOURS"):t>f?"".concat(S," ").concat(Math.floor(t/f)," ").concat("HOUR"):t>12e4?"".concat(S," ").concat(Math.floor(t/v)," ").concat("MINUTES"):t>v?"".concat(S," ").concat(Math.floor(t/v)," ").concat(k):t>3e4?"".concat("LESS THAN"," 1 ").concat(k):"NOW"};function N(e){return e<10?"0".concat(e):"".concat(e)}function D(e){var t=e.getTime()-Date.now();return t<3e4?"event-go":t<12e4?"event-ready":t<3e5?"event-standby":t<12e5?"event-near":"event-far"}var T=function(e){var t,n=e.event,i=new Date,a=n.start.dateTime?new Date(n.start.dateTime):new Date(n.start.date),s=i.getDate()===a.getDate();return Object(c.jsxs)("div",{className:"agendar-event ".concat(D(a)),children:[Object(c.jsxs)("div",{className:"header",children:[Object(c.jsx)("div",{className:"t-minus",children:E(a)}),Object(c.jsx)("div",{className:"date-time",children:s?(t=a,"".concat("TODAY"," ").concat(C(t))):F(a)})]}),Object(c.jsx)("div",{className:"info",children:Object(c.jsx)("div",{className:"summary",children:n.summary})})]},n.id)},A=(n(16),function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var c;return Object(r.a)(this,n),(c=t.call(this,e)).state={date:"",time:""},c}return Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.setState({intervalId:setInterval((function(){e.pulse()}),1e3)}),this.pulse()}},{key:"componentWillUnmount",value:function(){clearInterval(this.state.intervalId)}},{key:"pulse",value:function(){var e=new Date;this.setState({time:C(e),date:I(e)})}},{key:"render",value:function(){return Object(c.jsxs)("div",{id:"clock",children:[Object(c.jsx)("p",{className:"date",children:this.state.date}),Object(c.jsx)("p",{className:"time",children:this.state.time})]})}}]),n}(i.Component)),H=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var c;return Object(r.a)(this,n),(c=t.call(this,e)).state={isMenuOpen:!1,isFullscreen:!1,isSignedIn:!1,intervalId:null,lastFetchedMillis:null,calendarEvents:[]},c}return Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=document.createElement("script");t.src="https://apis.google.com/js/platform.js",t.async=!0,t.defer=!0,t.onload=function(){e.didLoadGoogleApi()},document.head.appendChild(t),this.setState({intervalId:setInterval((function(){e.pulse()}),5e3)})}},{key:"componentWillUnmount",value:function(){clearInterval(this.state.intervalId)}},{key:"pulse",value:function(){if(this.state.isSignedIn){var e=Date.now();!this.state.lastFetchedMillis||this.state.lastFetchedMillis<e-3e5?(this.fetchCalendarEvents(),this.setState({lastFetchedMillis:e})):this.setState({calendarEvents:this.state.calendarEvents})}}},{key:"didLoadGoogleApi",value:function(){var e=this,t=this.onSuccess.bind(this);window.gapi.load("auth2",(function(){e.auth2=gapi.auth2.init(m),e.auth2.then((function(){e.setState({isSignedIn:e.auth2.isSignedIn.get()}),e.pulse()}))})),window.gapi.load("signin2",(function(){var e=Object(l.a)(Object(l.a)({},m),{},{width:200,height:50,onsuccess:t});gapi.signin2.render("login-button",e)}))}},{key:"onSuccess",value:function(){this.setState({isSignedIn:!0})}},{key:"doLogout",value:function(){var e=this;this.auth2.signOut().then((function(){e.setState({isSignedIn:!1,lastFetchedMillis:null}),window.location.reload(!1)}),(function(){alert("Failed to sign out!")}))}},{key:"doMenuButtonClicked",value:function(){this.state.isMenuOpen?this.setState({isMenuOpen:!1}):this.setState({isMenuOpen:!0})}},{key:"doOpenFullscreen",value:function(){var e=this;document.documentElement.requestFullscreen?document.documentElement.requestFullscreen().then((function(){e.setState({isFullscreen:!0})}),(function(){alert("Failed to open in fullscreen mode!")})):alert("Fullscreen mode not supported in your browser!")}},{key:"doCloseFullscreen",value:function(){var e=this;document.exitFullscreen?document.exitFullscreen().then((function(){e.setState({isFullscreen:!1})}),(function(){e.setState({isFullscreen:!1})})):alert("Fullscreen mode not supported in your browser!")}},{key:"fetchCalendarEvents",value:function(){var e=this;console.info("Will initialize client"),window.gapi.load("client",(function(){gapi.client.init(m).then((function(){console.info("Will fetch calendar events"),gapi.client.load("calendar","v3",(function(){gapi.client.calendar.events.list({calendarId:"primary",timeMin:(new Date).toISOString(),timeMax:new Date(Date.now()+864e5).toISOString(),showDeleted:!1,singleEvents:!0,maxResults:99,orderBy:"startTime"}).then((function(t){e.setState({calendarEvents:t.result.items})}))}))}))}))}},{key:"renderAgendaCalendar",value:function(){return this.state.isSignedIn?Object(c.jsx)("div",{id:"agendar-calendar",children:this.state.calendarEvents.map((function(e){return Object(c.jsx)(T,{event:e},e.id)}))}):Object(c.jsxs)("div",{id:"agendar-calendar",children:[Object(c.jsxs)("h1",{children:["Agendar",Object(c.jsx)("sup",{className:"tiny",children:"\u2122"})]}),Object(c.jsxs)("h2",{children:["Heads-Up Display",Object(c.jsx)("br",{})," for being on time."]}),Object(c.jsx)("button",{className:"space-above",id:"login-button",children:"Login with Google"}),Object(c.jsx)("div",{className:"content space-above",children:Object(c.jsx)(M,{name:"privacy-promise"})})]})}},{key:"renderAgenda",value:function(){return Object(c.jsxs)("div",{id:"agendar",children:[Object(c.jsx)("div",{id:"agendar-clock",children:Object(c.jsx)(A,{})}),this.renderAgendaCalendar()]})}},{key:"renderMenuButton",value:function(){var e=this;return Object(c.jsx)("div",{className:"ui-button ".concat(this.state.isMenuOpen?"lit":""),id:"menu-button",onClick:function(){return e.doMenuButtonClicked()},children:Object(c.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 32 32",children:[Object(c.jsx)("title",{children:"Menu"}),Object(c.jsx)("path",{fill:"#ffffff",d:"M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"})]})})}},{key:"renderMenuContent",value:function(){var e=this;return this.state.isMenuOpen?Object(c.jsx)("div",{id:"menu-backdrop",onClick:function(){return e.doMenuButtonClicked()},children:Object(c.jsxs)("div",{id:"menu-body",children:[Object(c.jsx)("div",{className:"menu-item",children:Object(c.jsxs)("div",{className:"content",children:[Object(c.jsx)(M,{name:"intro"}),Object(c.jsx)(M,{name:"privacy-promise"}),Object(c.jsx)(M,{name:"about"}),Object(c.jsx)(M,{name:"legal"})]})}),this.state.isSignedIn?Object(c.jsx)("div",{className:"menu-item menu-selection",onClick:function(){return e.doLogout()},children:"Logout"}):""]})}):""}},{key:"renderFullscreenButton",value:function(){var e=this;return this.state.isFullscreen?Object(c.jsx)("div",{className:"ui-button",id:"fullscreen-button",onClick:function(){return e.doCloseFullscreen()},children:Object(c.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",children:[Object(c.jsx)("title",{children:"Exit Fullscreen Mode"}),Object(c.jsx)("path",{fillRule:"evenodd",fill:"#ffffff",d:"M7 7V1H5v4H1v2h6zM5 19h2v-6H1v2h4v4zm10-4h4v-2h-6v6h2v-4zm0-8h4V5h-4V1h-2v6h2z"})]})}):Object(c.jsx)("div",{className:"ui-button",id:"fullscreen-button",onClick:function(){return e.doOpenFullscreen()},children:Object(c.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",children:[Object(c.jsx)("title",{children:"Enter Fullscreen Mode"}),Object(c.jsx)("path",{fillRule:"evenodd",fill:"#ffffff",d:"M1 1v6h2V3h4V1H1zm2 12H1v6h6v-2H3v-4zm14 4h-4v2h6v-6h-2v4zm0-16h-4v2h4v4h2V1h-2z"})]})})}},{key:"render",value:function(){return Object(c.jsxs)("div",{id:"app",children:[this.renderFullscreenButton(),this.renderMenuButton(),this.renderMenuContent(),this.renderAgenda()]})}}]),n}(i.Component),B=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,18)).then((function(t){var n=t.getCLS,c=t.getFID,i=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),c(e),i(e),a(e),s(e)}))};o.a.render(Object(c.jsx)(a.a.StrictMode,{children:Object(c.jsx)(H,{})}),document.getElementById("root")),B()}},[[17,1,2]]]);
//# sourceMappingURL=main.5b4d8298.chunk.js.map