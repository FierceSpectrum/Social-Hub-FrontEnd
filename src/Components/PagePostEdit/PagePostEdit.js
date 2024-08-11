import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import "./PagePostEdit.scss";

function PagePostEdit() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [availableSocialNetworks, setAvailableSocialNetworks] = useState([]);
  const [selectedNetworks, setSelectedNetworks] = useState([]);

  useEffect(() => {
    // Fetch linked social media
    const fetchLinkedSocialMedia = async () => {
      try {
        const url = "http://socialhub.codementoria.fsg/api/social-media/linked";
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch social media");

        const linkedSocialMedia = await response.json();
        const networks = Object.keys(linkedSocialMedia)
          .filter((key) => linkedSocialMedia[key])
          .map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
          }));

        setAvailableSocialNetworks(networks);
      } catch (error) {
        setError(error.message);
      }
    };

    // Fetch post data and verify state
    const fetchPost = async () => {
      try {
        const url = `http://socialhub.codementoria.fsg/api/posts/ById?id=${postId}`;
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();

        // Verificar si el post ya fue enviado
        if (data.state === "Posted") {
          alert("This post has already been sent and cannot be edited.");
          navigate("/Home");
          return;
        }

        setPost(data);
        setFormData(data);
        setSelectedNetworks(data.socialNetworks || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    fetchLinkedSocialMedia();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "postingdate") {
      const selectedDate = new Date(value);
      const now = new Date();

      selectedDate.setSeconds(0, 0);
      now.setSeconds(0, 0);

      if (selectedDate < now) {
        alert("The selected date and time cannot be in the past.");
        return;
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setIsModified(true);
  };

  const addNetwork = (network) => {
    if (!selectedNetworks.some((item) => item.name === network)) {
      setSelectedNetworks((prevNetworks) => [
        ...prevNetworks,
        { name: network, state: "Pending" },
      ]);
      setIsModified(true);
    }
  };

  const removeNetwork = (network) => {
    setSelectedNetworks((prevNetworks) =>
      prevNetworks.filter((item) => item.name !== network)
    );
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar el estado del post antes de enviar
    try {
      const url = `http://socialhub.codementoria.fsg/api/posts/ById?id=${postId}`;
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch post");

      const data = await response.json();

      // Si el estado es "Posted", evitar la actualización
      if (data.state === "Posted") {
        alert("This post has already been sent and cannot be edited.");
        navigate("/Home");
        return;
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    if (isModified) {
      if (selectedNetworks.length === 0) {
        alert("Please select at least one social network.");
        return;
      }

      // Update formData based on post state
      if (formData.state === "Sent") {
        formData.state = "Posted";
      } else if (formData.state === "Pending") {
        formData.state = "Queue";
        delete formData.postingdate; // Remove date for "Queue" state
      } else if (formData.state === "Scheduled") {
        const now = new Date();
        const postingDate = new Date(formData.postingdate);

        // Update state to "Posted" if the date is the current date
        if (
          postingDate.toDateString() === now.toDateString() &&
          postingDate.getHours() === now.getHours() &&
          postingDate.getMinutes() === now.getMinutes()
        ) {
          formData.state = "Posted";
          delete formData.postingdate; // Optionally remove date
        }
      }

      // Format date to "YYYY-MM-DDTHH:MM" using local time
      if (formData.postingdate) {
        const date = new Date(formData.postingdate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        formData.postingdate = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      formData.socialNetworks = selectedNetworks;

      try {
        const response = await fetch(
          `http://socialhub.codementoria.fsg/api/posts?id=${postId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) throw new Error("Failed to update post");

        alert("Post updated successfully.");
        navigate("/Home");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://socialhub.codementoria.fsg/api/posts?id=${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete post");

      alert("Post deleted successfully.");
      navigate("/Home");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="pagepost">Loading...</div>;
  }

  if (error) {
    return <div className="pagepost">Error: {error}</div>;
  }

  if (!post) {
    return <div className="pagepost">No post found.</div>;
  }

  return (
    <>
      <Header />
      <div className="pagepost">
        <form className="post-edit-form" onSubmit={handleSubmit}>
          <div className="card">
            <div className="post-content">
              <div className="form-group title">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group content">
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="post-info">
              <div className="post-social-networks">
                <div className="form-group">
                  <label>Selected Social Networks:</label>
                  <ul className="social-networks">
                    {selectedNetworks.map((network, index) => (
                      <li key={index}>
                        {network.name}{" "}
                        <button
                          type="button"
                          onClick={() => removeNetwork(network.name)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="available-networks">
                    <label>Add Social Network:</label>
                    <ul>
                      {availableSocialNetworks.map((network, index) => (
                        <li key={index}>
                          <button
                            className={
                              selectedNetworks.some(
                                (item) => item.name === network.name
                              )
                                ? "disabled"
                                : "abled"
                            }
                            type="button"
                            onClick={() => addNetwork(network.name)}
                            disabled={selectedNetworks.some(
                              (item) => item.name === network.name
                            )}
                          >
                            Add {network.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="post-status">
                <div className="form-group status">
                  <label htmlFor="state">State:</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Sent">Sent</option>
                  </select>
                </div>
              </div>

              {formData.state === "Scheduled" && (
                <div className="post-status">
                  <div className="form-group status">
                    <label htmlFor="postingdate">Scheduled Date:</label>
                    <input
                      type="datetime-local"
                      id="postingdate"
                      name="postingdate"
                      value={formData.postingdate || ""}
                      min={formatDate()}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={!isModified}>
              Save Changes
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PagePostEdit;
