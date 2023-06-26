class Api {
  constructor({ url }) {
    this.url = url;
  }

  handleResponse(res) {
    return res.ok ? res.json() : Promise.reject('Ошибка при обращении к серверу в компоненте Api');
  }

  postCard({ name, link }) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this.handleResponse);
  }

  getInitialCards() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/cards`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this.handleResponse);
  }

  getUserProfile() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/users/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this.handleResponse);
  }

  patchProfile(name, about) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this.handleResponse);
  }

  patchAvatar(avatar) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then(this.handleResponse);
  }

  likeCard(id) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/cards/${id}/likes`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this.handleResponse);
  }

  dislikeCard(id) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this.handleResponse);
  }

  changeLikeCardStatus(id, isLiked) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/cards/${id}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this.handleResponse);
  }

  deleteCard(id) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this.url}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this.handleResponse);
  }
}

const api = new Api({
  url: 'http://localhost:3000',
});

export default api;
