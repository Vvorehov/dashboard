import{y as v,p as f,c as F}from"./index-DlvedrGh.js";function j(t={},u={}){const s=v({...t}),e=f({}),a=f(!1),i=()=>{Object.keys(s).forEach(r=>{Object.prototype.hasOwnProperty.call(t,r)?s[r]=t[r]:delete s[r]}),Object.keys(t).forEach(r=>{Object.prototype.hasOwnProperty.call(s,r)||(s[r]=t[r])}),e.value={}},l=()=>{const r={};let o=!0;return Object.keys(u).forEach(c=>{const n=u[c];if(n)for(const d of n){const{validator:b,message:p}=d;if(!b(s[c],s)){r[c]=p,o=!1;break}}}),e.value=r,o},m=F(()=>Object.keys(e.value).length===0);return{formData:s,errors:e,isSubmitting:a,isFormValid:m,validateForm:l,submitForm:async r=>{a.value=!0,e.value={};try{return l()?{success:!0,data:await r(s)}:{success:!1,errors:e.value}}catch(o){return console.error("Form submission error:",o),e.value.form=o.message||"An error occurred during form submission",{success:!1,error:o}}finally{a.value=!1}},resetForm:i}}export{j as u};
