import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import './styles.scss';

interface InputOtpProps {
  setOtp: (otp: string) => void;
}

const InputOtp: React.FC<InputOtpProps> = ({ setOtp }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    // set value form parent
    setOtp(value);
  }, [value]);
  
  return (
    <OtpInput
      value={value}
      onChange={setValue}
      numInputs={6}
      placeholder={'------'}
      shouldAutoFocus
      inputType='number'
      renderInput={(props) => <input {...props} />}
      inputStyle={'input-otp'}
      containerStyle={'input-otp-container'}
    />
  );
};

export default InputOtp;
