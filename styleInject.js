export default function styleInject(css, uniqueName) {
  if (css === '' || uniqueName === '') return
  let $style = document.head.querySelector(`style[data-styled-${uniqueName}]`)

  if ($style === null) {
    $style = document.createElement('style')
    $style.setAttribute(`data-styled-${uniqueName}`, '')

    if ($style.styleSheet) {
      $style.styleSheet.cssText = css
    } else {
      $style.appendChild(document.createTextNode(css))
    }

    document.head.append($style)
  }
}
