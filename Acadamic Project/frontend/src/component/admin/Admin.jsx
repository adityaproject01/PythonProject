import React from "react";
import { useNavigate } from "react-router-dom";
import adminCss from "./admin.module.css";

const Admin = () => {
  const navigate = useNavigate();
 const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <div className={adminCss.dashboardWrapper}>
      {/* Sidebar */}
      <div className={adminCss.topNav}>
        <div className={adminCss.logo}>AdminHub</div>
        <nav className={adminCss.navLinks}>
          {/* <button onClick={() => navigate('/admin/dashboard')}> Dashboard</button> */}
          <span className={adminCss.userName}>Admin</span>
          <button onClick={logoutButton}className={adminCss.btn}>Logout</button>
          <div className={adminCss.profilePic}></div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className={adminCss.dashboardMain}>
          <div className={adminCss.cardContainer}>
            <div
              className={adminCss.glassCard}
              onClick={() => navigate("/admin/admincategory")}
            >
              Categories
            </div>
            <div
              className={adminCss.glassCard}
              onClick={() => navigate("/admin/adminsubcategory")}
            >
              Subcategories
            </div>
            <div
              className={adminCss.glassCard}
              onClick={() => navigate("/admin/adminproduct")}
            >
              Products
            </div>
            <div
              className={adminCss.glassCard}
              onClick={() => navigate("/admin/adminusers")}
            >
              Users
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
