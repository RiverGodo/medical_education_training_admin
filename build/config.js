var path = require('path')

module.exports = {
    base:{
        path: path.resolve(__dirname,'../server/dist'),
        assetsPath:'static'
    },
    dev:{
        publicPath:'/',
        port: 8001,
    },
    prod:{
        // publicPath:'/',
        publicPath:'//sfile.9mededu.com/met_admin/dist/'
    },
    test: {
        // publicPath:'/',
        publicPath:'//sfile.9mededu.com/met_admin_test/dist/',
    },
    portal: {
        publicPath:'//sfile.9mededu.com/met_admin_portal/dist/',
    }
}
