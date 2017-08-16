module.exports = {
  extends: 'airbnb-base',
  env: {
    'node': true
  },
  globals: {
    wx: true,
    Page: true,
    getApp: true,
    App: true
  },
  parser: 'babel-eslint',
  rules: {
    'no-param-reassign': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }]
  }
}
