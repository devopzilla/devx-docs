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
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className={clsx('button button--secondary button--lg', styles.cta)}
                        to="https://github.com/stakpak/devx">
                        🌟 star us on GitHub
                    </Link>
                    <Link
                        className={clsx('button button--secondary button--lg', styles.cta)}
                        to="https://devxplay.stakpak.dev">
                        🕹️ playground
                    </Link>
                    <Link
                        className={clsx('button button--secondary button--lg', styles.cta)}
                        to="/docs/intro">
                        📖 docs
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
            description={`${siteConfig.tagline} <head />`}>
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
