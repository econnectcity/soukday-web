import React, { useEffect } from "react";
import Home from "@/components/homepage/Home";
import Layout from "../layout/Layout";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";

const Homepage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router?.pathname === "/") {
      dispatch(clearAllFilter());
    }
  }, []);

  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default Homepage;
