!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("vue")):"function"==typeof define&&define.amd?define("VueToast",["vue"],e):"object"==typeof exports?exports.VueToast=e(require("vue")):t.VueToast=e(t.Vue)}(this,(t=>(()=>{"use strict";var e={831:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=(t,e)=>{const s=t.__vccOpts||t;for(const[t,o]of e)s[t]=o;return s}},976:e=>{e.exports=t}},s={};function o(t){var i=s[t];if(void 0!==i)return i.exports;var n=s[t]={exports:{}};return e[t](n,n.exports,o),n.exports}o.d=(t,e)=>{for(var s in e)o.o(e,s)&&!o.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var i={};return(()=>{o.r(i),o.d(i,{ToastComponent:()=>d,ToastPlugin:()=>h,ToastPositions:()=>l,default:()=>v,useToast:()=>m});var t=o(976);const e=(0,t.createElementVNode)("div",{class:"v-toast__icon"},null,-1),s=["innerHTML"];function n(t){var e;void 0!==t.remove?t.remove():null===(e=t.parentNode)||void 0===e||e.removeChild(t)}function r(e,s,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};const n=(0,t.h)(e,s,i),r=document.createElement("div");return r.classList.add("v-toast--pending"),o.appendChild(r),(0,t.render)(n,r),n.component}class a{constructor(t,e){this.startedAt=Date.now(),this.callback=t,this.delay=e,this.timer=setTimeout(t,e)}pause(){this.stop(),this.delay-=Date.now()-this.startedAt}resume(){this.stop(),this.startedAt=Date.now(),this.timer=setTimeout(this.callback,this.delay)}stop(){clearTimeout(this.timer)}}const l=Object.freeze({TOP_RIGHT:"top-right",TOP:"top",TOP_LEFT:"top-left",BOTTOM_RIGHT:"bottom-right",BOTTOM:"bottom",BOTTOM_LEFT:"bottom-left"});var c;const u={all:c=c||new Map,on:function(t,e){var s=c.get(t);s?s.push(e):c.set(t,[e])},off:function(t,e){var s=c.get(t);s&&(e?s.splice(s.indexOf(e)>>>0,1):c.set(t,[]))},emit:function(t,e){var s=c.get(t);s&&s.slice().map((function(t){t(e)})),(s=c.get("*"))&&s.slice().map((function(s){s(t,e)}))}},p=(0,t.defineComponent)({name:"Toast",props:{message:{type:String,required:!0},type:{type:String,default:"success"},position:{type:String,default:l.BOTTOM_RIGHT,validator:t=>Object.values(l).includes(t)},duration:{type:Number,default:3e3},dismissible:{type:Boolean,default:!0},onDismiss:{type:Function,default:()=>{}},onClick:{type:Function,default:()=>{}},queue:Boolean,pauseOnHover:{type:Boolean,default:!0}},data:()=>({isActive:!1,parentTop:null,parentBottom:null,isHovered:!1}),beforeMount(){this.setupContainer()},mounted(){this.showNotice(),u.on("toast-clear",this.dismiss)},methods:{setupContainer(){if(this.parentTop=document.querySelector(".v-toast.v-toast--top"),this.parentBottom=document.querySelector(".v-toast.v-toast--bottom"),this.parentTop&&this.parentBottom)return;this.parentTop||(this.parentTop=document.createElement("div"),this.parentTop.className="v-toast v-toast--top"),this.parentBottom||(this.parentBottom=document.createElement("div"),this.parentBottom.className="v-toast v-toast--bottom");const t=document.body;t.appendChild(this.parentTop),t.appendChild(this.parentBottom)},shouldQueue(){return!!this.queue&&(this.parentTop.childElementCount>0||this.parentBottom.childElementCount>0)},dismiss(){this.timer&&this.timer.stop(),clearTimeout(this.queueTimer),this.isActive=!1,setTimeout((()=>{this.onDismiss.apply(null,arguments);const e=this.$refs.root;(0,t.render)(null,e),n(e)}),150)},showNotice(){if(this.shouldQueue())return void(this.queueTimer=setTimeout(this.showNotice,250));const t=this.$refs.root.parentElement;this.correctParent.insertAdjacentElement("afterbegin",this.$refs.root),n(t),this.isActive=!0,this.duration&&(this.timer=new a(this.dismiss,this.duration))},whenClicked(){this.dismissible&&(this.onClick.apply(null,arguments),this.dismiss())},toggleTimer(t){this.pauseOnHover&&this.timer&&(t?this.timer.pause():this.timer.resume())}},computed:{correctParent(){switch(this.position){case l.TOP:case l.TOP_RIGHT:case l.TOP_LEFT:return this.parentTop;case l.BOTTOM:case l.BOTTOM_RIGHT:case l.BOTTOM_LEFT:return this.parentBottom}},transition(){switch(this.position){case l.TOP:case l.TOP_RIGHT:case l.TOP_LEFT:return{enter:"v-toast--fade-in-down",leave:"v-toast--fade-out"};case l.BOTTOM:case l.BOTTOM_RIGHT:case l.BOTTOM_LEFT:return{enter:"v-toast--fade-in-up",leave:"v-toast--fade-out"}}}},beforeUnmount(){u.off("toast-clear",this.dismiss)}});const d=(0,o(831).default)(p,[["render",function(o,i,n,r,a,l){return(0,t.openBlock)(),(0,t.createBlock)(t.Transition,{"enter-active-class":o.transition.enter,"leave-active-class":o.transition.leave},{default:(0,t.withCtx)((()=>[(0,t.withDirectives)((0,t.createElementVNode)("div",{ref:"root",role:"alert",class:(0,t.normalizeClass)(["v-toast__item",["v-toast__item--".concat(o.type),"v-toast__item--".concat(o.position)]]),onMouseover:i[0]||(i[0]=t=>o.toggleTimer(!0)),onMouseleave:i[1]||(i[1]=t=>o.toggleTimer(!1)),onClick:i[2]||(i[2]=function(){return o.whenClicked&&o.whenClicked(...arguments)})},[e,(0,t.createElementVNode)("p",{class:"v-toast__text",innerHTML:o.message},null,8,s)],34),[[t.vShow,o.isActive]])])),_:1},8,["enter-active-class","leave-active-class"])}]]),m=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{open(e){let s=null;"string"==typeof e&&(s=e);const o={message:s},i=Object.assign({},o,t,e);return{dismiss:r(d,i,document.body).ctx.dismiss}},clear(){u.emit("toast-clear")},success(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.open(Object.assign({},{message:t,type:"success"},e))},error(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.open(Object.assign({},{message:t,type:"error"},e))},info(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.open(Object.assign({},{message:t,type:"info"},e))},warning(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.open(Object.assign({},{message:t,type:"warning"},e))},default(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.open(Object.assign({},{message:t,type:"default"},e))}}},h={install:function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=m(e);t.config.globalProperties.$toast=s,t.provide("$toast",s)}},v=h})(),i})()));