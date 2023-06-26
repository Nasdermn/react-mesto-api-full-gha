class AuthApi {
  constructor(options) {
    this.url = options.url;
    this.headers = options.headers;
  }

  handleResponse(res) {
    return res.ok
      ? res.json()
      : Promise.reject('Ошибка при обращении к серверу в компоненте AuthApi');
  }

  registerUser(email, password) {
    return fetch(`${this.url}/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email, password }),
    }).then(this.handleResponse);
  }

  loginUser(email, password) {
    return fetch(`${this.url}/signin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email, password }),
    })
      .then(this.handleResponse)
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        return data;
      });
  }

  tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    return fetch(`${this.url}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }).then(this.handleResponse);
  }
}

const options = {
  url: 'https://api.pr.nasdermn.nomoredomains.work',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': 'localhost:3000',
  },
};

const authApi = new AuthApi(options);
export default authApi;
