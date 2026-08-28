export function changePageTitle(content: string, pageName: string) {
  const siteName = 'Espace Pro';

  if (content) {
    document.title = `${content} - ${pageName} | [${siteName}]`;
  } else {
    document.title = `${pageName} | [${siteName}]`;
  }
}
