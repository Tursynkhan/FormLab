import { useState, useEffect, CSSProperties } from "react";
import { useForm, } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Section from "./Section"
import Field from "./Field"
import { FormDetail, FormSubmitData, FormPages } from "../../types/Form";
import Modal from "../Modal";
import useTitle from "../../hooks/useTitle";
import styles from "./FormBuilder.module.scss"
import useAuth from "../../hooks/useAuth";
import ApiClient from "../../api/axios";

const FormBuilder = (formPage: FormPages) => {

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isResponded, setIsResponded] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { formId } = useParams();
  const navigate = useNavigate();

  const { isEdit, isView } = formPage;
  const { auth } = useAuth();

  const methods = useForm<FormDetail>({ mode: "onChange" });
  const { handleSubmit, reset, watch } = methods;
  const formData = watch();

  useTitle(formData.title);



  const getFormDetails = async () => {
    if (!formId) return;
    try {
      const { data: formDetail } = await ApiClient.getFormById(formId);
      if (isEdit && formDetail.data.creatorId !== auth.user?.id) {
        toast("Form creator only have the edit access", { type: "error" });
        navigate("/form/list");
      } else {
        reset(formDetail.data);
      }
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };
  const getResponseStatus = async () => {
    if (!formId || !auth?.user?.id) return;
    try {
      const { data } = await ApiClient.getResponseStatus(Number(formId), auth.user.id);
      setIsResponded(data.status);
    } catch (error) {
      console.error("Error checking response status:", error);
    }
  };

  useEffect(() => {
    getFormDetails();
    if (isView) getResponseStatus();
  }, [formId]);


  const getFormResponse = (data: FormDetail): FormSubmitData[] => {
    const responses: FormSubmitData[] = [];
    data.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (!field._id) return;
        const formSubmitData: FormSubmitData = {
          fieldId: field._id,
          response: null,
        };
        if (field.other && field.otherReason) {
          if (field.fieldType === "radio" && field.response === "Other") {
            formSubmitData.response = `Other: ${field.otherReason}`;
          } else if (
            field.fieldType === "checkbox" &&
            Array.isArray(field.response) &&
            field.response.includes("Other")
          ) {
            formSubmitData.response = [
              ...field.response.filter((val: string) => val !== "Other"),
              `Other: ${field.otherReason}`,
            ];
          }
        } else if (field.response) {
          formSubmitData.response = field.response;
        }
        responses.push(formSubmitData);
      });
    });
    return responses;
  };

  const submitResponse = async (data: FormDetail) => {
    if (!data._id) return;
    const body = {
      formId: data._id,
      answers: getFormResponse(data),
    };
    try {
      await ApiClient.submitResponse(body);
      clearForm();
      setIsSubmited(true);
      toast.success("Response submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Form submission failed");
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

  // const onInvalid = (error: FieldErrors<FormDetail>, action?: "next" | "back") => {
  //   if (action === "back") {
  //     setActiveSection((section) => section - 1);
  //   } else if (action === "next") {
  //     setActiveSection((section) => section + 1);

  //   }
  // };

  const clearForm = () => {
    reset();
    setActiveSection(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div>
      <div
        className={styles.bg}
        style={{ "--top": isEdit ? "111px" : "0px" } as CSSProperties}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className={styles.container}>
            {formData.sections?.map(
              ({ title, description, fields }, sectionIndex) => {
                if (isView && sectionIndex !== activeSection) return null;
                const sectionHeader =
                  formData.sections.length > 1
                    ? `Section ${sectionIndex + 1} of ${formData.sections.length}`
                    : undefined;
                const isSelected = selectedId === sectionIndex.toString();
                return (
                  <div key={sectionIndex}>
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
                      )}
                    >
                      Next
                    </button>
                  )}
                  {activeSection === formData.sections.length - 1 && (
                    <button
                      className={styles.btn_submit}
                      onClick={handleSubmit(
                        (data) => onSubmit(data, "submit"),
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
    </div>
  )
}

export default FormBuilder
