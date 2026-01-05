import{r as Y,c as _,w as j,o as X,a as I,b as q,d as N,F as G,e as Q,f as J,n as O}from"./vendor-jaAiwJbD.js";const w=200,K=800,tt=.1,et=.3,$=.5,nt=.5,at=12,rt=800,it=1600,ot=150,st=3500,lt=["#FFC700","#FF0000","#2E3191","#41BBC7"];var S={props:{particleCount:{type:Number,default:ot},particleSize:{type:Number,default:at},duration:{type:Number,default:st},colors:{type:Array,default:lt},force:{type:Number,default:nt},stageHeight:{type:Number,default:rt},stageWidth:{type:Number,default:it},shouldDestroyAfterDone:{type:Boolean,default:!0}},setup(e){const l=Y(!0),v=(t,n)=>{k(t,{degree:n})},i=_(()=>p(e.particleCount,e.colors));j(()=>{e.particleCount>300&&console.log("[VUE-CONFETTI-EXPLOSION] That's a lot of confetti, you sure about that? A lesser number like 200 will still give off the party vibes while still not bricking the device 😉")});const s=_(()=>z(e.particleCount,e.duration,e.colors,e.particleSize,e.force,e.stageHeight,e.stageWidth));X(async()=>{await x(e.duration),e.shouldDestroyAfterDone&&(l.value=!1)});const p=(t,n)=>{const a=360/t;return Array.from({length:t},(c,o)=>({color:n[o%n.length],degree:o*a}))},x=t=>new Promise(n=>setTimeout(n,t));function f(t){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:2;return Math.round((t+Number.EPSILON)*10**n)/10**n}function b(t,n){if(t===n)return!0;if(t==null||n==null||t.length!==n.length)return!1;for(let a=0;a<t.length;a++)if(t[a]!==n[a])return!1;return!0}const g=(t,n,a,c,o)=>(t-n)*(o-c)/(a-n)+c,A=(t,n)=>{const a=t+n;return a>360?a-360:a},R=()=>Math.random()>.5,T=[0,0,1],C=[[1,1,0],[1,0,1],[0,1,1],[1,0,0],[0,1,0],T],F=t=>!b(C[t],T)&&R(),u=t=>typeof t>"u",h=t=>{console.error(t)};function z(t,n,a,c,o,m,y){const d=Number.isSafeInteger;return!u(t)&&d(t)&&t<0?(h("particleCount must be a positive integer"),!1):!u(n)&&d(n)&&n<0?(h("duration must be a positive integer"),!1):!u(a)&&!Array.isArray(a)?(h("colors must be an array of strings"),!1):!u(c)&&d(c)&&c<0?(h("particleSize must be a positive integer"),!1):!u(o)&&d(o)&&(o<0||o>1)?(h("force must be a positive integer and should be within 0 and 1"),!1):!u(m)&&typeof m=="number"&&d(m)&&m<0?(h("floorHeight must be a positive integer"),!1):!u(y)&&typeof y=="number"&&d(y)&&y<0?(h("floorWidth must be a positive integer"),!1):!0}function k(t,n){let{degree:a}=n;const c=g(Math.abs(A(a,90)-180),0,180,-e.stageWidth/2,e.stageWidth/2),o=Math.random()*(K-w)+w,m=Math.round(Math.random()*(C.length-1)),y=e.duration-Math.round(Math.random()*1e3),d=Math.random()<tt,E=F(m),M=d?f(Math.random()*et,2):0,B=M*-1,P=M,D=f(Math.abs(g(Math.abs(A(a,90)-180),0,180,-1,1)),4),L=f(Math.random()*$,4),V=f(Math.random()*e.force*(R()?1:-1),4),H=$,U=f(Math.max(g(Math.abs(a-180),0,180,e.force,-e.force),0),4),r=(Z,W)=>t?.style.setProperty(Z,W+"");r("--x-landing-point",`${c}px`),r("--duration-chaos",`${y}ms`),r("--x1",`${M}`),r("--x2",`${B}`),r("--x3",`${P}`),r("--x4",`${D}`),r("--y1",`${L}`),r("--y2",`${V}`),r("--y3",`${H}`),r("--y4",`${U}`),r("--width",`${E?e.particleSize:Math.round(Math.random()*4)+e.particleSize/2}px`),r("--height",(E?e.particleSize:Math.round(Math.random()*2)+e.particleSize)+"px"),r("--rotation",`${C[m].join()}`),r("--rotation-duration",`${o}ms`),r("--border-radius",`${E?"50%":"0"}`)}return{isVisible:l,isValid:s,stageHeight:e.stageHeight,particles:i,setItemRef:v}}};function ct(e,l,v,i,s,p){return i.isVisible&&i.isValid?(N(),I("div",{key:0,class:"confetti-container",style:O(`--floor-height: ${i.stageHeight}px;`)},[(N(!0),I(G,null,Q(i.particles,x=>{let{color:f,degree:b}=x;return N(),I("div",{key:b,class:"particle",ref:g=>i.setItemRef(g,b)},[J("div",{style:O(`--bgcolor: ${f};`)},null,4)],512)}),128))],4)):q("",!0)}function dt(e,l){l===void 0&&(l={});var v=l.insertAt;if(!(typeof document>"u")){var i=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css",v==="top"&&i.firstChild?i.insertBefore(s,i.firstChild):i.appendChild(s),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(document.createTextNode(e))}}var ft=`
@keyframes y-axis-4ff796ae {
to {
    transform: translate3d(0, var(--floor-height), 0);
}
}
@keyframes x-axis-4ff796ae {
to {
    transform: translate3d(var(--x-landing-point), 0, 0);
}
}
@keyframes rotation-4ff796ae {
to {
    transform: rotate3d(var(--rotation), 360deg);
}
}
.confetti-container[data-v-4ff796ae] {
  width: 0;
  height: 0;
  overflow: visible;
  position: relative;
  transform: translate3d(var(--x, 0), var(--y, 0), 0);
  z-index: 1200;
}
.confetti-container > .particle[data-v-4ff796ae] {
  animation: x-axis-4ff796ae var(--duration-chaos) forwards cubic-bezier(var(--x1), var(--x2), var(--x3), var(--x4));
}
.confetti-container > .particle div[data-v-4ff796ae] {
  position: absolute;
  top: 0;
  left: 0;
  animation: y-axis-4ff796ae var(--duration-chaos) forwards cubic-bezier(var(--y1), var(--y2), var(--y3), var(--y4));
  width: var(--width);
  height: var(--height);
}
.confetti-container > .particle div[data-v-4ff796ae]:before {
  display: block;
  height: 100%;
  width: 100%;
  content: "";
  background-color: var(--bgcolor);
  animation: rotation-4ff796ae var(--rotation-duration) infinite linear;
  border-radius: var(--border-radius);
}
`;dt(ft);S.render=ct;S.__scopeId="data-v-4ff796ae";var ht=(()=>{const e=S;return e.install=l=>{l.component("ConfettiExplosion",e)},e})();export{ht as e};
