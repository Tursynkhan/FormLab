import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './Home.module.scss';
import { PageMeta } from '../../types/Form';
import useAuth from "../../hooks/useAuth"
import DropDown from '../../components/Dropdown';
import { googleFormIcon } from '../../utils/index';
import Pagination from '../../components/Pagination';
import { toast } from 'react-toastify';
import { getAllForms } from '../../services/Form';
import { deleteFormById } from '../../services/Form';
import { FormData } from '../../types/Form';

const HomePage: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);

  const [pageMeta, setPageMeta] = useState({} as PageMeta);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const { auth } = useAuth();

  const formRef = useRef<HTMLTableElement>(null);

  const searchParams = new URLSearchParams(location.search);

  const search = searchParams.get("search");
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    getForms();
  }, [search, page]);

  const getForms = async () => {
    try {
      const {
        data: { list, pageMeta },
      } = await getAllForms({ limit: 15, search, page });
      setForms(list);
      setPageMeta(pageMeta);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  const navigateToForm = (formId: string) => {
    navigate(`/form/${formId}/edit`);
  };

  const handleDeleteForm = async (formId: string) => {
    if (!window.confirm("Are you sure to delete this form?")) return;
    const {
      data: { message },
    } = await deleteFormById(formId);
    const form = [...forms];
    toast(message, { type: "success" });
    const index = form.findIndex(({ _id }) => _id === formId);
    form.splice(index, 1);
    setForms(form);
  };
  const handlePageChange = (page: number) => {
    navigate({
      search:
        page !== 0
          ? `?page=${page + 1}${search ? `&search=${search}` : ""}`
          : "",
    });
    if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header search={search} user={user} logout={logout} />
      <div className={styles.container}>

        <div className={styles.form}>
          <table ref={formRef} className={styles.wrapper}>
            <thead>
              <tr>
                <th></th>
                <th>
                  <span>Title</span>
                </th>
                <th>
                  <span>Created at</span>
                </th>
                <th>
                  <span>Last updated at</span>
                </th>
                <th>
                  <span>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {forms.length === 0 ? (
                <tr aria-label="empty">
                  <td colSpan={5} align="center">
                    No Records Found
                  </td>
                </tr>
              ) : (
                forms.map(({ title, _id, createdAt, updatedAt }) => {
                  return (
                    <div key={_id}>
                      <tr onClick={() => navigateToForm(_id)}>
                        <td>{googleFormIcon}</td>
                        <td>
                          <span>{title}</span>
                        </td>
                        <td>
                          <span>
                            {moment
                              .tz(createdAt, "Asia/Kolkata")
                              .format("MMM D, YYYY")}
                          </span>
                        </td>
                        <td>
                          <span>
                            {moment.tz(updatedAt, "Asia/Kolkata").fromNow()}
                          </span>
                        </td>
                        <td>
                          <div>
                            <i
                              id={`dropdown-${_id}`}
                              className="bx-dots-vertical-rounded"
                              onClick={(e) => e.stopPropagation()}
                            ></i>
                          </div>
                        </td>
                      </tr>
                      <DropDown
                        selector={`#dropdown-${_id}`}
                        placement="bottom"
                        className={styles.dropdown}
                      >
                        <DropDown.Item onClick={() => handleDeleteForm(_id)}>
                          <i className="bx-trash"></i>
                          <span>Remove</span>
                        </DropDown.Item>
                        <DropDown.Item onClick={() => navigateToForm(_id)}>
                          <i className="bx-link-external"></i>
                          <span>Open in new tab</span>
                        </DropDown.Item>
                      </DropDown>
                    </div>
                  );
                })
              )}
            </tbody>
          </table>
          {pageMeta.totalPages > 1 && (
            <Pagination pageMeta={pageMeta} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
