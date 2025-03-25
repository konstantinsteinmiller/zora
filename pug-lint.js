module.exports = {
  plugins: ['pug'],
  extends: 'plugin:pug/all',
  rules: {
    'pug/no-unused-vars': 'off', // Let Vue plugin handle this
  },
}
