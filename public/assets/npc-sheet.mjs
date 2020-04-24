import{env as e}from"./env.mjs";import{snackbar as s}from"./notifyjs.mjs";import{message as t}from"./broadcaster.mjs";class a extends HTMLElement{constructor(){super(),this.handleSave=e=>{e.preventDefault(),this.save()},this.handleKeypress=e=>{e instanceof KeyboardEvent&&"s"===e.key&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),this.save())},this.form=this.querySelector("form"),this.isSaving=!1}async save(){var t;if(this.isSaving)return;const a=e.startLoading();this.isSaving=!0;const n=new FormData(this.form),i=await fetch(location.origin+"/actions/entries/save-entry",{method:"POST",body:n,headers:new Headers({Accept:"application/json"}),credentials:"include"});if(i.ok){const e=await i.json();if(e.success)s({message:"NPC successfully saved.",closeable:!0,force:!0,duration:3});else{const a=(null==e?void 0:e.error)||(null===(t=null==e?void 0:e.errors)||void 0===t?void 0:t[0])||null;a&&s({message:a,closeable:!0,force:!0,duration:3})}}else{await i.text();s({message:"Failed to save NPC, try again later.",closeable:!0,force:!0,duration:3})}this.isSaving=!1,e.stopLoading(a)}connectedCallback(){this.form.addEventListener("submit",this.handleSave),document.addEventListener("keydown",this.handleKeypress),document.body.querySelector("#save-button").addEventListener("click",this.handleSave),t("server",{type:"join",name:"Game Master",campaign:this.dataset.campaignUid})}}customElements.define("npc-sheet",a);