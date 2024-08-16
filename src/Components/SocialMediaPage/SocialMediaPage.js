import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./SocialMediaPage.scss";

const SocialMediaPage = () => {
  const navigate = useNavigate();
  const [linkedSocialMedia, setLinkedSocialMedia] = useState([]);
  const [unlinkedSocialMedia, setUnlinkedSocialMedia] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const url = "http://socialhub.codementoria.fsg/api/social-media/linked";
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch social media");

        const socialMediaData = await response.json();
        const linked = Object.keys(socialMediaData)
          .filter((key) => socialMediaData[key])
          .map((key) => key.charAt(0).toUpperCase() + key.slice(1));
        const unlinked = Object.keys(socialMediaData)
          .filter((key) => !socialMediaData[key])
          .map((key) => key.charAt(0).toUpperCase() + key.slice(1));

        setLinkedSocialMedia(linked);
        setUnlinkedSocialMedia(unlinked);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSocialMedia();

    const fetchCodeFromUrl = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");
      const platformFromUrl = queryParams.get("source");

      if (code && platformFromUrl) {
        try {
          const response = await fetch(
            `http://socialhub.codementoria.fsg/api/${platformFromUrl}User`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ authorizationCode: code }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to link ${platformFromUrl} account`);
          }

          alert(
            `${
              platformFromUrl.charAt(0).toUpperCase() + platformFromUrl.slice(1)
            } account linked successfully`
          );
          navigate("/SocialMedia");
          window.location.reload();
        } catch (error) {
          setError(error.message);
        }
      }
    };

    fetchCodeFromUrl();
  }, [navigate]);

  const handleLink = (network) => {
    const baseUrls = {
      Reddit: "https://www.reddit.com/api/v1/authorize",
      Mastodon: "https://mastodon.social/oauth/authorize",
    };

    const scopes = {
      Reddit: "submit",
      Mastodon: "read write",
    };

    const redirectUri = "http://socialhub.codementoria.fsb/SocialMedia";

    if (network in baseUrls) {
      window.location.href = `${baseUrls[network]}?client_id=${
        network === "Reddit"
          ? "Xgiu9ZlKiuH1OPxryz3xOg"
          : "ftpm2pr_yCjsZ8Hx1sBOKnjW1GDI-8g4OFuFKDSt5tg"
      }&response_type=code&redirect_uri=${redirectUri}/${network}&scope=${
        scopes[network]
      }${
        network === "Reddit" ? "&state=RANDOM_STRING&duration=temporary" : ""
      }`;
    }
  };

  const handleUnlink = async (network) => {
    try {
      const url = `http://socialhub.codementoria.fsg/api/${network.toLowerCase()}User`;
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to unlink social media");

      alert(`${network} account unlinked successfully`);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="social-media-page">
        <h1>Redes Sociales</h1>
        {error && <p className="error">{error}</p>}

        <div className="social-media-section">
          <h2>Redes Sociales Linkeadas</h2>
          <ul>
            {linkedSocialMedia.length ? (
              linkedSocialMedia.map((network) => (
                <li key={network}>
                  {network}
                  <button onClick={() => handleUnlink(network)}>
                    Deslinkear
                  </button>
                </li>
              ))
            ) : (
              <p>No tienes redes sociales linkeadas.</p>
            )}
          </ul>
        </div>

        <div className="social-media-section">
          <h2>Redes Sociales No Linkeadas</h2>
          <ul>
            {unlinkedSocialMedia.length ? (
              unlinkedSocialMedia.map((network) => (
                <li key={network}>
                  {network}
                  <button onClick={() => handleLink(network)}>Linkear</button>
                </li>
              ))
            ) : (
              <p>No tienes redes sociales no linkeadas.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SocialMediaPage;
