export function changePageTitle(content: string, pageName: string, siteName: string = 'Espace Pro') {

  if (content) {
    document.title = `${content} - ${pageName} - ${siteName}`;
  } else {
    document.title = `${pageName} - ${siteName}`;
  }
}
