import React, { ChangeEvent } from 'react';
import styles from "./Header.module.scss"
import { useNavigate } from "react-router-dom";
import { debounce } from "../../utils/index";
import { googleFormIcon } from '../../utils/index';
import { User } from "../../context/AuthProvider"

import Avatar from "../Avatar";
type HeaderProps = {
  search: string | null;
  user: User | null;
};

const Header = ({ search, user }: HeaderProps) => {
  const navigate = useNavigate();

  const handleChange = debounce<ChangeEvent<HTMLInputElement>>(
    ({ target: { value } }) => {
      navigate({ search: value ? `?search=${value}` : "" });
    },
    500
  );

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {googleFormIcon}
        <span>Google Form</span>
      </div>
      <div className={styles.search_box}>
        <input
          placeholder="Search by title"
          defaultValue={search || ""}
          onChange={handleChange}
        />
        <i className="bx-search"></i>
      </div>
      <div className={styles.avatar}>
        <Avatar userName={user?.username} logout={logout} />
      </div>
    </div>
  );
};

export default Header;
