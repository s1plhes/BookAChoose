import{_ as m,r as d,g as h,c,t as i,d as p,e as s,f as v,q as f,o as n,p as x,i as k,a as y}from"./index-vyn2smVK.js";import{c as w}from"./checkAuth-4erMPWyQ.js";const I=o=>(x("data-v-d3698252"),o=o(),k(),o),L={class:"logout-container"},S=I(()=>y("h1",{class:"text-2xl font-bold text-slate-200 mt-12"},"Logout Process",-1)),b={key:0,class:"text-green-500"},B={key:1,class:"text-red-500"},A={__name:"user_logout",setup(o){const a=d(""),t=d(""),_="https://api-db-dbxo.onrender.com/",g=async()=>{var r,u;const l=s.get("accessToken");try{const e=await v.post(`${_}/logout`,{},{headers:{Authorization:`Bearer ${l}`}});e.status===200?(localStorage.clear(),s.remove("accessToken"),s.remove("avatar"),s.remove("name"),a.value="You have been logged out successfully!",setTimeout(()=>{window.location.href="/login"},800)):t.value=e.data.message||"Unknown error"}catch(e){console.error("Logout error:",e),t.value=((u=(r=e.response)==null?void 0:r.data)==null?void 0:u.message)||"Logout failed :("}};return h(()=>{g(),w(f)}),(l,r)=>(n(),c("div",L,[S,a.value?(n(),c("p",b,i(a.value),1)):p("",!0),t.value?(n(),c("p",B,"Logout failed: "+i(t.value),1)):p("",!0)]))}},P=m(A,[["__scopeId","data-v-d3698252"]]);export{P as default};
