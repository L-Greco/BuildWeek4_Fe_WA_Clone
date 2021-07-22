export function gotoBottom(klasse){
  var element = document.querySelector(klasse);
  element.scrollBottom = element.scrollHeight - window.clientHeight;
}