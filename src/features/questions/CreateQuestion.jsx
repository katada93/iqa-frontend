import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Paper } from '../../components/ui/Paper';
import { Tag } from '../../components/ui/Tag';
import { Typography } from '../../components/ui/Typography';
import { fetchProfile, selectProfile } from '../profile/profileSlice';
import {
  addTag,
  removeTag,
  resetTagStatus,
  selectTags,
  selectTagsError,
} from '../tags/tagsSlice';
import {
  addQuestion,
  resetStatus,
  selectQuestionsSuccess,
  selectQuestionsError,
  selectQuestionsLoading,
  resetSuccess,
} from './questionsSlice';
import { Alert } from '../../components/ui/Alert';

const placeholderForTextArea =
  'Расскажи как был задан вопрос, какой ответ ты дал, оказался ли он верным и т.д. Любые сведения, которые могут помочь другим соискателям..';

const StyledQuestionWrapper = styled.div`
  & .question-title,
  .comment-title,
  .tag-title {
    margin-bottom: 8px;
  }

  & .additional {
    margin: 20px 0;
  }

  & .buttons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    & button {
      margin-right: 27px;
    }
  }

  & .cancel {
    text-decoration: none;
  }

  & .new-tag {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    max-width: 85px;
    font-weight: 500;
    padding: 6px 8px;
    color: #606266;
    font-size: 12px;
    line-height: 14px;
    cursor: pointer;

    & svg {
      margin-right: 11px;
    }
    & span {
      white-space: nowrap;
      padding: 0;
    }

    & input {
      font-size: 12px;
      line-height: 14px;
      padding: 0;
      max-width: 45px;
      border: none;
      background-color: transparent;
      &:focus {
        outline: none;
      }
    }
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 130px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  outline: none;
`;

const StyledTagWrapper = styled.div`
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const PlusIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 2V10" stroke="#606266" strokeLinejoin="round" />
    <path d="M2 6H10" stroke="#606266" strokeLinejoin="round" />
  </svg>
);

const CreateQuestion = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);
  const tags = useSelector(selectTags);
  const tagsError = useSelector(selectTagsError);
  const questionsError = useSelector(selectQuestionsError);
  const questionsSuccess = useSelector(selectQuestionsSuccess);
  const questionsLoading = useSelector(selectQuestionsLoading);

  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [editMode, setEditMode] = useState(false);

  const callbackRef = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (!tags.some((tag) => tag.name === tagValue)) {
        dispatch(addTag({ name: tagValue }));
      }
      setTagValue('');
      setEditMode(false);
    }
  };

  const create = () => {
    dispatch(
      addQuestion({
        question,
        comment,
        tags,
        userId: profile._id,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <StyledQuestionWrapper className="container">
      {questionsError && (
        <Alert onClose={() => dispatch(resetStatus())} color="danger">
          {questionsError}
        </Alert>
      )}
      {tagsError && (
        <Alert onClose={() => dispatch(resetTagStatus())} color="danger">
          {tagsError}
        </Alert>
      )}
      {questionsSuccess && (
        <Alert onClose={() => dispatch(resetSuccess())}>Вопрос добавлен!</Alert>
      )}
      <Paper>
        <div className="question-title">Как звучит вопрос?</div>
        <Input
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          placeholder="Формулировка вопроса..."
        />
        <div className="additional">
          <div className="comment-title">Дополнительный комментарий</div>
          <StyledTextArea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder={placeholderForTextArea}
          />
          <div className="tag-title">Теги</div>
          <StyledTagWrapper>
            {tags.map((tag) => (
              <Tag key={tag._id} onRemove={() => dispatch(removeTag(tag._id))}>
                {tag.name}
              </Tag>
            ))}
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                type="button"
                className="new-tag"
              >
                <PlusIcon />
                <span>New tag</span>
              </button>
            )}
            {editMode && (
              <button
                onBlur={() => setEditMode(false)}
                type="button"
                className="new-tag"
              >
                <PlusIcon />
                <input
                  value={tagValue}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setTagValue(e.target.value)}
                  ref={callbackRef}
                />
              </button>
            )}
          </StyledTagWrapper>
        </div>
        <div className="buttons">
          <Button loading={questionsLoading} onClick={create} color="primary">
            Добавить
          </Button>
          <Link to="/" className="cancel">
            <Typography color="gray">Отмена</Typography>
          </Link>
        </div>
      </Paper>
    </StyledQuestionWrapper>
  );
};

export default CreateQuestion;
