const Logout = () => {
    const close = async (path) => {
        window.localStorage.removeItem('IdUser');
        window.localStorage.removeItem('FirstName');
        window.localStorage.removeItem('LastName');
        window.location.assign(path);
    }
    return {
        close,
    }
}

export default Logout;