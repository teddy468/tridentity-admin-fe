import "antd/dist/antd.css";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "src/assets/scss/variable.scss";
import "src/assets/scss/_themes.scss";
import "./App.scss";
import Layout from "./components/01.layout";
import LocaleProviderComponent from "./components/15.locale-provider";
import ToastContext from "./contexts/toast";
import Routes from "./routes/Routes";
import initStore from "./store";
import { handleRefreshToken } from "./services/core/http-service";
import {
  createSessionCookie,
  getCookie,
  getStorageRememberMe,
  removeStorageJwtToken,
  removeStorageRefreshToken,
} from "./helpers/storage";

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-50, 50],
});

const App: React.FC = () => {
  const { store } = initStore();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    (async () => {
      if (getStorageRememberMe()) {
        await handleRefreshToken();
      } else {
        const isActive = getCookie("isActive");
        if (!isActive) {
          removeStorageJwtToken();
          removeStorageRefreshToken();
          // user is not logged in, redirect to login page
          createSessionCookie("isActive", "true");
          window.location.href = "/login";
        }
      }
      setMount(true);
    })();
  }, []);

  if (!mount) return null;

  return (
    <Provider store={store}>
      <LocaleProviderComponent>
        <BrowserRouter basename="">
          <ToastContext />
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </LocaleProviderComponent>
    </Provider>
  );
};

export default App;
