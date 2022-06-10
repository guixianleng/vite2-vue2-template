const CDN = 'https://lib.baomitu.com/' // CDN Homepage: https://cdn.baomitu.com/

function splicingPluginUrl(PluginName, version, fileName) {
  return `${CDN}${PluginName}/${version}/${fileName}`
}

export default {
  beautifierUrl: splicingPluginUrl('js-beautify', '1.13.5', 'beautifier.min.js'),
  tinymceUrl: splicingPluginUrl('tinymce', '5.7.0', 'tinymce.min.js')
}
