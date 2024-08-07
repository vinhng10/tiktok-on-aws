import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useContents = (userId) => {
  const user = useSelector((state) => state.app.user);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${import.meta.env.VITE_API_URL}/content?userId=${userId}`;

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
        setContents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchContents();
  }, [user]);

  return { contents, loading, error };
};
