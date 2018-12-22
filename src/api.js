import axios from 'axios'; //Importanto a api do axios

//Criando uma função de baseURL utilizando o comando do axios.create e dando nome de api
const api = axios.create({
    baseURL: 'https://api.github.com',
});

//exportando a função api como default
export default api;