import React, { createContext, useContext, useEffect, useState } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [formValues, setFormValues] = useState({
   
  });

  const updateFormValue = (name, value) => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [name]: value
    }));
  };

  return (
    <FormContext.Provider value={{ formValues, updateFormValue }}>
      {children}
    </FormContext.Provider>
  );
};
