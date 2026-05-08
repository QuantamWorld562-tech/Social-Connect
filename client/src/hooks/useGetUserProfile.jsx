import { setUserProfile } from "../redux/authSlice.js"
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetUserProfile(userId) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}/profile`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, dispatch]);
}

export default useGetUserProfile;
