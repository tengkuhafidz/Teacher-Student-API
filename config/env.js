const env = {
    MYSQL_DATABASE: 'app',
    MYSQL_ROOT_PASSWORD: 'root',
    MYSQL_USER: 'app',
    MYSQL_PASSWORD: 'app',
    MYSQL_USER_MONITORING: 'monitoring',
    MYSQL_PASSWORD_MONITORING: 'monitoring',
    HOST: 'localhost',
    DIALECT: 'mysql',
    POOL: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

module.exports = env;