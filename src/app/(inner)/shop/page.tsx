"use client";

import HeaderOne from "@/components/header/HeaderOne";
import { useState, Suspense, useEffect } from "react";
import ShopMain from "./ShopMain";
import ShopMainList from "./ShopMainList";
import FooterOne from "@/components/footer/FooterOne";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PostType {
  category?: string;
  slug: string;
  image: string;
  title?: string;
  author?: string;
  publishedDate?: string;
  price?: string;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const formattedProducts = data.map((item: any) => ({
          slug: item.id,
          image: item.image,
          title: item.title,
          category: item.category,
          price: item.price?.toString(),
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const allCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  const allBrands = [
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "HP",
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleMinPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setMinPrice(val);
  };

  const handleMaxPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setMaxPrice(val);
  };

  const filteredProducts = products.filter((product) => {
    const productPrice = product.price
      ? parseFloat(product.price)
      : 0;

    if (productPrice < minPrice || productPrice > maxPrice) {
      return false;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category || "")
    ) {
      return false;
    }

    if (!searchQuery) return true;

    const title = product.title?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    return (
      title.includes(searchQuery) ||
      category.includes(searchQuery)
    );
  });

  const handlePriceFilterSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <Link href="/">Home</Link>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="#">
                  Shop
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="shop-grid-sidebar-area rts-section-gap">
        <div className="container">
          <div className="row g-0">
            {/* Sidebar */}
            <div className="col-xl-3 col-lg-12 pr--70 pr_lg--10 pr_sm--10 pr_md--5 rts-sticky-column-item">
              <div className="sidebar-filter-main theiaStickySidebar">
                {/* Price Filter */}
                <div className="single-filter-box">
                  <h5 className="title">
                    Widget Price Filter
                  </h5>

                  <div className="filterbox-body">
                    <form
                      action="#"
                      className="price-input-area"
                      onSubmit={handlePriceFilterSubmit}
                    >
                      <div className="half-input-wrapper">
                        <div className="single">
                          <label htmlFor="min">
                            Min price
                          </label>

                          <input
                            id="min"
                            type="number"
                            value={minPrice}
                            min={0}
                            onChange={handleMinPriceChange}
                          />
                        </div>

                        <div className="single">
                          <label htmlFor="max">
                            Max price
                          </label>

                          <input
                            id="max"
                            type="number"
                            value={maxPrice}
                            min={0}
                            onChange={handleMaxPriceChange}
                          />
                        </div>
                      </div>

                      <div className="filter-value-min-max">
                        <span>
                          Price: ${minPrice} — ${maxPrice}
                        </span>

                        <button
                          type="submit"
                          className="rts-btn btn-primary"
                        >
                          Filter
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Categories */}
                <div className="single-filter-box">
                  <h5 className="title">
                    Product Categories
                  </h5>

                  <div className="filterbox-body">
                    <div className="category-wrapper ">
                      {allCategories.map((cat, i) => (
                        <div
                          className="single-category"
                          key={i}
                        >
                          <input
                            id={`cat${i + 1}`}
                            type="checkbox"
                            checked={selectedCategories.includes(
                              cat
                            )}
                            onChange={() =>
                              handleCategoryChange(cat)
                            }
                          />

                          <label htmlFor={`cat${i + 1}`}>
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="single-filter-box">
                  <h5 className="title">
                    Select Brands
                  </h5>

                  <div className="filterbox-body">
                    <div className="category-wrapper">
                      {allBrands.map((brand, i) => (
                        <div
                          className="single-category"
                          key={i}
                        >
                          <input
                            id={`brand${i + 1}`}
                            type="checkbox"
                            checked={selectedBrands.includes(
                              brand
                            )}
                            onChange={() =>
                              handleBrandChange(brand)
                            }
                          />

                          <label htmlFor={`brand${i + 1}`}>
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-xl-9 col-lg-12">
              <div className="filter-select-area">
                <div className="top-filter">
                  <span>
                    Showing {filteredProducts.length} results
                  </span>

                  <div className="right-end">
                    <span>Sort: Latest</span>

                    <div className="button-tab-area">
                      <ul
                        className="nav nav-tabs"
                        id="myTab"
                        role="tablist"
                      >
                        <li
                          className="nav-item"
                          role="presentation"
                        >
                          <button
                            onClick={() =>
                              setActiveTab("tab1")
                            }
                            className={`nav-link single-button ${
                              activeTab === "tab1"
                                ? "active"
                                : ""
                            }`}
                          >
                            Grid
                          </button>
                        </li>

                        <li
                          className="nav-item"
                          role="presentation"
                        >
                          <button
                            onClick={() =>
                              setActiveTab("tab2")
                            }
                            className={`nav-link single-button ${
                              activeTab === "tab2"
                                ? "active"
                                : ""
                            }`}
                          >
                            List
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              {activeTab === "tab1" && (
                <div className="row g-4 mt--20">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(
                      (post: PostType, index: number) => (
                        <div
                          key={index}
                          className="col-lg-4 col-md-6 col-sm-6 col-12"
                        >
                          <div className="single-shopping-card-one">
                            <ShopMain
                              Slug={post.slug}
                              ProductImage={post.image}
                              ProductTitle={post.title}
                              Price={post.price}
                            />
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="col-12 text-center py-5">
                      <h2>No Product Found</h2>
                    </div>
                  )}
                </div>
              )}

              {/* List */}
              {activeTab === "tab2" && (
                <div className="row mt--20">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(
                      (post: PostType, index: number) => (
                        <div
                          key={index}
                          className="col-lg-6"
                        >
                          <div className="single-shopping-card-one discount-offer">
                            <ShopMainList
                              Slug={post.slug}
                              ProductImage={post.image}
                              ProductTitle={post.title}
                              Price={post.price}
                            />
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="col-12 text-center py-5">
                      <h2>No Product Found</h2>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HeaderOne />

      <Suspense
        fallback={
          <div className="text-center py-20">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="mt-3">
              Loading products...
            </p>
          </div>
        }
      >
        <ShopContent />
      </Suspense>

      <FooterOne />
    </>
  );
}