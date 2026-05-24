"use client";

import { useState } from "react";

import HeaderOne from "@/components/header/HeaderOne";

import ShortService from "@/components/service/ShortService";

import FooterOne from "@/components/footer/FooterOne";

import Link from "next/link";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Login failed"
        );

        return;
      }

      // Save token
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(
        "✅ Login Successful!"
      );

      router.push(
        "/dashboard/product-list"
      );
    } catch (error) {
      console.error(error);

      setError(
        "❌ Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-one">
      <HeaderOne />

      {/* Breadcrumb */}
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <Link href="/">
                  Home
                </Link>

                <i className="fa-regular fa-chevron-right" />

                <a
                  className="current"
                  href="#"
                >
                  Log In
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

      {/* Login Area */}
      <div className="rts-register-area rts-section-gap bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="registration-wrapper-1">
                <div className="logo-area mb--0">
                  <img
                    className="mb--10"
                    src="/favicon.ico"
                    alt="logo"
                  />
                </div>

                <h3 className="title">
                  Login Into Your
                  Account
                </h3>

                <form
                  onSubmit={
                    handleLogin
                  }
                  className="registration-form"
                >
                  {/* Error */}
                  {error && (
                    <div
                      style={{
                        background:
                          "#ffe5e5",
                        color: "red",
                        padding:
                          "10px",
                        marginBottom:
                          "15px",
                        borderRadius:
                          "5px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Email */}
                  <div className="input-wrapper">
                    <label htmlFor="email">
                      Email*
                    </label>

                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="input-wrapper">
                    <label htmlFor="password">
                      Password*
                    </label>

                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  {/* Button */}
                  <button
                    className="rts-btn btn-primary"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? "Logging in..."
                      : "Login Account"}
                  </button>

                  {/* Register */}
                  <div className="another-way-to-registration">
                    <div className="registradion-top-text">
                      <span>
                        Or Register
                        With
                      </span>
                    </div>

                    <div className="login-with-brand">
                      <a
                        href="#"
                        className="single"
                      >
                        <img
                          src="/assets/images/form/google.svg"
                          alt="login"
                        />
                      </a>

                      <a
                        href="#"
                        className="single"
                      >
                        <img
                          src="/assets/images/form/facebook.svg"
                          alt="login"
                        />
                      </a>
                    </div>

                    <p>
                      Don't have
                      Account?{" "}
                      <Link href="/register">
                        Registration
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShortService />

      <FooterOne />
    </div>
  );
}