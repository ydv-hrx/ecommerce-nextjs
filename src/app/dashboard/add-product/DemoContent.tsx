"use client";

import React, { useState } from "react";
import Image from "next/image";

const AddProductPage = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    regularPrice: "",
    salePrice: "",
    productSize: "",
    stock: "",
    sku: "",
    category: "",
    tag: "",
    description: "",
    image: null as File | null,
    previewImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0];

      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage:
          URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      let uploadedImageUrl =
        formData.previewImage;

      // Upload image to Cloudinary
      if (
        formData.image &&
        formData.previewImage.startsWith(
          "blob:"
        )
      ) {
        const reader = new FileReader();

        const base64Image =
          await new Promise<string>(
            (resolve, reject) => {
              reader.readAsDataURL(
                formData.image!
              );

              reader.onload = () =>
                resolve(
                  reader.result as string
                );

              reader.onerror = reject;
            }
          );

        const uploadResponse =
          await fetch("/api/upload", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              image: base64Image,
            }),
          });

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error ||
              "Image upload failed"
          );
        }

        uploadedImageUrl =
          uploadData.imageUrl;
      }

      // Save product in MongoDB
      const response = await fetch(
        "/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              formData.productName,

            description:
              formData.description,

            price: Number(
              formData.salePrice ||
                formData.regularPrice
            ),

            image:
              uploadedImageUrl,

            category:
              formData.category,

            stock: Number(
              formData.stock
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert(
          "✅ Product Added Successfully!"
        );

        setFormData({
          productName: "",
          regularPrice: "",
          salePrice: "",
          productSize: "",
          stock: "",
          sku: "",
          category: "",
          tag: "",
          description: "",
          image: null,

          previewImage:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        });

        console.log(
          "Saved Product:",
          data
        );
      } else {
        alert(
          data.error ||
            "❌ Failed to add product"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "❌ Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      productName: "",
      regularPrice: "",
      salePrice: "",
      productSize: "",
      stock: "",
      sku: "",
      category: "",
      tag: "",
      description: "",
      image: null,

      previewImage:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    });
  };

  return (
    <div
      className="body-root-inner"
      style={{
        paddingBottom: "200px",
      }}
    >
      <div className="transection">
        <div className="vendor-list-main-wrapper product-wrapper add-product-page">
          <div className="card-body table-product-select">
            <div className="header-two show right-collups-add-product">
              <div className="right-collups-area-top">
                <h6
                  className="title"
                  style={{
                    fontSize: "32px",
                  }}
                >
                  Add New Product
                </h6>

                <p>
                  Add information and
                  create new product
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="input-main-wrapper"
              >
                <div className="single-input">
                  <label htmlFor="productName">
                    Product Name
                  </label>

                  <input
                    type="text"
                    id="productName"
                    placeholder="iPhone 15 Pro"
                    value={
                      formData.productName
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="regularPrice">
                    Regular Price
                  </label>

                  <input
                    type="number"
                    id="regularPrice"
                    placeholder="240"
                    value={
                      formData.regularPrice
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="salePrice">
                    Sale Price
                  </label>

                  <input
                    type="number"
                    id="salePrice"
                    placeholder="250"
                    value={
                      formData.salePrice
                    }
                    onChange={
                      handleInputChange
                    }
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="size">
                    Add Size
                  </label>

                  <select className="nice-select size">
                    <option>
                      Small
                    </option>
                    <option>
                      Large
                    </option>
                    <option>
                      XL Size
                    </option>
                    <option>
                      XXL Size
                    </option>
                  </select>
                </div>

                <div className="single-input">
                  <label htmlFor="stock">
                    Stock
                  </label>

                  <input
                    type="number"
                    id="stock"
                    placeholder="530"
                    value={formData.stock}
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="sku">
                    SKU
                  </label>

                  <input
                    type="text"
                    id="sku"
                    placeholder="3245"
                    value={formData.sku}
                    onChange={
                      handleInputChange
                    }
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="category">
                    Category
                  </label>

                  <input
                    type="text"
                    id="category"
                    placeholder="Electronics"
                    value={
                      formData.category
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="tag">
                    Tag
                  </label>

                  <input
                    type="text"
                    id="tag"
                    placeholder="Mobile, Apple"
                    value={formData.tag}
                    onChange={
                      handleInputChange
                    }
                  />
                </div>

                <div className="single-input">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    placeholder="Type product description..."
                    value={
                      formData.description
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div className="single-input">
                  <div className="file-upload-add-product">
                    <div className="profile-left">
                      <div className="profile-image mb--30">
                        <Image
                          src={
                            formData.previewImage
                          }
                          alt="Product Preview"
                          width={140}
                          height={140}
                          id="rts_image"
                        />

                        <span>
                          Upload Product
                          Image
                        </span>
                      </div>

                      <div className="button-area">
                        <div className="brows-file-wrapper">
                          <input
                            name="rts_images1"
                            id="rts_images1"
                            type="file"
                            accept="image/*"
                            onChange={
                              handleImageChange
                            }
                            hidden
                          />

                          <label
                            htmlFor="rts_images1"
                            className="rts-btn btn-primary"
                            style={{
                              cursor:
                                "pointer",
                              padding:
                                "12px 20px",
                              display:
                                "inline-block",
                              marginTop:
                                "10px",
                            }}
                          >
                            Upload Image
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="button-area-botton-wrapper-p-list">
                  <button
                    type="submit"
                    className="rts-btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : "Save Product"}
                  </button>

                  <button
                    type="button"
                    className="rts-btn btn-primary bg-transparent"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <div className="left">
          <p>
            Copyright © 2026 All
            Rights Reserved.
          </p>
        </div>

        <ul>
          <li>
            <a href="#">Terms</a>
          </li>

          <li>
            <a href="#">
              Privacy
            </a>
          </li>

          <li>
            <a href="#">Help</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddProductPage;