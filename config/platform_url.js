let env = process.env.NODE_ENV
const PRO_URL = 'met.9mededu.com'
const TEST_URL = 'met.physicianedu.com'
const PORTAL_URL = 'met.9mededu.com'
const DEV_URL = 'met.physicianedu.com'
export default env == 'production' ? PRO_URL : env == 'portal' ? PORTAL_URL : env == 'testing' ? TEST_URL : DEV_URL
