import React from "react";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/client";
import Seo from "../components/seo";
import Articles from "../components/articles";
import Head from "next/head";
import Link from "next/link";
import { fetchAPI } from "../lib/api";

const IndexPage = ({
  session,
  articles,
  categories,
  homepage,
}: {
  session: Session;
  articles: any;
  categories: any;
  homepage: any;
}) => {
  const signInButtonNode = () => {
    if (session) {
      return false;
    }

    return (
      <div>
        <Link href="/api/auth/signin">
          <button
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Sign In
          </button>
        </Link>
      </div>
    );
  };

  const signOutButtonNode = () => {
    if (!session) {
      return false;
    }

    return (
      <div>
        <Link href="/api/auth/signout">
          <button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </button>
        </Link>
        <Seo seo={homepage.seo} />
        <div className="uk-section">
          <div className="uk-container uk-container-large">
            <h1>{homepage.hero.title}</h1>
            <Articles articles={articles} />
          </div>
        </div>
      </div>
    );
  };

  if (!session) {
    return (
      <div className="hero">
        <div className="navbar">
          {signOutButtonNode()}
          {signInButtonNode()}
        </div>
        <div className="text">{"You aren't authorized to view this page"}</div>
      </div>
    );
  }

  return (
    <div className="hero">
      <Head>
        <title>Index Page</title>
      </Head>
      <div className="navbar">
        {signOutButtonNode()}
        {signInButtonNode()}
      </div>
      <div className="text">Hello world</div>
    </div>
  );
};

export async function getStaticProps() {
  // Run API calls in parallel
  const [articles, categories, homepage] = await Promise.all([
    fetchAPI("/articles"),
    fetchAPI("/categories"),
    fetchAPI("/homepage"),
  ]);

  return {
    props: { articles, categories, homepage },
    revalidate: 1,
  };
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  return {
    props: {
      session,
    },
  };
};

export default IndexPage;
