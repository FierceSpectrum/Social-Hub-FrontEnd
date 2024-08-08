/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Posts from "../Posts/Posts";
import Pagination from "../Pagination/Pagination";
import Lupa from "../../Accets/Lupa.png";
import "./LoadPost.scss";

const LoadPost = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      await loadPosts();
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const userId = localStorage.getItem("UserId");
      const url = `http://socialhub.codementoria.fsg/api/posts/ByUserId?userId=${userId}`;
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  function formatPostDate(dateString) {
    const options = {
      weekday: 'long',  // Day of the week
      year: 'numeric',  // Full year
      month: 'long',    // Full month name
      day: 'numeric',   // Day of the month
      hour: 'numeric',  // Hour
      minute: 'numeric', // Minute
    };
  
    const date = new Date(dateString);
  
    return date.toLocaleDateString('en-US', options);
  }

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      const filtered = posts.filter((post) => {
        const searchText = searchTerm.toLowerCase();
        const content = [
          post.title,
          post.content,
          post.postingdate,
          formatPostDate(post.postingdate),
          ...(post.socialNetworks || []).map((network) => network.name),
          post.state,
        ]
          .join(" ")
          .toLowerCase();
        return content.includes(searchText);
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
    setCurrentPage(1);
  }, [searchTerm, posts]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredPosts(posts);
  };

  useEffect(() => {
    handleSearch();
    setCurrentPage(1);
  }, [searchTerm, posts, setSearchTerm]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredPosts, currentPage, postsPerPage]);

  return (
    <div className="posts">
      <h1 className="title">All Posts</h1>
      <div className="checkbox">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button className="clear-button" onClick={handleClearSearch}>
            &times;
          </button>
          <button className="search-button" onClick={handleSearch}>
            <img src={Lupa} alt="Search" className="lupa" />
          </button>
        </div>
      </div>
      <div className="containerPost" id="posts">
        <Posts
          posts={currentPosts}
          loading={loading}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="pagination">
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={filteredPosts.length}
          paginate={setCurrentPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default LoadPost;
