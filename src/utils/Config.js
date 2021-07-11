module.exports = global.config = {
    url: {
        dev: 'http://192.168.1.59/Tasks/api/',
        //dev: 'https://localhost:44371/api/',
        prod: ''
    },
    headers: {
        dev: new Headers({ 'Content-Type': 'application/json;charset=UTF-8', }),
        prod: ''
    },
    images: {
        local: process.env.PUBLIC_URL,
        api: 'http://192.168.1.24:8000/images/'
    },
    videos: {
        local: process.env.PUBLIC_URL,
        api: 'http://192.168.1.24:8000/videos/'
    }
};