let env = process.env.NODE_ENV
const PRO_URL = '//api.9mededu.com/met/'
const PORTAL_URL = '//api.9mededu.com/met_admin2/'
const TEST_URL = '//api.9mededu.com/met_admin_test/'
const DEV_URL = '//api.9mededu.com/met_admin_test/'
// const DEV_URL = 'http://192.168.1.4:5521/met_admin_dev/'
// const DEV_URL = 'http://192.168.3.17:5024/met_admin2/'
// const DEV_URL = 'http://api.9mededu.com/met_admin_test/'
// const DEV_URL = 'http://api.9mededu.com/met_admin2/'

// const DEV_URL = 'http://api.9mededu.com/met/'
console.log(env,'env');

export default env == 'production' ? PRO_URL : env == 'portal' ? PORTAL_URL : env == 'testing' ? TEST_URL : DEV_URL
