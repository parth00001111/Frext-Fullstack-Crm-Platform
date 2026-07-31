import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../UI/Loader";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const ProtectedRoute = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader label="Checking session" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
