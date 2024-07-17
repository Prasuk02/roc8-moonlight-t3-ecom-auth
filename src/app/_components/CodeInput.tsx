import React, { useEffect, useRef, useState } from 'react'

type CodeInputProps = {
  length: number;
  getInputVerificationCode: (code: string) => void;
}

const CodeInput = ({ length, getInputVerificationCode }: CodeInputProps ) => {

  const [code, setCode] = useState(new Array(length).fill(''));
  const inputRef = useRef([]);

  useEffect(() => {
    if (inputRef.current.length && inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, [])

  const handleDigitInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.substring(value.length - 1);

    if (value.charCodeAt(0) < 48 || value.charCodeAt(0) > 57) {
      return;
    }

    const codeCopy = [...code];
    codeCopy[index] = value;
    setCode(codeCopy);
    const combinedCode = codeCopy.join("");

    if (index < inputRef.current.length - 1 && inputRef.current[index].value && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }

    getInputVerificationCode(combinedCode);
  };

  const handleKeyEvent = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputRef.current[index - 1]) {
      inputRef.current[index - 1].focus();
    }
  }

  const handleInputClick = (index: number) => {
    if (inputRef.current[index].value) {
      inputRef.current[index].setSelectionRange(1, 1);
    }
  }

  return (
    <>
      <label className='font-medium text-sm'>Code</label>
      <div className='flex items-center justify-between'>
        { code.map((value, index) => {
          return <input
            key={index}
            type="text"
            value={value}
            ref={ (input) => inputRef.current[index] = input }
            onClick={ () => handleInputClick(index) }
            onChange={ () => handleDigitInput(index, event) }
            onKeyDown={ () => handleKeyEvent(index, event) }
            className="mt-1 block text-center w-10 h-10 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-offset-black sm:text-sm sm:leading-6"
          />
        })}
      </div>
    </>
  )
}

export default CodeInput;