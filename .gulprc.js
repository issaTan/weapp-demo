const config = {
  base: 'src',
  dest: 'dist',
  src: {
    js: ['**/*.js'],
    less: ['**/*.less'],
    img: ['imgs/**/*.*'],
    wxml: ['**/*.wxml'],
    json: ['**/*.json'],
    wxss: ['**/*.wxss']
  },
  ignore: {
    js: [],
    less: ['styles/', 'styles/**', 'var.less'],
    img: ['imgs/icon', 'imgs/icon/**'],
    wxml: [],
    json: [],
    wxss: []
  },
  source: {}
}


Object.keys(config.src).forEach(key => {
  config.src[key] = config.src[key].map(item => {
    return `${config.base}/${item}`;
  })
});
Object.keys(config.ignore).forEach(key => {
  config.ignore[key] = config.ignore[key].map(item => {
    return `!${config.base}/${item}`;
  });
});
Object.keys(config.src).forEach(key => {
  const ignoreObject = config.ignore[key] || []
  return config.source[key] = config.src[key].concat(ignoreObject);
});

module.exports = config
