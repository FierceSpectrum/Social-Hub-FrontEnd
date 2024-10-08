import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

import { useNavigate, useLocation } from "react-router-dom";
import "./Posts.scss";
import imgedit from "../../Accets/Lapiz.png";

const Posts = ({ posts, loading, setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditable = !location.pathname.toLowerCase().includes("/post");

  const handleEditClick = (postId, event) => {
    event.stopPropagation();
    navigate(`/Post/${postId}/Edit`);
  };

  const handleSocialNetworkClick = (tag, event) => {
    event.stopPropagation();
    setSearchTerm(tag);
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  function formatPostDate(dateString) {
    const options = {
      weekday: "long", // Day of the week
      year: "numeric", // Full year
      month: "long", // Full month name
      day: "numeric", // Day of the month
      hour: "numeric", // Hour
      minute: "numeric", // Minute
    };

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", options);
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id} className="post" data-id={post.id}>
          <div className="card">
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
            <div className="post-info">
              <ul className="social-networks">
                {post.socialNetworks && post.socialNetworks.length > 0 ? (
                  post.socialNetworks.map((socialNetwork, index) => (
                    <li key={index}>
                      <span
                        onClick={(event) =>
                          handleSocialNetworkClick(socialNetwork.name, event)
                        }
                      >
                        {socialNetwork.name}
                      </span>
                      {socialNetwork.state === "Failed" && (
                        <span className="social-network-error">
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            data-tooltip-id={`tooltip-${index}`}
                          />
                          <Tooltip
                            id={`tooltip-${index}`}
                            content={`This post failed to send to ${socialNetwork.name}`}
                          />
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No hay socialNetwork</li>
                )}
              </ul>
              <div
                className="post-status"
                onClick={(event) => handleSocialNetworkClick(post.state, event)}
              >
                <span className="status">{post.state}</span>
              </div>
              <div
                className="post-status"
                onClick={(event) =>
                  handleSocialNetworkClick(post.postingdate, event)
                }
              >
                <span className="status">
                  {formatPostDate(post.postingdate)}
                </span>
              </div>
              {post.state !== "Posted" && isEditable && (
                <div
                  className="edit-post button"
                  onClick={(event) => handleEditClick(post.id, event)}
                >
                  <img className="edit-icon" src={imgedit} alt="Edit Post" />
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Posts;
