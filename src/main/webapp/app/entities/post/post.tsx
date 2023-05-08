import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IPost } from 'app/shared/model/post.model';
import { getEntities } from './post.reducer';

export const Post = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const commentList = useAppSelector(state => state.comment.entities);

  const postList = useAppSelector(state => state.post.entities);
  const loading = useAppSelector(state => state.post.loading);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const currentUser = useAppSelector(state => state.authentication.account);
  const postEntity = useAppSelector(state => state.post.entity);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
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
        {/* Buttons */}
        <div className="d-flex justify-content-center">
          {/* Refresh List Button */}
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading} id="refresh-list">
            <FontAwesomeIcon icon="sync" spin={loading} />
            Refresh page
          </Button>

          {/* Create New Post Button */}
          <Link to="/post/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;New Post
          </Link>
        </div>
      </h1>

      {
        <div className="container">
          {postList && postList.length > 0 ? (
            <div className="post-list">
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
                      {post.hashtags
                        ? post.hashtags.map((val, j) => (
                            <span key={j}>
                              <Link to={`/hashtag/${val.id}`}>{val.name}</Link>
                              {j === post.hashtags.length - 1 ? '' : ', '}
                            </span>
                          ))
                        : '#Flutter'}

                      {/* Comment Button */}
                      <Button tag={Link} to={`/comment/new`} id="comment-button" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="plus" /> <span className="d-none d-md-inline">Comment</span>
                      </Button>
                      {/* Edit Button */}
                      <Button tag={Link} to={`/post/${post.id}/edit`} color="primary" size="sm" data-cy="entityEditButton" id="edit-button">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      {/* Delete Button */}
                      {/* {post.user && post.user.login === useAppSelector(state => state.authentication.account.login) && */}
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
                    </div>

                    {/* Shows specific hashtag under every post, temporarily */}
                    {/* <div className="post-list-cell">
                    {postEntity.hashtags
                      ? postEntity.hashtags.map((val, i) => (
                        <span key={val.id}>
                          <a>{val.name}</a>
                          {postEntity.hashtags && i === postEntity.hashtags.length - 1 ? '' : ', '}
                        </span>
                         ))
                        : null}
                    </div> */}
                  </div>
                  {/* ADD COMMENTS TO POSTS HERE */}
                  <div className="comment-container">
                    <div>
                      {commentList && commentList.length > 0 ? (
                        <div className="card">
                          {commentList
                            .filter(comment => comment.post && comment.post.id === post.id)
                            .map((comment, i) => (
                              <div key={`entity-${i}`} data-cy="entityTable" className="comment">
                                <div className="comment-field">
                                  <div className="comment-label">Text</div>
                                  <div className="comment-value">{comment.text}</div>
                                </div>
                                <div className="comment-field">
                                  <div className="comment-label">Created At</div>
                                  <div className="comment-value">
                                    {comment.createdAt ? (
                                      <TextFormat type="date" value={comment.createdAt} format={APP_DATE_FORMAT} />
                                    ) : null}
                                  </div>
                                </div>
                                <div className="comment-field">
                                  <div className="comment-label">User</div>
                                  <div className="comment-value">{comment.user ? comment.user.login : ''}</div>
                                </div>
                                <div className="comment-field">
                                  <div className="comment-label">Post</div>
                                  <div className="comment-value">
                                    {comment.post ? <Link to={`/post/${comment.post.id}`}>{comment.post.text}</Link> : ''}
                                  </div>
                                </div>
                                <div className="comment-field">
                                  <div className="comment-label"></div>
                                  <div className="comment-value text-end">
                                    <div className="btn-group flex-btn-group-container">
                                      <Button
                                        tag={Link}
                                        to={`/comment/${comment.id}/edit`}
                                        color="primary"
                                        size="sm"
                                        data-cy="entityEditButton"
                                      >
                                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                                      </Button>
                                      <Button
                                        tag={Link}
                                        to={`/comment/${comment.id}/delete`}
                                        color="danger"
                                        size="sm"
                                        data-cy="entityDeleteButton"
                                      >
                                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        !loading && (
                          <div id="success" className="alert alert-warning">
                            No Comments found
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && <div className="alert alert-warning">No Posts found</div>
          )}
        </div>
      }

      <div className="wrapper">
        <div className="sidebar">
          <ul>
            <div>
              <FontAwesomeIcon icon="home" />
              <Link id="home-button" to="/home" rel="noopener noreferrer">
                {' '}
                Home
              </Link>
            </div>
            <div>
              <img height="23" width="23" src="content/images/butterflySilho.png" alt="Logo" />
              <Link id="profile-button" to="/profile" rel="noopener noreferrer">
                {' '}
                Profile
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
