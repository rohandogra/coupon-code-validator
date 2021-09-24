import Axios from "axios";

const axios = Axios.create({
  baseURL:
    process.env.REACT_APP_PRODUCTION_BASE_URL || `http://localhost:3030/v1`,
});

export default axios;
