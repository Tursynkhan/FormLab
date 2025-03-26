import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Section from "./Section"
import Field from "./Field"
import { FormDetail } from "../../types/Form";
import { FormPages } from "../../types/Form"
import useTitle from "../../hooks/useTitle";
import styles from "./FormBuilder.module.scss"

const FormBuilder = (formPage: FormPages) => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isResponded, setIsResponded] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { formId } = useParams();
  const navigate = useNavigate();

  const { isEdit, isView } = formPage;

  const methods = useForm<FormDetail>({ mode: "onChange" });
  const { handleSubmit, reset, watch, setValue } = methods;
  const formData = watch();

  useTitle(formData.title);

  
  useEffect(() => {
    getFormDetails();
    if (isView) getResponseStatus();
  }, [formId]);

  const getResponseStatus = async () => {
    if (!formId) return;
    const {
      data: { status },
    } = await checkResponseStatus(formId);
    setIsResponded(status);
  };

  const getFormDetails = async () => {
    if (!formId) return;
    try {
      const { data: formDetail } = await getFormById(formId);
      if (isEdit && formDetail.creatorId !== user?._id) {
        toast("Form creator only have the edit access", { type: "error" });
        navigate("/form/list");
      } else {
        reset(formDetail);
      }
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  
  const onSubmit = (data: FormDetail, action: "next" | "back" | "submit") => {
    if (action === "next") {
      setActiveSection((section) => section + 1);
    } else if (action === "back") {
      setActiveSection((section) => section - 1);
    } else {
      submitResponse(data);
    }
  };

  const submitResponse = async (data: FormDetail) => {
    if (!data._id) return;
    const body = {
      responses: getFormResponse(data),
      formId: data._id,
    };
    await sendResponse(body);
    clearForm();
    setIsSubmited(true);
  };

  const getFormResponse = (data: FormDetail): FormSubmitData[] => {
    const responses = data.sections.reduce((acc: FormSubmitData[], section) => {
      section.fields.forEach(({ response, fieldType, other, otherReason, _id }) => {
        if (!_id) return;
        const formSubmitData: FormSubmitData = {
          fieldId: _id,
          response: null,
        };
        if (other && otherReason) {
          if (fieldType === "radio" && response === "Other") {
            formSubmitData.response = `Other : ${otherReason}`;
          } else if (
            fieldType === "checkbox" &&
            Array.isArray(response) &&
            response.includes("Other")
          ) {
            formSubmitData.response = [
              ...response.filter((val: string) => val !== "Other"),
              `Other : ${otherReason}`,
            ];
          }
        } else if (response) {
          formSubmitData.response = response;
        }
        acc.push(formSubmitData);
      });
      return acc;
    }, [] as FormSubmitData[]);
    return responses;
  };

  const onInvalid = (errors: any, action?: "next" | "back") => {
    if (action === "back") {
      setActiveSection((section) => section - 1);
    } else if (action === "next") {
      if (isEmpty(errors?.sections?.[activeSection])) {
        setActiveSection((section) => section + 1);
      }
    }
  };

  const clearForm = () => {
    reset();
    setActiveSection(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTitle = (title: string) => {
    if (!formId) return;
    setValue("title", title);
  };
  return (
    <Fragment>
      <div
        className={styles.bg}
        style={{ "--top": isEdit ? "111px" : "0px" } as CSSProperties}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className={styles.container}>
        {formData.sections?.map(
                    ({ _id, title, description, fields }, sectionIndex) => {
                      if (isView && sectionIndex !== activeSection) return null;
                      const sectionHeader =
                        formData.sections.length > 1
                          ? `Section ${sectionIndex + 1} of ${formData.sections.length}`
                          : undefined;
                      const isSelected = selectedId === sectionIndex.toString();
                return (
                  <div  key={sectionIndex}>
                    <Section
                      title={title}
                      selectedId={selectedId}
                      description={description}
                      sectionIndex={sectionIndex}
                      sectionHeader={sectionHeader}
                      formPage={formPage}
                      isSelected={isSelected}
                      onClick={() =>
                        setSelectedId(sectionIndex.toString())
                      }
                    />
                    <div
                      className={styles.wrapper}>
                      {fields.map((field, fieldIndex) => {
                            const fieldId = `${sectionIndex}${fieldIndex}`;
                            const isFieldSelected = selectedId === fieldId;
                            return (
                              <Field
                                key={fieldId}
                                field={field}
                                fieldId={fieldId}
                                tabIndex={-1}
                                sectionIndex={sectionIndex}
                                fieldIndex={fieldIndex}
                                formPage={formPage}
                                isSelected={isFieldSelected}
                                register={register}
                                onClick={() => setSelectedId(fieldId)}
                              />
                            );
                          })}
                    </div>
                  </div>
                );
              }
            )}
            {isView && (
              <div className={styles.cta}>
                <div>
                  {activeSection > 0 && (
                    <button
                      className={styles.btn_navigate}
                      onClick={handleSubmit(
                        (data) => onSubmit(data, "back"),
                        (errors) => onInvalid(errors, "back")
                      )}
                    >
                      Back
                    </button>
                  )}
                  {activeSection < formData.sections.length - 1 && (
                    <button
                      className={styles.btn_navigate}
                      onClick={handleSubmit(
                        (data) => onSubmit(data, "next"),
                        (errors) => onInvalid(errors, "next")
                      )}
                    >
                      Next
                    </button>
                  )}
                  {activeSection === sections.length - 1 && (
                    <button
                      className={styles.btn_submit}
                      onClick={handleSubmit(
                        (data) => onSubmit(data, "submit"),
                        onInvalid
                      )}
                    >
                      Submit
                    </button>
                  )}
                </div>
                <button className={styles.btn_clear} onClick={clearForm}>
                  Clear Form
                </button>
              </div>
            )}
            <div className={styles.footer}>
              <span>Google Form</span>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={isSubmited || isResponded}>
        <div className={styles.popup}>
          <h2>Thank You!</h2>
          {isResponded && <span>You have already submitted the form</span>}
          {isSubmited && (
            <span>You response have been saved successfully</span>
          )}
        </div>
      </Modal>
    </Fragment>
  )
}

export default FormBuilder
