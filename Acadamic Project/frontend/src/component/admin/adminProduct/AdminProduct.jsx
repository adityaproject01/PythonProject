import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import prodCss from "./adminProd.module.css";
import deleteImg from "../../../images/banner/delete1.png";
import editImg from "../../../images/banner/edit-button_7124470.png";

import axios from "axios";
const AdminProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [productDetails, setProductDetails] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productSubSubCategory, setProductSubSubCategory] = useState("");
  const [productSubSubSubCategory, setProductSubSubSubCategory] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");

  const [getCategoryDetails, setGetCategoryDetails] = useState([]);
  const [getSubCategoryDetails, setGetSubCategoryDetails] = useState([]);
  const [getSubSubCategoryDetails, setGetSubSubCategoryDetails] = useState([]);
  const [getSubSubSubCategoryDetails, setGetSubSubSubCategoryDetails] =
    useState([]);
  const UN = localStorage.getItem("user");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productCategory) fetchSubCategories(productCategory);
    else setGetSubCategoryDetails([]);
  }, [productCategory]);

  useEffect(() => {
    if (productSubCategory) fetchSubSubCategories(productSubCategory);
    else setGetSubSubCategoryDetails([]);
  }, [productSubCategory]);

  useEffect(() => {
    if (productSubSubCategory) fetchSubSubSubCategories(productSubSubCategory);
    else setGetSubSubSubCategoryDetails([]);
  }, [productSubSubCategory]);

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products/allProducts", {
        headers: { Authorization: token },
      })
      .then((res) => setProductDetails(res.data.products))
      .catch((err) => console.log("Fetch my-products error", err));
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/category")
      .then((res) => setGetCategoryDetails(res.data))
      .catch((err) => console.log("Fetch category error", err));
  };

  const fetchSubCategories = (categoryId) => {
    axios
      .get(`http://localhost:5000/api/subcategories/category/${categoryId}`)
      .then((res) => setGetSubCategoryDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch subcategories", err);
        setGetSubCategoryDetails([]);
      });
  };

  const fetchSubSubCategories = (subcategoryId) => {
    axios
      .get(
        `http://localhost:5000/api/subsubcategory/subcategory/${subcategoryId}`
      )
      .then((res) => setGetSubSubCategoryDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch sub-subcategories", err);
        setGetSubSubCategoryDetails([]);
      });
  };

  const fetchSubSubSubCategories = (subSubcategoryId) => {
    axios
      .get(
        `http://localhost:5000/api/subsubsubcategory/subsubcategory/${subSubcategoryId}`
      )
      .then((res) => setGetSubSubSubCategoryDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch sub-sub-subcategories", err);
        setGetSubSubSubCategoryDetails([]);
      });
  };

  const productDelete = (productId) => {
    axios
      .delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: token },
      })
      .then(() => fetchProducts())
      .catch((err) => console.log("DeleteError", err));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productSubSubSubCategory) {
      alert("Please select a SubSubSubCategory.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("sub_sub_subcategory_id", productSubSubSubCategory);
    formData.append("description", productDescription);
    formData.append("image", productImage);

    try {
      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handlEditProduct = async (e, productId) => {
    e.preventDefault();
    if (!productSubSubSubCategory) {
      alert("Please select a SubSubSubCategory.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("sub_sub_subcategory_id", productSubSubSubCategory);
    formData.append("description", productDescription);
    if (productImage) formData.append("image", productImage);

    try {
      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      fetchProducts();
      closeModal();
    } catch (error) {
      console.log("errorEdit", error);
    }
  };

  const closeModal = () => {

    setIsEditing(false);
    setCurrentEditId(null);
    setProductName("");
    setProductPrice("");
    setProductQuantity("");
    setProductCategory("");
    setProductSubCategory("");
    setProductSubSubCategory("");
    setProductSubSubSubCategory("");
    setProductImage(null);
    setProductDescription("");
  };

  return (
    <div className={prodCss.adminContainer}>
      <Outlet />
      <nav className={prodCss.glassNavbar}>
        <button className={prodCss.navBtn} onClick={() => navigate("/admin")}>
          Home
        </button>
        <div className={prodCss.navTitle}>Welcome, Admin</div>

        <button className={prodCss.navBtn} onClick={logoutButton}>
          Logout
        </button>
      </nav>

      {isEditing && (
        <div className={prodCss.modalBackdrop}>
          <div className={`${prodCss.modalContainer} ${prodCss.glassCard}`}>
            <div className={prodCss.adminCatModalBody}>
              <h2>Edit Product</h2>
            </div>
            <div className={prodCss.productForm}>
              <form
                onSubmit={(e) => {
                  handlEditProduct(e, currentEditId);
                }}
              >
                <div className={prodCss.productField}>
                  <label>Name</label>
                  <input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className={prodCss.productField}>
                  <label>Price</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                <div className={prodCss.productField}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                  />
                </div>
                <div className={prodCss.productField}>
                  <label>Category</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {getCategoryDetails.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={prodCss.productField}>
                  <label>SubCategory</label>
                  <select
                    value={productSubCategory}
                    onChange={(e) => setProductSubCategory(e.target.value)}
                  >
                    <option value="">Select SubCategory</option>
                    {getSubCategoryDetails.map((sub) => (
                      <option
                        className={prodCss.option}
                        key={sub.subcategory_id}
                        value={sub.subcategory_id}
                      >
                        {sub.subcategory_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={prodCss.productField}>
                  <label>SubSubCategory</label>
                  <select
                    value={productSubSubCategory}
                    onChange={(e) => setProductSubSubCategory(e.target.value)}
                  >
                    <option value="">Select SubSubCategory</option>
                    {getSubSubCategoryDetails.map((sub) => (
                      <option key={sub.subsub_id} value={sub.subsub_id}>
                        {sub.subsub_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={prodCss.productField}>
                  <label>SubSubSubCategory</label>
                  <select
                    value={productSubSubSubCategory}
                    onChange={(e) =>
                      setProductSubSubSubCategory(e.target.value)
                    }
                  >
                    <option value="">Select SubSubSubCategory</option>
                    {getSubSubSubCategoryDetails.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={prodCss.productField}>
                  <label>Image</label>
                  <input
                    type="file"
                    onChange={(e) => setProductImage(e.target.files[0])}
                  />
                </div>
                <div className={prodCss.productField}>
                  <label>Description</label>
                  <input
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                </div>
                <div className={prodCss.productField}>
                  <button className={prodCss.btn} type="submit">
                    {isEditing ? "Update" : "Submit"}
                  </button>
                  <button className={prodCss.btn} onClick={closeModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className={prodCss.sellerGlassCard}>
        <div className={prodCss.scrollWrapper}>
          <div className={prodCss.product}>
            <div className={prodCss.productDetails}>SlNo</div>
            <div className={prodCss.productDetails}>Name</div>
            <div className={prodCss.productDetails}>Price</div>
            <div className={prodCss.productDetails}>Quantity</div>
            <div className={prodCss.productDetails}>Image</div>
            <div className={prodCss.productDetails}>Description</div>
            <div className={prodCss.productDetails}>Actions</div>
          </div>

          {productDetails.map((product, index) => (
            <div className={prodCss.product} key={index}>
              <p className={prodCss.productDetails}>{index + 1}</p>
              <p className={prodCss.productDetails}>{product.name}</p>
              <p className={prodCss.productDetails}>{product.price}</p>
              <p className={prodCss.productDetails}>{product.quantity}</p>
              <p className={prodCss.productDetails}>
                <img src={product.image_url} alt="product" height="100" />
              </p>
              <p className={prodCss.productDetailsDescription}>
                {product.description}
              </p>
              <p className={prodCss.productDetails}>
                <button
                  className={prodCss.actionButton}
                  onClick={() => {
                    setIsEditing(true);
                    setCurrentEditId(product.id);
                  }}
                >
                  <img src={editImg} alt="edit" />
                </button>
                <button
                  className={prodCss.actionButton}
                  onClick={() => productDelete(product.id)}
                >
                  <img src={deleteImg} alt="delete" />
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
