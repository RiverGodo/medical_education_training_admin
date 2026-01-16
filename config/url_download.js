let env = process.env.NODE_ENV
const URL = 'http://' + window.location.href.split('/')[2] + '/'
export default env == 'development' ? '' : URL
