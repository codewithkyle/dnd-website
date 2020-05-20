import{hookup as i,disconnect as t}from"./broadcaster.mjs";class e extends HTMLElement{constructor(){super(),this.timer=this.querySelector("time"),this.inboxUid=i("initiation-order",this.inbox.bind(this)),this.time=performance.now(),this.tick()}inbox(i){switch(i.type){case"update-initiation-index":this.checkIndex(i.index);break;case"clear-order":this.index=null,this.classList.remove("is-visible");break;case"set-order":this.setIndex(i.order)}}tick(){const i=performance.now(),t=(i-this.time)/1e3;this.time=i,this.countdown>0&&(this.countdown-=t,this.countdown<0&&(this.countdown=0),this.timer.innerHTML=""+Math.round(this.countdown)),window.requestAnimationFrame(this.tick.bind(this))}checkIndex(i){i===this.index?(this.countdown=60,this.classList.add("is-visible")):(this.classList.remove("is-visible"),this.countdown=0)}setIndex(i){for(let t=0;t<i.length;t++)if(i[t].characterUid===this.dataset.characterUid){this.index=t;break}}disconnectedCallback(){t(this.inboxUid),this.tick=()=>{}}}customElements.define("combat-timer",e);