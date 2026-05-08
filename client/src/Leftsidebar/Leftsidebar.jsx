import "./Leftsidebar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import CreatePost from "../Components/createPost/CreatePost";
import Search from "../Components/search/Search";
import { useDispatch, useSelector } from "react-redux";
import { clearNotifications } from "../redux/rtnSlice";
import { logout } from "../redux/authSlice";
import logo from "../assets/logo.webp";
import { BASE_URL } from "../lib/config";

const sidebarItems = [
  { icon: <span className="material-symbols-outlined">home</span>, text: "Home" },
  { icon: <span className="material-symbols-outlined">search</span>, text: "Search" },
  { icon: <span className="material-symbols-outlined">moving</span>, text: "Explore" },
  { icon: <span className="material-symbols-outlined">chat_bubble</span>, text: "Message" },
  { icon: <span className="material-symbols-outlined">favorite</span>, text: "Notifications" },
  { icon: <span className="material-symbols-outlined">image_arrow_up</span>, text: "Create" },
  { icon: <span className="material-symbols-outlined">account_box</span>, text: "Profile" },
  { icon: <span className="material-symbols-outlined">logout</span>, text: "Logout" },
];

function Leftsidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [prevActiveItem, setPrevActiveItem] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);
 

  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout());
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarHandler = (textType) => {
    setActiveItem(textType);
    if (textType === "Logout") logoutHandler();
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") navigate(`/profile/${user?._id}`);
    else if (textType === "Home") navigate("/");
    else if (textType === "Message") navigate("/chat");
    else if (textType === "Explore") navigate("/explore");
    else if (textType === "Search") {
      setPrevActiveItem(activeItem);
      setShowSearch(true);
    }
    else if (textType === "Notifications") {
      setPrevActiveItem(activeItem);
      setActiveItem(prevActiveItem);
    }
  };

  return (
    <div className="left-can">
      <div className="left-box">
        <img src={logo} alt="logo" className="logo" />

        {sidebarItems.map((item, index) => (
          <div
            className={`left ${item.text === "Notifications" ? "notif-row" : ""} ${activeItem === item.text ? "left-active" : ""}`}
            key={index}
            onClick={() => sidebarHandler(item.text)}
          >
            {item.icon}
            <span className="left-text">{item.text}</span>

            {item.text === "Notifications" && (
              <>
                {likeNotification.length > 0 && (
                  <span className="notif-badge">{likeNotification.length}</span>
                )}
                <div className="notif-popup" onMouseLeave={() => dispatch(clearNotifications())}>
                  <p className="notif-popup-title">Notifications</p>
                  {likeNotification.length === 0 ? (
                    <p className="notif-empty">No new notifications</p>
                  ) : (
                    likeNotification.map((notification) => (
                      <div key={notification.userId} className="notif-item">
                        <img
                          src={notification.userDetails?.profilePicture}
                          alt={notification.userDetails?.username}
                          className="notif-avatar"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <div className="notif-info">
                          <span className="notif-username">{notification.userDetails?.username}</span>
                          <span className="notif-text">liked your post</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
      {showSearch && <Search onClose={() => { setShowSearch(false); setActiveItem(prevActiveItem); }} />}
    </div>
  );
}

export default Leftsidebar;
