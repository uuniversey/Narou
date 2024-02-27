import axios from 'axios'

const instance = axios.create({
  // proxy: {
  //   host: '43.203.124.51',
  //   port: 18080
  // },
  withCredentials: true,
    baseURL: 'https://narou-back.duckdns.org/api/'
    // baseURL: 'http://localhost:8080/api/'
})


export default instance