export function gotoBottom(klasse){
  var element = document.querySelector(klasse);
  element.scrollBottom = element.scrollHeight - window.clientHeight;
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 1000,
    behavior: "smooth",
  });
};