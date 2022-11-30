import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">
                    Standardise how developers run apps. Enable infrastructure self-service.
                    <br />
                    Scale DevOps.
                </p>

                <div className={styles.buttons}>
                    <Link
                        className={clsx('button button--secondary button--lg', styles.cta)}
                        to="https://github.com/devopzilla/guku-devx">
                        🌟 star us on GitHub
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Guku DevX is a tool for building developer-centric interfaces for your internal developer platform (IDP). Use DevX to standardise how developers run apps and enable infrastructure self-service. <head />">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
