const Storage = () => {

    const getLocalStorage = () => {
        const userStorage = {
            'IdUser' : window.localStorage.getItem('IdUser'),
            'FirstName' : window.localStorage.getItem('FirstName'),
            'LastName' : window.localStorage.getItem('LastName')
          };
        return userStorage;
    }

    const setLocalStorage = (user) => {
        if(user !== null){
            window.localStorage.setItem('IdUser', user.IdUser);
            window.localStorage.setItem('FirstName', user.FirstName);
            window.localStorage.setItem('LastName', user.LastName);
        }else{
            window.localStorage.removeItem('IdUser');
            window.localStorage.removeItem('FirstName');
            window.localStorage.removeItem('LastName');
        }
    }

    return {
        getLocalStorage, setLocalStorage
    }
}

export default Storage;