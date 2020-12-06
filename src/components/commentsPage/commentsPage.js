import React from 'react';

import './commentsPage.scss';

import { BugsService, CommentsService } from 'src/services';
import { CommentsContext, UserContext } from 'src/context';
import { CommentFields } from 'src/helpers/formFields';
import useFormState from 'src/hooks/useFormState';

const CommentsPage = ({ match, history }) => {
  const [bugName, setBugName] = React.useState(null);
  const [, setError] = React.useState(null);

  const { userData } = React.useContext(UserContext);
  const {
    bugComments,
    setCommentsByBugId,
    addNewComment,
  } = React.useContext(CommentsContext);

  const { formFields, handleOnChange } = useFormState({
    bug_id: match.params.bugId,
    comment: '',
  });

  React.useEffect(() => {
    const fetchComments = async () => {
      await setCommentsByBugId(match.params.bugId);
      const bug = await BugsService.getBugById(match.params.bugId);

      if (bugComments && bugComments[0]?.message) {
        setError(bugComments[0].message);
      }

      setBugName(bug.bugName);
    };

    if (!bugComments) {
      fetchComments();
    }

    return () => {
      setBugName('');
      setCommentsByBugId();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    formFields.user_name = userData.userName;
    const res = await CommentsService.postNewComment(formFields);

    if (res.error) {
      console.error(res);
      setError(res.error);
      return;
    }

    await addNewComment(res.newComment);
    formFields.comment = '';
  };

  const openEdit = userData?.dev && (
    <div className="edit-button-holder">
      <button
        className="edit-button"
        onClick={() => {
          history.push(`/dashboard/edit/${match.params.bugId}`);
        }}
      >
        Edit bug
      </button>
    </div>
  );

  const renderComments =
    bugComments &&
    !bugComments[0].message &&
    bugComments.map((comment) => (
      <li className="comment-item" key={comment.id}>
        <div className="auth-and-comm">
          <p className="comment-author">{`Author: ${comment.userName}`}</p>
          <p className="comment-content">
            {`"`}
            {comment.comment}
            {`"`}
          </p>
        </div>
        <div className="comment-time">
          <p>{comment.createdDate}</p>
        </div>
      </li>
    ));

  const commentField = CommentFields.getInputFields(
    formFields,
    handleOnChange,
  );

  return (
    <div className="comments-container">
      <button
        onClick={() => history.goBack()}
        className="go-back-button"
      >
        Back to Bugs
      </button>
      <h3 className="welcome">{bugName}</h3>
      {openEdit}
      <ul className="comments">{renderComments}</ul>
      <form onSubmit={handleSubmit} className="new-comment-form">
        {commentField}
        <footer className="form-footer">
          <button type="submit" className="new-comment-submit">
            Submit
          </button>
        </footer>
      </form>
    </div>
  );
};
export default CommentsPage;
