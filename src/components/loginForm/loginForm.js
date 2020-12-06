import React from 'react';
import { Link } from 'react-router-dom';

import './loginForm.scss';

import { LoginFields } from 'src/helpers/formFields';
import useFormState from 'src/hooks/useFormState';
import { UserContext } from 'src/context';
import { AuthService, TokenService } from 'src/services';

const LoginForm = ({ onLoginSuccess }) => {
  const [error, setError] = React.useState(null);
  const Context = React.useContext(UserContext);

  const { formFields, handleOnChange } = useFormState({
    user_name: '',
    password: '',
  });

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const res = await AuthService.postLogin(formFields);

    if (res.error) {
      console.error(res);
      setError(res.error);
      return;
    }

    TokenService.saveAuthToken(res.authToken);
    Context.processLogin();
    onLoginSuccess();
  };

  const renderError = !error ? null : (
    <p role="alert" className="error-class">
      Oh no! {error}
    </p>
  );

  const inputFields = LoginFields.getInputFields(
    formFields,
    handleOnChange,
  );

  return (
    <>
      {renderError}
      <form className="login-form" onSubmit={handleSubmit}>
        {inputFields}
        <footer>
          <button type="submit" className="submit-button">
            LOGIN
          </button>
          <Link to="/register" className="link-to-register">
            Don&apos;t have an account?
          </Link>
        </footer>
      </form>
    </>
  );
};

export default LoginForm;
