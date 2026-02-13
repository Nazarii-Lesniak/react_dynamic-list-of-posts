import classNames from 'classnames';
import React, { useState } from 'react';
import { CommentData } from '../types/Comment';

interface Props {
  onSubmitForm: (data: CommentData) => Promise<void>;
}

export const NewCommentForm: React.FC<Props> = ({ onSubmitForm }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [hasError, setHasError] = useState({
    name: false,
    email: false,
    body: false,
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedBody = body.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(normalizedEmail);

    if (!normalizedName || !isEmailValid || !normalizedBody) {
      setHasError({
        name: !normalizedName,
        email: !isEmailValid,
        body: !normalizedBody,
      });

      return;
    }

    setIsSubmitting(true);

    onSubmitForm({
      name: normalizedName,
      email: normalizedEmail,
      body: normalizedBody,
    })
      .then(() => {
        setBody('');
        setHasError({
          name: false,
          email: false,
          body: false,
        });
      })
      .catch(() => {})
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form
      data-cy="NewCommentForm"
      onSubmit={event => {
        event.preventDefault();

        handleFormSubmit(event);
      }}
      onReset={() => {
        setName('');
        setEmail('');
        setBody('');
        setHasError({
          name: false,
          email: false,
          body: false,
        });
      }}
    >
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': hasError.name })}
            value={name}
            onChange={event => {
              setName(event.target.value);
              setHasError({ ...hasError, name: false });
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {hasError.name && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {hasError.name && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': hasError.email })}
            value={email}
            onChange={event => {
              setEmail(event.target.value);
              setHasError({ ...hasError, email: false });
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {hasError.email && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {hasError.email && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': hasError.body })}
            value={body}
            onChange={event => {
              setBody(event.target.value);
              setHasError({ ...hasError, body: false });
            }}
          />
        </div>

        {hasError.body && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isSubmitting,
            })}
            disabled={isSubmitting}
          >
            Add
          </button>
        </div>

        <div className="control">
          <button type="reset" className="button is-link is-light">
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
