import React from 'react';
import { ValidatedField } from 'react-jhipster';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Row, Col, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ username, password, rememberMe }) => {
    props.handleLogin(username, password, rememberMe);
  };

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  const { loginError, handleClose } = props;

  const handleLoginSubmit = e => {
    handleSubmit(login)(e);
  };

  return (
    <Modal isOpen={props.showModal} toggle={handleClose} backdrop="static" id="login-page" autoFocus={false}>
      <Form onSubmit={handleLoginSubmit}>
        <ModalHeader id="login-title" data-cy="loginTitle" toggle={handleClose}>
        <img id="butterfly" height="50" width="50" src="https://i.pinimg.com/originals/66/b0/02/66b002f6f5022553a6cf52d8d01241df.gif" alt="Logo" />

          Sign in
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              {loginError ? (
                <Alert color="danger" data-cy="loginError">
                  <strong>Failed to sign in!</strong> Please check your credentials and try again.
                </Alert>
              ) : null}
            </Col>
            <Col md="12">
              <ValidatedField
                name="username"
                label="Username"
                placeholder="Your username"
                required
                autoFocus
                data-cy="username"
                validate={{ required: 'Username cannot be empty!' }}
                register={register}
                error={errors.username}
                isTouched={touchedFields.username}
              />
              <ValidatedField
                name="password"
                type="password"
                label="Password"
                placeholder="Your password"
                required
                data-cy="password"
                validate={{ required: 'Password cannot be empty!' }}
                register={register}
                error={errors.password}
                isTouched={touchedFields.password}
              />
              <ValidatedField name="rememberMe" type="checkbox" check label="Remember me" value={true} register={register} />
            </Col>
          </Row>
          <div className="mt-1" id="sign-in-one">
            &nbsp;
          </div>
          <Alert color="warning" id="success">
            <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector" id="success-text">
              Did you forget your password?
            </Link>
          </Alert>
          <Alert color="warning" id="success">
            <span>You don&apos;t have an account yet?</span>{' '}
            <Link to="/account/register" id="success-text">
              Register a new account
            </Link>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose} tabIndex={1}>
            Cancel
          </Button>{' '}
          <Button color="primary" type="submit" data-cy="submit">
            Sign in
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default LoginModal;
