function setStroge(k:string,v:string){
  return localStorage.setItem(k,v);
}
function getStroge(k:string){
  return localStorage.getItem(k);
}
export const getThemeMode=()=>{
  return getStroge('themeMode');
}
export const setThemeMode=(mode:'normal'|'dark')=>{
  console.log(mode)
  setStroge('themeMode',mode);
}
