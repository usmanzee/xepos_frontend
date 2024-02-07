import { ConfigProvider } from "antd";
import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Main } from "./components";

const App = () => (
  <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
