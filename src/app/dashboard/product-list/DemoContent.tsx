"use client";

import React, {
  useEffect,
  useState,
} from "react";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
}

const ProductTable = () => {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filterText, setFilterText] =
    useState("");

  const [
    editingProduct,
    setEditingProduct,
  ] = useState<Product | null>(
    null
  );

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "/api/products"
      );

      const data =
        await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Logout
  const handleLogout = async () => {
    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };

  // Delete product
  const handleDelete = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product.id !== id
          )
        );

        alert(
          "✅ Product Deleted"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to delete product"
      );
    }
  };

  // Update product
  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(
        `/api/products/${editingProduct.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            editingProduct
          ),
        }
      );

      const updated =
        await response.json();

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === updated.id
              ? updated
              : p
          )
        );

        alert(
          "✅ Product Updated"
        );

        setEditingProduct(null);
      }
    } catch (error) {
      console.error(error);

      alert(
        "❌ Update failed"
      );
    }
  };

  const filteredProducts =
    products.filter((product) =>
      product.title
        .toLowerCase()
        .includes(
          filterText.toLowerCase()
        )
    );

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <h2>
          Loading Products...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2>Product List</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Search product..."
            value={filterText}
            onChange={(e) =>
              setFilterText(
                e.target.value
              )
            }
            style={{
              padding: "10px",
              width: "250px",
              border:
                "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          <button
            onClick={
              handleLogout
            }
            style={{
              background:
                "black",
              color: "white",
              border: "none",
              padding:
                "10px 20px",
              borderRadius:
                "5px",
              cursor:
                "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Products */}
      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {filteredProducts.map(
          (product) => (
            <div
              key={product.id}
              style={{
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                padding: "20px",
                display: "flex",
                alignItems:
                  "center",
                gap: "20px",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                width={120}
                height={120}
                style={{
                  objectFit:
                    "cover",
                  borderRadius:
                    "10px",
                }}
              />

              <div
                style={{
                  flex: 1,
                }}
              >
                <h3>
                  {product.title}
                </h3>

                <p>
                  Category:{" "}
                  {
                    product.category
                  }
                </p>

                <p>
                  Price: ₹
                  {product.price}
                </p>

                <p>
                  Stock:{" "}
                  {product.stock}
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() =>
                    setEditingProduct(
                      product
                    )
                  }
                  style={{
                    background:
                      "orange",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 20px",
                    borderRadius:
                      "5px",
                    cursor:
                      "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      product.id
                    )
                  }
                  style={{
                    background:
                      "red",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 20px",
                    borderRadius:
                      "5px",
                    cursor:
                      "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius:
                "10px",
              width: "400px",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Edit Product
            </h2>

            <input
              type="text"
              value={
                editingProduct.title
              }
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  title:
                    e.target.value,
                })
              }
              placeholder="Title"
              style={{
                width: "100%",
                marginBottom:
                  "10px",
                padding: "10px",
              }}
            />

            <input
              type="text"
              value={
                editingProduct.category
              }
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category:
                    e.target.value,
                })
              }
              placeholder="Category"
              style={{
                width: "100%",
                marginBottom:
                  "10px",
                padding: "10px",
              }}
            />

            <input
              type="number"
              value={
                editingProduct.price
              }
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(
                    e.target.value
                  ),
                })
              }
              placeholder="Price"
              style={{
                width: "100%",
                marginBottom:
                  "10px",
                padding: "10px",
              }}
            />

            <input
              type="number"
              value={
                editingProduct.stock
              }
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: Number(
                    e.target.value
                  ),
                })
              }
              placeholder="Stock"
              style={{
                width: "100%",
                marginBottom:
                  "20px",
                padding: "10px",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={
                  handleUpdate
                }
                style={{
                  background:
                    "green",
                  color: "white",
                  border: "none",
                  padding:
                    "10px 20px",
                  borderRadius:
                    "5px",
                  cursor:
                    "pointer",
                }}
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingProduct(
                    null
                  )
                }
                style={{
                  background:
                    "gray",
                  color: "white",
                  border: "none",
                  padding:
                    "10px 20px",
                  borderRadius:
                    "5px",
                  cursor:
                    "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;