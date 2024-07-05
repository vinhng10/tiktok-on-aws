import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProperty } from "../components/utils";

export const useNewFeeds = () => {
  const user = useSelector((state) => state.app.user);
  const [newFeeds, setNewFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewFeeds = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          userId: getProperty(user.idToken, "sub"),
          num: "10",
        });
        const url = `${import.meta.env.VITE_API_URL}/newfeeds?${params}`;

        const headers = new Headers({
          "Content-Type": "application/json",
          Authorization: user.idToken,
        });

        const requestOptions = {
          method: "GET",
          headers: headers,
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setNewFeeds(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchNewFeeds();
  }, [user]);

  return { newFeeds, loading, error };
};
