import{hookup as n,disconnect as i}from"./broadcaster.mjs";import{debug as t}from"./env.mjs";export class Actor extends HTMLElement{constructor(n){super(),this.inboxName=n}inbox(n){}connected(){}disconnected(){}connectedCallback(){this.inboxName||(this.inboxName="nil"),this.inboxId=n(this.inboxName,this.inbox.bind(this)),this.connected()}disconnectedCallback(){i(this.inboxId),this.disconnected()}}