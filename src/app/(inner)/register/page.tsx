"use client";

import { useState } from "react";

import HeaderOne from "@/components/header/HeaderOne";

import ShortService from "@/components/service/ShortService";

import FooterOne from "@/components/footer/FooterOne";

import Link from "next/link";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
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
            "Registration failed"
        );

        return;
      }

      alert(
        "✅ Registration Successful!"
      );

      router.push("/login");
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
                  Register
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

      {/* Register Area */}
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
                  Register Into Your
                  Account
                </h3>

                <form
                  onSubmit={
                    handleRegister
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

                  {/* Username */}
                  <div className="input-wrapper">
                    <label htmlFor="name">
                      Username*
                    </label>

                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

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
                      ? "Registering..."
                      : "Register Account"}
                  </button>

                  {/* Social */}
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
                      Already Have
                      Account?{" "}
                      <Link href="/login">
                        Login
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