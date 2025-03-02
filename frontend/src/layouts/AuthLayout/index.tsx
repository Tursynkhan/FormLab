import React from "react";
import { useLocation, Outlet } from "react-router-dom";

import styles from "./AuthLayout.module.scss";

const AuthLayout = () => {
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get("url");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Outlet context={{ redirectUrl}} />
      </div>
    </div>
  );
};

export default AuthLayout;
