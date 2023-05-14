import React, { useState, useEffect, forwardRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createEntity as createCommentEntity } from 'app/entities/comment/comment.reducer';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { format } from 'date-fns';

import { IPost } from 'app/shared/model/post.model';
import { getEntities } from './post.reducer';
import FlipMove from 'react-flip-move';
import PostUpdate from './post-update';

export const Post = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const commentList = useAppSelector(state => state.comment.entities);
  const history = useNavigate();

  const postList = useAppSelector(state => state.post.entities);
  const loading = useAppSelector(state => state.post.loading);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const currentUser = useAppSelector(state => state.authentication.account);
  const postEntity = useAppSelector(state => state.post.entity);

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  const handleComment = (post: IPost) => {
    const comment = {
      text: commentText,
      createdAt: new Date().toISOString(),
      user: currentUser,
      post: post,
    };

    dispatch(createCommentEntity(comment));
    navigate('/post');
  };

  return (
    <div>
      {/* Heading */}
      <h1 id="post-heading" data-cy="PostHeading">
        <div id="header-jawn">
          <img height="25" width="25" src="content/images/butterflySilho.png" alt="Logo" />
          Flutter Feed
          <img height="25" width="25" src="content/images/butterflySilhoFlipped.png" alt="Logo" />
        </div>
        <div className="d-flex justify-content-center">
          {/* Create New Post Button */}
          <div className="container">
            <div className="post-list-row">
              <div className="card">
                <PostUpdate></PostUpdate>
                {/* <Link to="/post/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
                      <FontAwesomeIcon icon="plus" />
                      &nbsp;New Post
                    </Link> */}
              </div>
            </div>
          </div>
        </div>
      </h1>

      {
        <div className="container">
          {postList && postList.length > 0 ? (
            <div className="post-list">
              <FlipMove>
                {/* Displays each Post */}
                {[...postList].reverse().map((post, i) => (
                  <div key={`entity-${i}`} className="post-list-row" data-cy="entityTable">
                    <div className="card">
                      {/* Username and Post Time */}
                      <div className="post-list-cell post-header" id="post-header">
                        <h4>{post.user ? post.user.login : ''}</h4>
                        <span className="post-time">
                          {post.createdAt ? <TextFormat type="date" value={post.createdAt} format={APP_DATE_FORMAT} /> : null}
                        </span>
                      </div>

                      {/* Content of post */}
                      <div className="post-list-cell post-content" id="post-content">
                        <p>{post.text}</p>
                      </div>

                      {/* Hashtags */}
                      <div className="post-list-cell " id="post-hashtag">
                        {postEntity.hashtags
                          ? postEntity.hashtags.map((val, j) => (
                              <span key={j}>
                                <Link to={`/hashtag/${val.id}`}>{val.name}</Link>
                                {j === postEntity.hashtags.length - 1 ? '' : ', '}
                              </span>
                            ))
                          : '#Flutter'}
                      </div>
                      <div>
                        {/* Edit Button */}
                        {post.user &&
                          post.user.login === currentUser.login && ( // Check if post belongs to the current user
                            <Button
                              tag={Link}
                              to={`/post/${post.id}/edit`}
                              color="primary"
                              size="sm"
                              data-cy="entityEditButton"
                              id="edit-button"
                            >
                              <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                            </Button>
                          )}
                        {/* Delete Button */}
                        {post.user &&
                          post.user.login === currentUser.login && ( // Check if post belongs to the current user
                            <Button
                              tag={Link}
                              to={`/post/${post.id}/delete`}
                              color="primary"
                              id="delete-button"
                              size="sm"
                              data-cy="entityDeleteButton"
                            >
                              <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                            </Button>
                          )}
                      </div>
                    </div>
                    {/* ADD COMMENTS TO POSTS HERE */}
                    {/* Input field for comment text */}

                    <div className="comment-container">
                      <div id="list-of-comments">
                        {commentList && commentList.length > 0 ? (
                          <div className="card-comment">
                            <div id="success" className="alert alert-warning comment-box">
                              <div id="comment-msg">Make a comment!</div>
                              <div className="comment-input-container">
                                <input type="text" id="comment-input" value={commentText} onChange={e => setCommentText(e.target.value)} />

                                <Button onClick={() => handleComment(post)} size="sm" data-cy="entityDeleteButton" id="comment-button">
                                  <FontAwesomeIcon icon="plus" /> <span className="d-none d-md-inline">Comment</span>
                                </Button>
                              </div>
                            </div>
                            <div id="individual-comments">
                              {commentList
                                .filter(comment => comment.post && comment.post.id === post.id)
                                .map((comment, i) => (
                                  <div key={`entity-${i}`} data-cy="entityTable" className="comment">
                                    <div className="card">
                                      <div className="post-list-cell post-header" id="post-header">
                                        <div className="comment-value">{comment.user ? comment.user.login : ''}</div>
                                      </div>
                                      <div className="comment-field">
                                        <div className="post-time">
                                          {comment.createdAt ? (
                                            <TextFormat type="date" value={comment.createdAt} format={APP_DATE_FORMAT} />
                                          ) : null}
                                        </div>
                                      </div>
                                      <div className="post-list-cell post-content" id="post-content">
                                        <div className="comment-value">{comment.text}</div>
                                      </div>

                                      {/* {post.user &&
                          post.user.login === currentUser.login && ( // Check if post belongs to the current user
                            <Button
                              tag={Link}
                              to={`/post/${post.id}/edit`}
                              color="primary"
                              size="sm"
                              data-cy="entityEditButton"
                              id="edit-button"
                            >
                              <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                            </Button>
                          )} */}

                                      <div className="comment-field">
                                        <div className="comment-label"></div>
                                        <div className="comment-value text-end">
                                          <div className="btn-group flex-btn-group-container">
                                            {comment.user && comment.user.login === currentUser.login && (
                                              <Button
                                                tag={Link}
                                                to={`/comment/${comment.id}/edit`}
                                                size="sm"
                                                data-cy="entityEditButton"
                                                id="edit-button"
                                              >
                                                <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                                              </Button>
                                            )}
                                            {comment.user && comment.user.login === currentUser.login && (
                                              <Button
                                                tag={Link}
                                                to={`/comment/${comment.id}/delete`}
                                                color="black"
                                                size="sm"
                                                data-cy="entityDeleteButton"
                                                id="delete-button"
                                              >
                                                <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          !loading && (
                            <div id="success" className="alert alert-warning comment-box">
                              <div id="comment-msg">Be the first to make a comment!</div>
                              <div className="comment-input-container">
                                <input type="text" id="comment-input" value={commentText} onChange={e => setCommentText(e.target.value)} />

                                <Button onClick={() => handleComment(post)} size="sm" data-cy="entityDeleteButton" id="comment-button">
                                  <FontAwesomeIcon icon="plus" /> <span className="d-none d-md-inline">Comment</span>
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </FlipMove>
            </div>
          ) : (
            !loading && <div className="alert alert-warning">No Posts found</div>
          )}
        </div>
      }
    </div>
  );
};

export default Post;
