import React from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css';
import { FormProvider } from './Components/Contexts/FormContext';
import ThirdPLLogin from './Components/ThirdPLLogin';
import ThirdPLSignin from './Components/ThirdPLSignin';
import AddressForm from './Components/Map/dynamicMap';

function App() {
  return (
    <>
      <FormProvider>
        <Routes>
          <Route path='/' element={<ThirdPLLogin />}/>
        </Routes>

        <Routes>
          <Route path='/route' element={<AddressForm />}/>
        </Routes>

      </FormProvider>
    </>
  );
}

export default App;
